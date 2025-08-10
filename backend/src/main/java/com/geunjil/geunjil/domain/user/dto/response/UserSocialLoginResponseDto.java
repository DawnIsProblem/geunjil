package com.geunjil.geunjil.domain.user.dto.response;

import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserSocialLoginResponseDto {

    private String name;
    private String accessToken;
    private SocialLoginType provider;
    private String email;

    public UserSocialLoginResponseDto(String name, String accessToken, SocialLoginType provider, String email) {
        this.name = name;
        this.accessToken = accessToken;
        this.provider = provider;
        this.email = email;
    }

}
