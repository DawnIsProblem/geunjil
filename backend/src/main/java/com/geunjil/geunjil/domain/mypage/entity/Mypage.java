package com.geunjil.geunjil.domain.mypage.entity;

import com.geunjil.geunjil.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "mypage")
public class Mypage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_challenge")
    private int totalChallenge;

    @Column(name = "success_challenge")
    private int successChallenge;

    @Column(name = "stoped_challenge")
    private int stopedChallenge;

    @Column(name = "fail_challenge")
    private int failChallenge;

    @Column(name = "achievement")
    private float achievement;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void OnCreated() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void OnUpdated() {
        this.updatedAt = LocalDateTime.now();
    }

}
