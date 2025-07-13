package com.geunjil.geunjil.domain.mypage.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MypageInfoResponseDto {

    private String email;
    private String nickname;
    private int totalChallenge;
    private int successChallenge;
    private int stopedChallenge;
    private int failChallenge;
    private float achievement;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
