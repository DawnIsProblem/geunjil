package com.geunjil.geunjil.domain.mypage.service;

import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
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

    /*
    * 프론트에서 토큰을 보내면 백엔드에서 복호화 후 api를 이용하게 만드는 방법
    * 보안과 신뢰성을 높일 수 있는 방식
    * */
    public MypageInfoResponseDto getMypageInfoByLoginId(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 아이디 입니다."));

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

    public List<MypageRecent3ChallengeResponseDto> getRecentChallengesByLoginId(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 아이디 입니다."));

        return challengeRepository.findTop3ByUserIdOrderByCreatedAtDesc(user).stream()
                .map(ch -> MypageRecent3ChallengeResponseDto.builder()
                        .title(ch.getTitle())
                        .day(ch.getDay())
                        .status(ch.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    public void deleteUserByLoginId(String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 아이디 입니다."));
        mypageRepository.delete(mypageRepository.findByUser(user));
        userRepository.delete(user);
    }

}
