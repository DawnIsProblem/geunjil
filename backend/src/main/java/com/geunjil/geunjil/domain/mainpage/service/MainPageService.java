package com.geunjil.geunjil.domain.mainpage.service;

import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetCurrentChallengeResponseDto;
import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetNextChallengeInfoResponseDto;
import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetResultResponseDto;
import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.mainpage.dto.response.MainPageInfoResponseDto;
import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional
public class MainPageService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;
    private final MyPageRepository mypageRepository;

    public MainPageInfoResponseDto getMainPageInfo(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("해당 아이디가 없습니다."));

        // 진행 중인 챌린지
        Challenge currentChallenge = challengeRepository
                .findTopByUserIdAndStatusOrderByStartTimeDesc(user, Status.ONGOING)
                .orElse(null);

        ChallengeGetCurrentChallengeResponseDto currentChallengeDto = null;
        if (currentChallenge != null) {
            // 진행율 계산 로직
            LocalTime now = LocalTime.now();
            LocalTime start = currentChallenge.getStartTime();
            LocalTime end = currentChallenge.getEndTime();

            int progressPercent = 0;

            if (now.isAfter(start) && now.isBefore(end)) {
                long total = end.toSecondOfDay() - start.toSecondOfDay();
                long done = now.toSecondOfDay() - start.toSecondOfDay();
                progressPercent = (int) ((done * 100.0) / total);
            } else if (now.isAfter(end)) {
                progressPercent = 100;
            }

            currentChallengeDto = ChallengeGetCurrentChallengeResponseDto.builder()
                    .title(currentChallenge.getTitle())
                    .startTime(currentChallenge.getStartTime())
                    .endTime(currentChallenge.getEndTime())
                    .location(currentChallenge.getLocation())
                    .progressPercent(progressPercent)
                    .build();

        }

        // 다음 챌린지
        Challenge nextChallenge = challengeRepository
                .findTopByUserIdAndStatusOrderByStartTimeAsc(
                        user, Status.PENDING)
                .orElse(null);

        ChallengeGetNextChallengeInfoResponseDto nextChallengeDto = null;
        if (nextChallenge != null) {
            nextChallengeDto = ChallengeGetNextChallengeInfoResponseDto.builder()
                    .id(nextChallenge.getId())
                    .title(nextChallenge.getTitle())
                    .date(nextChallenge.getDay())
                    .startTime(nextChallenge.getStartTime())
                    .endTime(nextChallenge.getEndTime())
                    .location(nextChallenge.getLocation())
                    .build();
        }

        // 챌린지 성과
        Mypage mypage = mypageRepository.findByUser(user);
        ChallengeGetResultResponseDto resultDto = (mypage != null)
                ? ChallengeGetResultResponseDto.builder()
                .success(mypage.getSuccessChallenge())
                .stoped(mypage.getStopedChallenge())
                .fail(mypage.getFailChallenge())
                .build()
                : ChallengeGetResultResponseDto.builder()
                .success(0).stoped(0).fail(0)
                .build();

        return MainPageInfoResponseDto.builder()
                .currentChallenge(currentChallengeDto)
                .nextChallenge(nextChallengeDto)
                .result(resultDto)
                .build();
    }
}