package com.geunjil.geunjil.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoUserInfoResponseDto {

    private String id;
    private String nickname;
    private String email;

}
