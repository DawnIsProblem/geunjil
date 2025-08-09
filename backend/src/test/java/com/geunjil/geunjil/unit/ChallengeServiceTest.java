package com.geunjil.geunjil.unit;

import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeCreateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.dto.request.ChallengeUpdateChallengeRequestDto;
import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.challenge.repository.ChallengeRepository;
import com.geunjil.geunjil.domain.challenge.service.ChallengeService;
import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ChallengeServiceTest {

    private ChallengeRepository challengeRepository;
    private MyPageRepository myPageRepository;
    private UserRepository userRepository;
    private ChallengeService challengeService;

    @BeforeEach
    void setUp() {
        challengeRepository = mock(ChallengeRepository.class);
        myPageRepository = mock(MyPageRepository.class);
        userRepository = mock(UserRepository.class);
        challengeService = new ChallengeService(challengeRepository, myPageRepository, userRepository);
    }

    @Test
    @DisplayName("챌린지 생성 및 마이페이지 반영 테스트")
    void createChallenge_shouldSaveChallengeAndUpdateMypage() {
        String loginId = "test_user";
        User user = User.builder().id(1L).loginId(loginId).build();

        ChallengeCreateChallengeRequestDto request = new ChallengeCreateChallengeRequestDto();
        request.setTitle("아침 러닝");
        request.setStartTime(LocalTime.of(7, 0));
        request.setEndTime(LocalTime.of(8, 0));
        request.setDay(LocalDate.of(2025, 9, 1));
        request.setLocation("한강공원");
        request.setLat(37.5);
        request.setLng(127.0);
        request.setRadius(500);

        Mypage mypage = Mypage.builder()
                .user(user)
                .totalChallenge(3)
                .successChallenge(1)
                .failChallenge(1)
                .stopedChallenge(1)
                .build();

        when(userRepository.findByLoginId(loginId)).thenReturn(Optional.of(user));
        when(myPageRepository.findByUser(user)).thenReturn(mypage);

        challengeService.createChallenge(loginId, request);

        verify(challengeRepository).save(any(Challenge.class));
        verify(myPageRepository).save(mypage);
        assertEquals(4, mypage.getTotalChallenge());
    }

    @Test
    @DisplayName("챌린지 수정 테스트")
    void update_shouldModifyChallengeFields() {
        String loginId = "test_user";
        User user = User.builder().id(1L).loginId(loginId).build();

        Challenge challenge = Challenge.builder()
                .id(100L)
                .userId(user)
                .title("이전 제목")
                .build();

        ChallengeUpdateChallengeRequestDto request = new ChallengeUpdateChallengeRequestDto();
        request.setTitle("수정된 제목");
        request.setStartTime(LocalTime.of(6, 0));
        request.setEndTime(LocalTime.of(7, 0));
        request.setDay(LocalDate.of(2025, 9, 2));
        request.setLocation("올림픽공원");
        request.setLat(37.4);
        request.setLng(127.1);
        request.setRadius(300);

        when(challengeRepository.findById(100L)).thenReturn(Optional.of(challenge));

        challengeService.update(100L, loginId, request);

        assertEquals("수정된 제목", challenge.getTitle());
        assertEquals(Status.PENDING, challenge.getStatus());
    }

    @Test
    @DisplayName("챌린지 삭제 및 마이페이지 반영 테스트")
    void delete_shouldRemoveChallengeAndUpdateMypage() {
        String loginId = "test_user";
        User user = User.builder().id(1L).loginId(loginId).build();

        Challenge challenge = Challenge.builder()
                .id(101L)
                .userId(user)
                .title("삭제할 챌린지")
                .status(Status.SUCCESS)
                .build();

        Mypage mypage = Mypage.builder()
                .user(user)
                .totalChallenge(5)
                .successChallenge(3)
                .failChallenge(1)
                .stopedChallenge(1)
                .build();

        when(challengeRepository.findById(101L)).thenReturn(Optional.of(challenge));
        when(myPageRepository.findByUser(user)).thenReturn(mypage);

        ChallengeService service = new ChallengeService(challengeRepository, myPageRepository, userRepository);
        service.delete(101L, loginId);

        verify(challengeRepository).delete(challenge);
        verify(myPageRepository).save(mypage);
        assertEquals(4, mypage.getTotalChallenge());
        assertEquals(2, mypage.getSuccessChallenge());
    }

    @Test
    @DisplayName("챌린지 조회 테스트")
    void getInfo_shouldReturnChallengeDetails() {
        String loginId = "test_user";
        User user = User.builder().id(1L).loginId(loginId).build();
        Challenge challenge = Challenge.builder()
                .id(200L)
                .userId(user)
                .title("챌린지 조회")
                .status(Status.PENDING)
                .build();

        when(challengeRepository.findById(200L)).thenReturn(Optional.of(challenge));

        var result = challengeService.getInfo(200L, loginId);

        assertEquals("챌린지 조회", result.getTitle());
        assertEquals(Status.PENDING, result.getStatus());
    }

    @Test
    @DisplayName("챌린지 중단 및 마이페이지 반영 테스트")
    void stopChallenge_shouldUpdateStatusAndMypage() {
        String loginId = "test_user";
        User user = User.builder().id(1L).loginId(loginId).build();
        Challenge challenge = Challenge.builder()
                .id(300L)
                .userId(user)
                .title("진행 중 챌린지")
                .status(Status.ONGOING)
                .build();

        Mypage mypage = Mypage.builder()
                .user(user)
                .stopedChallenge(2)
                .build();

        when(challengeRepository.findById(300L)).thenReturn(Optional.of(challenge));
        when(userRepository.findByLoginId(loginId)).thenReturn(Optional.of(user));
        when(myPageRepository.findByUser(user)).thenReturn(mypage);

        challengeService.stopChallenge(300L, loginId);

        assertEquals(Status.STOPED, challenge.getStatus());
        assertEquals(3, mypage.getStopedChallenge());
    }

    @Test
    @DisplayName("대기중인 챌린지 조회 테스트")
    void getPendingChallenges_shouldReturnList() {
        String loginId = "test_user";
        User user = User.builder().id(1L).loginId(loginId).build();
        Challenge ch1 = Challenge.builder().id(1L).userId(user).title("미션1").status(Status.PENDING).build();
        Challenge ch2 = Challenge.builder().id(2L).userId(user).title("미션2").status(Status.PENDING).build();

        when(userRepository.findByLoginId(loginId)).thenReturn(Optional.of(user));
        when(challengeRepository.findByUserIdAndStatusOrderByStartTimeAsc(user, Status.PENDING))
                .thenReturn(List.of(ch1, ch2));

        var list = challengeService.getPendingChallenges(loginId);

        assertEquals(2, list.size());
        assertEquals("미션1", list.get(0).getTitle());
    }
}