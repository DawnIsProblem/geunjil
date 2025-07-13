package com.geunjil.geunjil.domain.mypage.service;

import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.mypage.dto.request.MypageInfoRequestDto;
import com.geunjil.geunjil.domain.mypage.dto.request.MypageRecent3ChallengeRequestDto;
import com.geunjil.geunjil.domain.mypage.dto.response.MypageInfoResponseDto;
import com.geunjil.geunjil.domain.mypage.dto.response.MypageRecent3ChallengeResponseDto;
import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MypageService {

    private final MyPageRepository mypageRepository;
    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    public MypageInfoResponseDto getMypageInfo(MypageInfoRequestDto request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException(("등록되지 않은 아이디 입니다.")));

        Mypage mypage = mypageRepository.findByUser(user);

        return MypageInfoResponseDto.builder()
                .email(user.getEmail())
                .nickname(user.getName())
                .totalChallenge(mypage.getTotalChallenge())
                .successChallenge(mypage.getSuccessChallenge())
                .stopedChallenge(mypage.getStopedChallenge())
                .failChallenge(mypage.getFailChallenge())
                .achievement(mypage.getAchievement())
                .createdAt(mypage.getCreatedAt())
                .updatedAt(mypage.getUpdatedAt())
                .build();

    }

    public List<MypageRecent3ChallengeResponseDto> getRecentChallenges(MypageRecent3ChallengeRequestDto request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        return challengeRepository.findTop3ByUserIdOrderByCreatedAtDesc(user).stream()
                .map(ch -> MypageRecent3ChallengeResponseDto.builder()
                        .title(ch.getTitle())
                        .day(ch.getDay())
                        .status(ch.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        mypageRepository.delete(mypageRepository.findByUser(user));
        userRepository.delete(user);
    }

}
