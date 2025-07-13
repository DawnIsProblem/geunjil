package com.geunjil.geunjil.domain.mypage.repository;

import com.geunjil.geunjil.domain.mypage.entity.Mypage;
import com.geunjil.geunjil.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyPageRepository extends JpaRepository<Mypage, Long> {

    Mypage findByUser(User user);

}
