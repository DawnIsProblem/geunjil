package com.geunjil.geunjil.unit;

import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.mypage.repository.MyPageRepository;
import com.geunjil.geunjil.domain.user.dto.request.UserLoginRequestDto;
import com.geunjil.geunjil.domain.user.dto.request.UserRegisterRequestDto;
import com.geunjil.geunjil.domain.user.dto.response.UserLoginResponseDto;
import com.geunjil.geunjil.domain.user.dto.response.UserRegisterResponseDto;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import com.geunjil.geunjil.domain.user.jwt.JwtProvider;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import com.geunjil.geunjil.domain.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MyPageRepository myPageRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("회원가입 성공")
    void register_success() {
        // given
        UserRegisterRequestDto request = new UserRegisterRequestDto("geunjil", "geunjil", "1234", "geunjil@gmail.com");
        when(userRepository.findByLoginId("geunjil")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("1234")).thenReturn("encoded-pw");

        // when
        UserRegisterResponseDto result = userService.register(request);

        // then
        assertThat(result.getLoginId()).isEqualTo("geunjil");
        assertThat(result.getName()).isEqualTo("geunjil");
        assertThat(result.getEmail()).isEqualTo("geunjil@gmail.com");

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("회원가입 실패 - 이미 존재하는 아이디")
    void register_fail_duplicateId() {
        // given
        UserRegisterRequestDto request = new UserRegisterRequestDto("geunjil", "geunjil", "1234", "geunjil@gmail.com");
        when(userRepository.findByLoginId("geunjil")).thenReturn(Optional.of(mock(User.class)));

        // when & then
        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("이미 존재하는 아이디 입니다.");
    }

    @Test
    @DisplayName("로그인 성공")
    void login_success() {
        // given
        UserLoginRequestDto request = new UserLoginRequestDto("geunjil", "1234");
        User mockUser = User.builder()
                .loginId("geunjil")
                .password("encoded-pw")
                .name("geunjil")
                .email("geunjil@gmail.com")
                .provider(SocialLoginType.LOCAL)
                .build();

        when(userRepository.findByLoginId("geunjil")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("1234", "encoded-pw")).thenReturn(true);
        when(jwtProvider.createToken("geunjil", "ROLE_USER")).thenReturn("mock-token");
        when(myPageRepository.findByUser(mockUser)).thenReturn(null);

        // when
        UserLoginResponseDto result = userService.login(request);

        // then
        assertThat(result.getLoginId()).isEqualTo("geunjil");
        assertThat(result.getAccessToken()).isEqualTo("mock-token");

        verify(userRepository).save(mockUser);
        verify(myPageRepository).save(any(Mypage.class));
    }

    @Test
    @DisplayName("로그인 실패 - 아이디 없음")
    void login_fail_not_found() {
        // given
        UserLoginRequestDto request = new UserLoginRequestDto("geunjil2", "1234");
        when(userRepository.findByLoginId("geunjil2")).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("등록되지 않은 아이디 입니다.");
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 불일치")
    void login_fail_wrong_password() {
        // given
        UserLoginRequestDto request = new UserLoginRequestDto("geunjil", "12345");
        User mockUser = User.builder()
                .loginId("geunjil")
                .password("encoded-pw")
                .build();

        when(userRepository.findByLoginId("geunjil")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("12345", "encoded-pw")).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("비밀번호가 일치하지 않습니다.");
    }

}
