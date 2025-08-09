package com.geunjil.geunjil.domain.notification.controller;

import com.geunjil.geunjil.common.model.CommonResponse;
import com.geunjil.geunjil.domain.notification.dto.request.SaveDeviceTokenRequestDto;
import com.geunjil.geunjil.domain.notification.repository.UserDeviceTokenRepository;
import com.geunjil.geunjil.domain.notification.service.FirebaseNotificationService;
import com.geunjil.geunjil.domain.notification.service.UserDeviceTokenService;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/device-token")
@RequiredArgsConstructor
@Tag(name = "Device Token Register API", description = "사용 기기 토큰 관련 API")
public class UserDeviceTokenController {

    private final UserDeviceTokenService userDeviceTokenService;
    private final UserRepository userRepository;
    private final FirebaseNotificationService fcm;
    private final UserDeviceTokenRepository tokenRepo;

    @PostMapping
    @Operation(
            summary = "사용자 FCM 디바이스 토큰 등록 API",
            description = "사용자의 FCM 디바이스 토큰을 등록하거나 중복 체크 후 저장합니다."
    )
    public ResponseEntity<CommonResponse<String>> saveDeviceToken(
            @RequestBody SaveDeviceTokenRequestDto request
    ) {
        userDeviceTokenService.saveDeviceToken(request);
        return ResponseEntity.ok(CommonResponse.success("디바이스 토큰 등록 성공!", null));
    }

    @PostMapping("/test")
    public ResponseEntity<String> sendTest(@RequestParam Long userId,
                                           @RequestParam String title,
                                           @RequestParam String body) {
        User user = userRepository.findById(userId).orElseThrow();
        tokenRepo.findByUser(user).forEach(t ->
                fcm.sendNotification(t.getDeviceToken(), title, body)
        );
        return ResponseEntity.ok("ok");
    }

}
