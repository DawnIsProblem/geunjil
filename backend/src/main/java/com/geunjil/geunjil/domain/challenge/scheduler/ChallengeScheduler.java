package com.geunjil.geunjil.domain.challenge.scheduler;

import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
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
    private final FirebaseNotificationService firebaseNotificationService;
    private final UserDeviceTokenRepository userDeviceTokenRepository;

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

    @Scheduled(fixedRate = 60000) // 1분 간격
    public void checkChallengeStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Challenge> challenges = challengeRepository.findByStatusIn(List.of(Status.PENDING, Status.ONGOING));

        for (Challenge ch : challenges) {
            LocalDateTime startTime = LocalDateTime.of(ch.getDay(), ch.getStartTime());
            LocalDateTime endTime = LocalDateTime.of(ch.getDay(), ch.getEndTime());

            if (ch.getStatus() == Status.PENDING && now.isAfter(startTime)) {
                ch.setStatus(Status.ONGOING);
                challengeRepository.save(ch);
                log.info("챌린지 {} 가 자동 시작되었습니다.", ch.getTitle());
            }

            if (ch.getStatus() == Status.ONGOING && now.isBefore(endTime)) {
                checkOngoingChallenge(ch);
            }

            if (ch.getStatus() == Status.ONGOING && now.isAfter(endTime)) {
                if (checkGpsInside(ch)) {
                    ch.setStatus(Status.SUCCESS);
                    log.info("챌린지 {} 성공 처리!", ch.getTitle());
                } else {
                    ch.setStatus(Status.FAIL);
                    log.info("챌린지 {} 실패 처리 (종료 시 GPS 범위 벗어남).", ch.getTitle());
                }
                challengeRepository.save(ch);
            }
        }
    }

    private void checkOngoingChallenge(Challenge ch) {
        if (!checkGpsInside(ch)) {
            ch.setWarningCount(ch.getWarningCount() + 1);
            if (ch.getWarningCount() >= 3) {
                ch.setStatus(Status.FAIL);
                log.info("챌린지 {} 경고 3회 이상 → 실패 처리.", ch.getTitle());
            }
            challengeRepository.save(ch);
        }
    }

    private boolean checkGpsInside(Challenge challenge) {
        // TODO: 실제로는 현재 사용자의 위치를 가져와 (lat, lng) 와 비교
        // 임시: 항상 true 반환
        return true;
    }

}
