package com.geunjil.geunjil.domain.notification.repository;

import com.geunjil.geunjil.domain.notification.entity.UserDeviceToken;
import com.geunjil.geunjil.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDeviceTokenRepository extends JpaRepository<UserDeviceToken, Long> {

    List<UserDeviceToken> findByUser(User user);
    Optional<UserDeviceToken> findByDeviceToken(String deviceToken);

}
