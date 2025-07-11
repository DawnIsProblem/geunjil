package com.geunjil.geunjil.domain.user.service;

import com.geunjil.geunjil.domain.user.dto.request.UserLoginRequestDto;
import com.geunjil.geunjil.domain.user.dto.request.UserRegisterRequestDto;
import com.geunjil.geunjil.domain.user.dto.response.UserLoginResponseDto;
import com.geunjil.geunjil.domain.user.dto.response.UserRegisterResponseDto;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserRegisterResponseDto register(UserRegisterRequestDto request) {
        if(userRepository.findByLoginId(request.getLoginId()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디 입니다.");
        }

        User user = User.builder()
                .loginId(request.getLoginId()) // 소셜 로그인의 아이디 필드는 소셜 로그인의 이메일로 대체
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .provider(SocialLoginType.LOCAL)
                .build();
        userRepository.save(user);

        return UserRegisterResponseDto.builder()
                .loginId(request.getLoginId())
                .password("비밀번호는 BCrypt로 암호화 되었습니다.")
                .email(request.getEmail())
                .build();
    }

    public UserLoginResponseDto login(UserLoginRequestDto request) {
        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException(("등록되지 않은 아이디 입니다.")));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return UserLoginResponseDto.builder()
                .loginId(user.getLoginId())
                .provider(user.getProvider())
                .build();
    }

}
