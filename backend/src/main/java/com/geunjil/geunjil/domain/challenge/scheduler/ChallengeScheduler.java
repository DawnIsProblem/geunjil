package com.geunjil.geunjil.domain.challenge.scheduler;

import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUserLocationDto;
import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.challenge.service.ChallengeUserLocationRedisService;
import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.notification.entity.UserDeviceToken;
import com.geunjil.geunjil.domain.notification.repository.UserDeviceTokenRepository;
import com.geunjil.geunjil.domain.notification.service.FirebaseNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChallengeScheduler {

    private final ChallengeRepository challengeRepository;
    private final MyPageRepository mypageRepository;
    private final FirebaseNotificationService firebaseNotificationService;
    private final UserDeviceTokenRepository userDeviceTokenRepository;
    private final ChallengeUserLocationRedisService userLocationRedisService;

    /**
     * 1분마다 Pending 상태의 챌린지를 검사 진행.
     * 시작 10분 전 또는 5분 전이면 FCM 알림을 발송.
     */
    @Scheduled(fixedRate =60000) // 1분 간격
    public void checkAndNotify() {
        LocalDateTime now = LocalDateTime.now();
        List<Challenge> pendingChallenge = challengeRepository.findByStatus(Status.PENDING);

        for (Challenge ch : pendingChallenge) {
            LocalDateTime challengeStart = LocalDateTime.of(ch.getDay(), ch.getStartTime());
            Long minutesLeft = Duration.between(now, challengeStart).toMinutes();

            log.info("챌린지 {} 시작까지 {}분 남음", ch.getTitle(), minutesLeft);

            if (minutesLeft == 10 || minutesLeft == 5) {
                List<UserDeviceToken> deviceTokens = userDeviceTokenRepository.findByUser(ch.getUserId());

                if (deviceTokens.isEmpty()) {
                    log.warn("✅사용자 '{}' 의 등록된 디바이스 토큰이 없습니다. (알림 발송 스킵)", ch.getUserId().getId());
                    continue;
                }

                for (UserDeviceToken token : deviceTokens) {
                    firebaseNotificationService.sendNotification(
                            token.getDeviceToken(),
                            "챌린지 알림",
                            minutesLeft + "분 뒤 '" + ch.getTitle() + "' 챌린지가 시작됩니다! 미리 운동 장소에 위치해주세요!"
                    );
                }

                log.info("✅'{}' 챌린지에 대한 {}분 전 알림 전송 완료", ch.getTitle(), minutesLeft);
            }
        }
    }

    @Scheduled(fixedRate = 60000)
    public void checkChallengeStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Challenge> challenges = challengeRepository.findByStatusIn(
                List.of(Status.PENDING, Status.ONGOING));

        for (Challenge ch : challenges) {
            LocalDateTime startTime = LocalDateTime.of(ch.getDay(), ch.getStartTime());
            LocalDateTime endTime   = LocalDateTime.of(ch.getDay(), ch.getEndTime());

            // 1) PENDING → ONGOING
            if (ch.getStatus() == Status.PENDING && now.isAfter(startTime)) {
                ch.setStatus(Status.ONGOING);
                challengeRepository.save(ch);
                log.info("챌린지 {} 자동 시작", ch.getTitle());

                // 2) ONGOING 중: 아직 종료 전 → 위치 검증 & 경고 누적
            } else if (ch.getStatus() == Status.ONGOING && now.isBefore(endTime)) {
                checkOngoingChallenge(ch);

                // 3) ONGOING 중: 종료 시점 지난 후 → 최종 SUCCESS / FAIL
            } else if (ch.getStatus() == Status.ONGOING && now.isAfter(endTime)) {
                boolean inside = checkGpsInside(ch);
                Mypage mypage = mypageRepository.findByUser(ch.getUserId());

                // 3-1) 경고 3회 이상 → 무조건 FAIL
                if (ch.getWarningCount() >= 3) {
                    ch.setStatus(Status.FAIL);
                    mypage.setFailChallenge(mypage.getFailChallenge() + 1);
                    log.info("챌린지 {} 실패 처리 (경고 3회 이상)", ch.getTitle());

                    // 3-2) GPS 안에 있으면 SUCCESS, 아니면 FAIL
                } else if (inside) {
                    ch.setStatus(Status.SUCCESS);
                    mypage.setSuccessChallenge(mypage.getSuccessChallenge() + 1);
                    log.info("챌린지 {} 성공 처리 (종료 시 GPS 안)", ch.getTitle());
                } else {
                    ch.setStatus(Status.FAIL);
                    mypage.setFailChallenge(mypage.getFailChallenge() + 1);
                    log.info("챌린지 {} 실패 처리 (종료 시 GPS 벗어남)", ch.getTitle());
                }

                // 저장 순서 중요: status 먼저, 그 다음 마이페이지
                challengeRepository.save(ch);
                mypageRepository.save(mypage);
            }
        }
    }

    private void checkOngoingChallenge(Challenge ch) {
        if (!checkGpsInside(ch)) {
            ch.setWarningCount(ch.getWarningCount() + 1);

            log.warn("⛔️ 챌린지 {} 경고! 범위 안으로 이동해주세요! (누적: {}/{})", ch.getTitle(), ch.getWarningCount(), 3);

            if (ch.getWarningCount() >= 3) {
                ch.setStatus(Status.FAIL);
                log.info("챌린지 {} 경고 3회 이상 → 실패 처리.", ch.getTitle());
            }
            challengeRepository.save(ch);
        }
    }

    public boolean checkGpsInside(Challenge challenge) {
        Long challengeId = challenge.getId();
        Long userId = challenge.getUserId().getId();

        ChallengeUserLocationDto latest = userLocationRedisService.getLocation(challengeId, userId);
        if (latest == null) return false;

        double userLat = latest.getLat();
        double userLng = latest.getLng();
        double targetLat = challenge.getLat();
        double targetLng = challenge.getLng();
        int radiusMeter = challenge.getRadius();

        double distance = haversine(userLat, userLng, targetLat, targetLng);
        return distance <= radiusMeter;
    }

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371000; // 지구 반지름(m)
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // meter 단위
    }


}
