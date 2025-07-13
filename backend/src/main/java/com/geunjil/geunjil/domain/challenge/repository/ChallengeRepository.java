package com.geunjil.geunjil.domain.challenge.repository;

import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    List<Challenge> findByStatus(Status status) ;
    List<Challenge> findByStatusIn(List<Status> statuses);
    List<Challenge> findTop3ByUserIdOrderByCreatedAtDesc(User user);

}