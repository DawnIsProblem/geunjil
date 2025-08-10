package com.geunjil.geunjil.domain.challenge.service;

import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeCreateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUpdateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.response.*;
import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final MyPageRepository mypageRepository;
    private final UserRepository userRepository;

    public ChallengeCreateChallengeResponseDto createChallenge(String loginId, ChallengeCreateChallengeRequestDto request) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        Challenge challenge = Challenge.builder()
                .userId(user)
                .title(request.getTitle())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .day(request.getDay())
                .location(request.getLocation())
                .lat(request.getLat())
                .lng(request.getLng())
                .radius(request.getRadius())
                .warningCount(0)
                .status(Status.PENDING)
                .build();

        challengeRepository.save(challenge);

        Mypage mypage = mypageRepository.findByUser(user);
        mypage.setTotalChallenge(mypage.getTotalChallenge() + 1);
        mypageRepository.save(mypage);

        return ChallengeCreateChallengeResponseDto.builder()
                .challengeId(challenge.getId())
                .title(challenge.getTitle())
                .startTime(challenge.getStartTime())
                .endTime(challenge.getEndTime())
                .day(challenge.getDay())
                .location(challenge.getLocation())
                .lat(challenge.getLat())
                .lng(challenge.getLng())
                .radius(challenge.getRadius())
                .warningCount(challenge.getWarningCount())
                .status(challenge.getStatus())
                .build();
    }

    public ChallengeUpdateChallengeResponseDto update(Long challengeId, String loginId, ChallengeUpdateChallengeRequestDto request) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 챌린지가 존재하지 않습니다."));
        if (!challenge.getUserId().getLoginId().equals(loginId)) {
            throw new SecurityException("본인 소유의 챌린지만 수정할 수 있습니다.");
        }

        challenge.setTitle(request.getTitle());
        challenge.setStartTime(request.getStartTime());
        challenge.setEndTime(request.getEndTime());
        challenge.setDay(request.getDay());
        challenge.setLocation(request.getLocation());
        challenge.setLat(request.getLat());
        challenge.setLng(request.getLng());
        challenge.setRadius(request.getRadius());
        challenge.setStatus(Status.PENDING);

        return ChallengeUpdateChallengeResponseDto.builder()
                .challengeId(challenge.getId())
                .title(challenge.getTitle())
                .startTime(challenge.getStartTime())
                .endTime(challenge.getEndTime())
                .day(challenge.getDay())
                .location(challenge.getLocation())
                .lat(challenge.getLat())
                .lng(challenge.getLng())
                .radius(challenge.getRadius())
                .status(challenge.getStatus())
                .build();
    }

    public ChallengeDeleteChallengeResponseDto delete(Long challengeId, String loginId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챌린지입니다."));
        if (!challenge.getUserId().getLoginId().equals(loginId)) {
            throw new SecurityException("본인 소유의 챌린지만 삭제할 수 있습니다.");
        }

        User user = challenge.getUserId();

        if (challenge.getStatus() == Status.PENDING) {
            Mypage mypage = mypageRepository.findByUser(user);
            mypage.setTotalChallenge(mypage.getTotalChallenge() - 1);
            mypageRepository.save(mypage);
        } else if(challenge.getStatus() == Status.SUCCESS) {
            Mypage mypage = mypageRepository.findByUser(user);
            mypage.setTotalChallenge(mypage.getTotalChallenge() - 1);
            mypage.setSuccessChallenge(mypage.getSuccessChallenge() - 1);
            mypageRepository.save(mypage);
        } else if(challenge.getStatus() == Status.STOPED) {
            Mypage mypage = mypageRepository.findByUser(user);
            mypage.setTotalChallenge(mypage.getTotalChallenge() - 1);
            mypage.setStopedChallenge(mypage.getStopedChallenge() - 1);
            mypageRepository.save(mypage);
        } else if(challenge.getStatus() == Status.FAIL) {
            Mypage mypage = mypageRepository.findByUser(user);
            mypage.setTotalChallenge(mypage.getTotalChallenge() - 1);
            mypage.setFailChallenge(mypage.getFailChallenge() - 1);
            mypageRepository.save(mypage);
        }

        challengeRepository.delete(challenge);
        return ChallengeDeleteChallengeResponseDto.builder()
                .title(challenge.getTitle())
                .build();
    }

    public ChallengeGetChallengeInfoResponseDto getInfo(Long challengeId, String loginId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챌린지입니다."));
        if (!challenge.getUserId().getLoginId().equals(loginId)) {
            throw new SecurityException("본인 소유의 챌린지만 조회할 수 있습니다.");
        }

        return ChallengeGetChallengeInfoResponseDto.builder()
                .challengeId(challenge.getId())
                .title(challenge.getTitle())
                .startTime(challenge.getStartTime())
                .endTime(challenge.getEndTime())
                .day(challenge.getDay())
                .location(challenge.getLocation())
                .lat(challenge.getLat())
                .lng(challenge.getLng())
                .radius(challenge.getRadius())
                .status(challenge.getStatus())
                .warningCount(challenge.getWarningCount())
                .createdAt(challenge.getCreatedAt())
                .updatedAt(challenge.getUpdatedAt())
                .completedAt(challenge.getCompletedAt())
                .build();
    }

    public ChallengeStopChallengeResponseDto stopChallenge(Long challengeId, String loginId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 아이디의 챌린지가 존재하지 않습니다."));
        User user  = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        // 소유자 검증 추가
        if (!challenge.getUserId().getLoginId().equals(loginId)) {
            throw new SecurityException("본인 소유의 챌린지만 중단할 수 있습니다.");
        }

        if (challenge.getStatus() != Status.ONGOING) {
            throw new IllegalStateException("진행 중인 챌린지만 중단할 수 있습니다.");
        }
        challenge.setStatus(Status.STOPED);
        challengeRepository.save(challenge);

        Mypage mypage = mypageRepository.findByUser(user);
        mypage.setStopedChallenge(mypage.getStopedChallenge() + 1);
        mypageRepository.save(mypage);

        return ChallengeStopChallengeResponseDto.builder()
                .title(challenge.getTitle())
                .build();
    }

    public List<ChallengeGetNextChallengeInfoResponseDto> getPendingChallenges(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        List<Challenge> pending = challengeRepository
                .findByUserIdAndStatusOrderByStartTimeAsc(user, Status.PENDING);

        return pending.stream()
                .map(ch -> ChallengeGetNextChallengeInfoResponseDto.builder()
                        .id(ch.getId())
                        .title(ch.getTitle())
                        .date(ch.getDay())
                        .startTime(ch.getStartTime())
                        .endTime(ch.getEndTime())
                        .location(ch.getLocation())
                        .build()
                ).toList();
    }

}
