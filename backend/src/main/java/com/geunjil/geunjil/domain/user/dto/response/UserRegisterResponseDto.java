package com.geunjil.geunjil.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserRegisterResponseDto {

    private String loginId;
    private String name;
    private String password;
    private String email;

}
