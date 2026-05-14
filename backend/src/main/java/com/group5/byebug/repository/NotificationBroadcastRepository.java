package com.group5.byebug.repository;

import com.group5.byebug.entity.NotificationBroadcast;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationBroadcastRepository extends JpaRepository<NotificationBroadcast, Long> {
    Page<NotificationBroadcast> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
