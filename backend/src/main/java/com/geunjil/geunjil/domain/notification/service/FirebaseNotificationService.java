package com.geunjil.geunjil.domain.notification.service;

import com.geunjil.geunjil.domain.notification.entity.UserDeviceToken;
import com.geunjil.geunjil.domain.notification.repository.UserDeviceTokenRepository;
import com.geunjil.geunjil.domain.user.entity.User;
import com.google.firebase.messaging.*;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseNotificationService {

    private final FirebaseMessaging firebaseMessaging; // ✅ 주입
    private final UserDeviceTokenRepository userDeviceTokenRepository;

    public void sendNotification(String targetToken, String title, String body) {
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        Message message = Message.builder()
                .setToken(targetToken)
                .setNotification(notification)
                // .putData("type","REMIND_10M") // 필요 시 data 추가
                .build();
        try {
            String response = firebaseMessaging.send(message);
            log.info("✅ FCM 메시지 송신 성공: {}", response);
        } catch (FirebaseMessagingException e) {
            log.error("❌ FCM 메시지 실패: {}", e.getErrorCode(), e);
            // UNREGISTERED(토큰 만료) 등인 경우 DB에서 삭제하는 로직을 넣으면 좋음
        } catch (Exception e) {
            log.error("❌ FCM 메시지 예외", e);
        }
    }

    public void sendToUser(User user, String title, String body) {
        List<String> tokens = userDeviceTokenRepository.findByUser(user)
                .stream().map(UserDeviceToken::getDeviceToken).toList();

        if (tokens.isEmpty()) return;

        MulticastMessage message = MulticastMessage.builder()
                .addAllTokens(tokens)
                .setNotification(Notification.builder().setTitle(title).setBody(body).build())
                .build();

        try {
            BatchResponse br = firebaseMessaging.sendEachForMulticast(message);
            log.info("✅ 멀티캐스트: success={} failure={}", br.getSuccessCount(), br.getFailureCount());
            // 실패한 토큰을 가져와 DB에서 정리하는 로직도 고려
        } catch (Exception e) {
            log.error("❌ 멀티캐스트 실패", e);
        }
    }

}
