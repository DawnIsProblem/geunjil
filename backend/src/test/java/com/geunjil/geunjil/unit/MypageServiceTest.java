package com.geunjil.geunjil.unit;

import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.mypage.dto.response.MypageInfoResponseDto;
import com.geunjil.geunjil.domain.mypage.dto.response.MypageRecent3ChallengeResponseDto;
import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.mypage.service.MypageService;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
public class MypageServiceTest {

    @InjectMocks
    private MypageService mypageService;

    @Mock
    private MyPageRepository myPageRepository;

    @Mock
    private ChallengeRepository challengeRepository;

    @Mock
    private UserRepository userRepository;

    private User mockUser;
    private Mypage mockMypage;

    @BeforeEach
    void setup() {
        mockUser = User.builder()
                .loginId("geunjil")
                .name("검정")
                .email("geunjil@gmail.com")
                .build();

        mockMypage = Mypage.builder()
                .user(mockUser)
                .totalChallenge(10)
                .successChallenge(5)
                .stopedChallenge(2)
                .failChallenge(3)
                .achievement(87.5f)
                .createdAt(LocalDateTime.now().minusDays(5))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("마이페이지 정보 조회")
    void getMypageInfoByLoginId_success() {
        // given
        when(userRepository.findByLoginId("geunjil")).thenReturn(Optional.of(mockUser));
        when(myPageRepository.findByUser(mockUser)).thenReturn(mockMypage);

        // when
        MypageInfoResponseDto result = mypageService.getMypageInfoByLoginId("geunjil");

        // then
        assertThat(result.getNickname()).isEqualTo("검정");
        assertThat(result.getEmail()).isEqualTo("geunjil@gmail.com");
        assertThat(result.getTotalChallenge()).isEqualTo(10);
        assertThat(result.getSuccessChallenge()).isEqualTo(5);
        assertThat(result.getAchievement()).isEqualTo(87.5f);
    }

    @Test
    @DisplayName("최근 3개의 챌린지 조회")
    void getRecentChallengesByLoginId_success() {
        // given
        Challenge ch1 = Challenge.builder().title("헬스 30일").day(LocalDate.now()).status(Status.ONGOING).build();
        Challenge ch2 = Challenge.builder().title("런닝 챌린지").day(LocalDate.now().minusDays(1)).status(Status.SUCCESS).build();
        Challenge ch3 = Challenge.builder().title("명상 챌린지").day(LocalDate.now().minusDays(2)).status(Status.FAIL).build();

        when(userRepository.findByLoginId("geunjil")).thenReturn(Optional.of(mockUser));
        when(challengeRepository.findTop3ByUserIdOrderByCreatedAtDesc(mockUser)).thenReturn(List.of(ch1, ch2, ch3));

        // when
        List<MypageRecent3ChallengeResponseDto> result = mypageService.getRecentChallengesByLoginId("geunjil");

        // then
        assertThat(result).hasSize(3);
        assertThat(result.get(0).getTitle()).isEqualTo("헬스 30일");
    }

    @Test
    @DisplayName("회원 탈퇴")
    void deleteUserByLoginId_success() {
        // given
        when(userRepository.findByLoginId("geunjil")).thenReturn(Optional.of(mockUser));
        when(myPageRepository.findByUser(mockUser)).thenReturn(mockMypage);

        // when
        mypageService.deleteUserByLoginId("geunjil");

        // then
        verify(myPageRepository).delete(mockMypage);
        verify(userRepository).delete(mockUser);
    }

    @Test
    @DisplayName("조회 실패 - 존재하지 않는 사용자")
    void getMypageInfoByLoginId_fail_userNotFound() {
        // given
        when(userRepository.findByLoginId("geunjil2")).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> mypageService.getMypageInfoByLoginId("geunjil2"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("등록되지 않은 아이디 입니다.");
    }

}
