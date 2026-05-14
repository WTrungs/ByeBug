package com.group5.byebug.repository;

import com.group5.byebug.entity.AdminNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminNotificationRepository extends JpaRepository<AdminNotification, Long> {
    Page<AdminNotification> findByAdminAdminIdOrderByCreatedAtDesc(Long adminId, Pageable pageable);
    long countByAdminAdminIdAndIsReadFalse(Long adminId);
    Optional<AdminNotification> findByAdminNotificationIdAndAdminAdminId(Long adminNotificationId, Long adminId);
}
