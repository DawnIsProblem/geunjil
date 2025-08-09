package com.geunjil.geunjil.unit;

import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetCurrentChallengeResponseDto;
import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetNextChallengeInfoResponseDto;
import com.geunjil.geunjil.domain.challenge.dto.response.ChallengeGetResultResponseDto;
import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.mainpage.dto.response.MainPageInfoResponseDto;
import com.geunjil.geunjil.domain.mainpage.service.MainPageService;
import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MainPageServiceTest {

    private UserRepository userRepository;
    private ChallengeRepository challengeRepository;
    private MyPageRepository myPageRepository;
    private MainPageService mainPageService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        challengeRepository = mock(ChallengeRepository.class);
        myPageRepository = mock(MyPageRepository.class);
        mainPageService = new MainPageService(challengeRepository, userRepository, myPageRepository);
    }

    @Test
    @DisplayName("메인페이지 정보 호출 테스트")
    void All_Data_Normal_Return() {
        // given
        String loginId = "user123";
        User user = User.builder().id(1L).loginId(loginId).build();
        Challenge ongoing = Challenge.builder()
                .id(10L)
                .userId(user)
                .title("진행중 챌린지")
                .startTime(LocalTime.now().minusMinutes(30))
                .endTime(LocalTime.now().plusMinutes(30))
                .location("서울숲")
                .status(Status.ONGOING)
                .build();
        Challenge next = Challenge.builder()
                .id(11L)
                .userId(user)
                .title("다음 챌린지")
                .day(LocalDate.of(2025, 8, 8))
                .startTime(LocalTime.of(7, 0))
                .endTime(LocalTime.of(8, 0))
                .location("한강")
                .status(Status.PENDING)
                .build();
        Mypage mypage = Mypage.builder()
                .user(user)
                .successChallenge(3)
                .stopedChallenge(1)
                .failChallenge(2)
                .build();

        when(userRepository.findByLoginId(loginId)).thenReturn(Optional.of(user));
        when(challengeRepository.findTopByUserIdAndStatusOrderByStartTimeDesc(user, Status.ONGOING))
                .thenReturn(Optional.of(ongoing));
        when(challengeRepository.findTopByUserIdAndStatusOrderByStartTimeAsc(user, Status.PENDING))
                .thenReturn(Optional.of(next));
        when(myPageRepository.findByUser(user)).thenReturn(mypage);

        // when
        MainPageInfoResponseDto result = mainPageService.getMainPageInfo(loginId);

        // then
        ChallengeGetCurrentChallengeResponseDto current = result.getCurrentChallenge();
        ChallengeGetNextChallengeInfoResponseDto upcoming = result.getNextChallenge();
        ChallengeGetResultResponseDto stats = result.getResult();

        assertNotNull(current);
        assertEquals("진행중 챌린지", current.getTitle());
        assertTrue(current.getProgressPercent() > 0 && current.getProgressPercent() < 100);

        assertNotNull(upcoming);
        assertEquals("다음 챌린지", upcoming.getTitle());

        assertEquals(3, stats.getSuccess());
        assertEquals(1, stats.getStoped());
        assertEquals(2, stats.getFail());
    }

    @Test
    @DisplayName("진행 챌린지 없음 테스트")
    void No_Progress_Challenge() {
        String loginId = "user123";
        User user = User.builder().id(1L).loginId(loginId).build();
        when(userRepository.findByLoginId(loginId)).thenReturn(Optional.of(user));
        when(challengeRepository.findTopByUserIdAndStatusOrderByStartTimeDesc(user, Status.ONGOING))
                .thenReturn(Optional.empty());
        when(challengeRepository.findTopByUserIdAndStatusOrderByStartTimeAsc(user, Status.PENDING))
                .thenReturn(Optional.empty());
        when(myPageRepository.findByUser(user)).thenReturn(null);

        MainPageInfoResponseDto result = mainPageService.getMainPageInfo(loginId);

        assertNull(result.getCurrentChallenge());
        assertNull(result.getNextChallenge());
        assertEquals(0, result.getResult().getSuccess());
    }

    @Test
    @DisplayName("사용자 없을 시 반응 테스트")
    void User_Without_Exception_Occurrence() {
        String loginId = "nonexistent";
        when(userRepository.findByLoginId(loginId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            mainPageService.getMainPageInfo(loginId);
        });
    }
}
