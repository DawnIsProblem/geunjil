package com.geunjil.geunjil.domain.user.repository;

import com.geunjil.geunjil.domain.user.entity.User;
import com.geunjil.geunjil.domain.user.enums.SocialLoginType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLoginId(String loginId);
    Optional<User> findByEmailAndProvider(String email, SocialLoginType socialLoginType);
    Optional<User> findBySocialId(String socialId);
    Optional<User> deleteByLoginId(String loginId);

}
