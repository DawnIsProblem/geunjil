package com.geunjil.geunjil.domain.user.dto.request;

import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class UserSocialLoginRequestDto {

    @Schema(description = "이메일", example = "geunjil@gamil.com")
    private String email;

    @Schema(description = "소셜로그인 플랫폼", example = "GOOGLE")
    private SocialLoginType socialLoginType;
}
