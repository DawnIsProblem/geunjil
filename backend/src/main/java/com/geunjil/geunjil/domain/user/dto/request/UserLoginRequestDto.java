package com.geunjil.geunjil.domain.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserLoginRequestDto {

    @Schema(description = "로그인 아이디", example = "admin")
    private String loginId;

    @Schema(description = "비밀번호", example = "1234")
    private String password;


}
