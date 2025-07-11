package com.geunjil.geunjil.domain.user.controller;

import com.geunjil.geunjil.common.model.CommonResponse;
import com.geunjil.geunjil.domain.user.dto.request.UserLoginRequestDto;
import com.geunjil.geunjil.domain.user.dto.request.UserRegisterRequestDto;
import com.geunjil.geunjil.domain.user.dto.response.UserLoginResponseDto;
import com.geunjil.geunjil.domain.user.dto.response.UserRegisterResponseDto;
import com.geunjil.geunjil.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "User API", description = "사용자 인증 및 계정 관리 API")
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    @Operation(summary = "자체 회원가입 API", description = "로그인 아이디, 비밀번호, 이메일을 받아 서비스 자체 계정을 생성합니다.")
    public ResponseEntity<CommonResponse<UserRegisterResponseDto>> signup(
            @RequestBody UserRegisterRequestDto request
    ) {
        UserRegisterResponseDto response = userService.register(request);
        return ResponseEntity.ok(CommonResponse.success("자체 회원가입 성공!", response));
    }

    @PostMapping("/login")
    @Operation(summary = "자체 로그인 API", description = "로그인 아이디, 비밀번호를 입력하고 자체 로그인을 시도합니다.")
    public ResponseEntity<CommonResponse<UserLoginResponseDto>> login (
            @RequestBody UserLoginRequestDto request
    ) {
        UserLoginResponseDto response = userService.login(request);
        return ResponseEntity.ok(CommonResponse.success("로그인 성공!", response));
    }

}
