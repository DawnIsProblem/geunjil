package com.geunjil.geunjil.domain.mypage.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class MypageRecent3ChallengeRequestDto {

    @Schema(name = "사용자 아이디", example = "1")
    private Long userId;

}
