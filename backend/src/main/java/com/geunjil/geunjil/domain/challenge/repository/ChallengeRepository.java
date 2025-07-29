package com.geunjil.geunjil.domain.challenge.repository;

import com.geunjil.geunjil.domain.challenge.entity.Challenge;
import com.geunjil.geunjil.domain.challenge.enums.Status;
import com.geunjil.geunjil.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    List<Challenge> findByStatus(Status status) ;
    List<Challenge> findByStatusIn(List<Status> statuses);
    List<Challenge> findTop3ByUserIdOrderByCreatedAtDesc(User userId);
    Optional<Challenge> findTopByUserIdAndStatusOrderByStartTimeDesc(User userId, Status status);
    Optional<Challenge> findTopByUserIdAndStatusOrderByStartTimeAsc(User userId, Status status);

}