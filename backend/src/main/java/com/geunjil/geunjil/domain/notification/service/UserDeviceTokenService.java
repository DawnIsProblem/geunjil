package com.geunjil.geunjil.domain.notification.service;

import com.geunjil.geunjil.domain.notification.dto.request.SaveDeviceTokenRequestDto;
import com.geunjil.geunjil.domain.notification.entity.UserDeviceToken;
import com.geunjil.geunjil.domain.notification.repository.UserDeviceTokenRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class UserDeviceTokenService {

    private final UserDeviceTokenRepository userDeviceTokenRepository;
    private final UserRepository userRepository;

    public void saveDeviceToken(SaveDeviceTokenRequestDto request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        userDeviceTokenRepository.findByDeviceToken(request.getDeviceToken())
                .orElseGet(() -> userDeviceTokenRepository.save(
                        UserDeviceToken.builder()
                                .user(user)
                                .deviceToken(request.getDeviceToken())
                                .build()
                ));
    }

}
