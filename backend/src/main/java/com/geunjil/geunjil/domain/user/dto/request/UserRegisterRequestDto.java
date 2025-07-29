package com.geunjil.geunjil.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class UserRegisterRequestDto {

    @Schema(description = "로그인 아이디", example = "admin")
    private String loginId;

    @Schema(description = "닉네임", example = "검정검정")
    private String name;

    @Schema(description = "비밀번호", example = "1234")
    private String password;

    @Schema(description = "이메일", example = "geunjil@gmail.com")
    private String email;

}
