package com.geunjil.geunjil.domain.user.dto.response;

import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserLoginResponseDto {

    private String loginId;
    private SocialLoginType provider;
    private String name;
    private String email;
    private String accessToken; // LOCAL은 JWT임

}
