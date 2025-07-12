package com.geunjil.geunjil.domain.notification.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class SaveDeviceTokenRequestDto {

    @Schema(description = "사용자 ID", example = "1")
    private Long userId;

    @Schema(description = "FCM Device Token", example = "your_fcm_device_token_here")
    private String deviceToken;

}
