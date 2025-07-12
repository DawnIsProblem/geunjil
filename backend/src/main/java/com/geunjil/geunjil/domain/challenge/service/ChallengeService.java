package com.geunjil.geunjil.domain.challenge.service;

import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeCreateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeStopChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUpdateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.response.*;
import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    public ChallengeCreateChallengeResponseDto createChallenge(Long userId, ChallengeCreateChallengeRequestDto request) {
        User user = userRepository.findById(userId)
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

    public ChallengeUpdateChallengeResponseDto update(Long challengeId, ChallengeUpdateChallengeRequestDto request) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 챌린지가 존재하지 않습니다."));

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

    public ChallengeDeleteChallengeResponseDto delete(Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챌린지입니다."));

        if (challenge.getStatus() != Status.PENDING) {
            throw new IllegalArgumentException("챌린지의 상태가 [대기중]이 아니면 삭제할 수 없습니다.");
        }

        challengeRepository.delete(challenge);
        return ChallengeDeleteChallengeResponseDto.builder()
                .title(challenge.getTitle())
                .build();
    }

    public ChallengeGetChallengeInfoResponseDto getInfo(Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 챌린지입니다."));
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
                .warningCount(challenge.getWarningCount())
                .createdAt(challenge.getCreatedAt())
                .updatedAt(challenge.getUpdatedAt())
                .completedAt(challenge.getCompletedAt())
                .build();
    }

    public ChallengeStopChallengeResponseDto stopChallenge(ChallengeStopChallengeRequestDto request) {
        Challenge challenge = challengeRepository.findById(request.getChallengeId())
                .orElseThrow(() -> new IllegalArgumentException("해당 아이디의 챌린지가 존재하지 않습니다."));
        if (challenge.getStatus() != Status.ONGOING) {
            throw new IllegalStateException("진행 중인 챌린지만 중단할 수 있습니다.");
        }
        challenge.setStatus(Status.STOPED);
        challengeRepository.save(challenge);

        return ChallengeStopChallengeResponseDto.builder()
                .title(challenge.getTitle())
                .build();
    }

}
