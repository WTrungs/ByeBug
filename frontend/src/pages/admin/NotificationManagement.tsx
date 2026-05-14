import React, { useMemo, useState } from 'react';

type NotificationAudience = 'ALL' | 'USER' | 'ADMIN';
type NotificationPriority = 'NORMAL' | 'IMPORTANT' | 'URGENT';

type NotificationFormState = {
    title: string;
    content: string;
    audience: NotificationAudience;
    priority: NotificationPriority;
    targetUsername: string;
    sendNow: boolean;
    scheduledAt: string;
};

const initialForm: NotificationFormState = {
    title: '',
    content: '',
    audience: 'ALL',
    priority: 'NORMAL',
    targetUsername: '',
    sendNow: true,
    scheduledAt: '',
};

const mockNotifications = [
    {
        id: 1,
        title: 'Bảo trì hệ thống chấm bài',
        audience: 'Tất cả',
        priority: 'Quan trọng',
        status: 'Đã gửi',
        createdAt: '2026-05-12 22:00',
    },
    {
        id: 2,
        title: 'Cập nhật bộ test cho bài Two Sum',
        audience: 'Admin',
        priority: 'Thường',
        status: 'Bản nháp',
        createdAt: '2026-05-12 18:30',
    },
    {
        id: 3,
        title: 'Thông báo khóa tài khoản vi phạm',
        audience: 'Người dùng',
        priority: 'Khẩn cấp',
        status: 'Đã lên lịch',
        createdAt: '2026-05-13 09:15',
    },
];

const audienceLabels: Record<NotificationAudience, string> = {
    ALL: 'Tất cả',
    USER: 'Người dùng',
    ADMIN: 'Admin',
};

const priorityLabels: Record<NotificationPriority, string> = {
    NORMAL: 'Thường',
    IMPORTANT: 'Quan trọng',
    URGENT: 'Khẩn cấp',
};

const NotificationManagement: React.FC = () => {
    const [form, setForm] = useState<NotificationFormState>(initialForm);

    const payloadPreview = useMemo(() => ({
        title: form.title.trim(),
        content: form.content.trim(),
        audience: form.audience,
        priority: form.priority,
        targetUsername: form.audience === 'USER' ? form.targetUsername.trim() : null,
        scheduledAt: form.sendNow ? null : form.scheduledAt || null,
        sendNow: form.sendNow,
    }), [form]);

    const updateField = <K extends keyof NotificationFormState>(
        field: K,
        value: NotificationFormState[K],
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Create notification payload', payloadPreview);
    };

    return (
        <div className="nm-wrapper">
            <form className="pm-card nm-composer" onSubmit={handleSubmit}>
                <div className="pm-card-header nm-header">
                    <div>
                        <p className="nm-eyebrow">Trung tâm thông báo</p>
                        <h2 className="pm-table-title">Tạo thông báo</h2>
                    </div>
                    <button type="submit" className="btn-neo-sub nm-submit-btn">
                        Tạo thông báo
                    </button>
                </div>

                <div className="nm-form-grid">
                    <label className="nm-field nm-field-wide">
                        <span>Tiêu đề</span>
                        <input
                            className="neo-input"
                            value={form.title}
                            onChange={(event) => updateField('title', event.target.value)}
                            placeholder="VD: Bảo trì hệ thống chấm bài"
                            required
                        />
                    </label>

                    <label className="nm-field">
                        <span>Người nhận</span>
                        <select
                            className="pm-select"
                            value={form.audience}
                            onChange={(event) => updateField(
                                'audience',
                                event.target.value as NotificationAudience,
                            )}
                        >
                            <option value="ALL">Tất cả</option>
                            <option value="USER">Một người dùng</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </label>

                    <label className="nm-field">
                        <span>Mức độ</span>
                        <div className="nm-priority-options" role="radiogroup" aria-label="Chọn mức độ thông báo">
                            {(Object.keys(priorityLabels) as NotificationPriority[]).map((priority) => (
                                <button
                                    key={priority}
                                    type="button"
                                    className={`nm-priority-option nm-priority-${priority.toLowerCase()} ${
                                        form.priority === priority ? 'is-selected' : ''
                                    }`}
                                    role="radio"
                                    aria-checked={form.priority === priority}
                                    onClick={() => updateField('priority', priority)}
                                >
                                    {priorityLabels[priority]}
                                </button>
                            ))}
                        </div>
                    </label>

                    {form.audience === 'USER' && (
                        <label className="nm-field nm-field-wide">
                            <span>Username người nhận</span>
                            <input
                                className="neo-input"
                                value={form.targetUsername}
                                onChange={(event) => updateField('targetUsername', event.target.value)}
                                placeholder="VD: user_123"
                                required
                            />
                        </label>
                    )}

                    <label className="nm-field nm-field-wide">
                        <span>Nội dung</span>
                        <textarea
                            className="nm-textarea"
                            value={form.content}
                            onChange={(event) => updateField('content', event.target.value)}
                            placeholder="Nhập nội dung thông báo..."
                            required
                        />
                    </label>

                    <div className="nm-schedule-row nm-field-wide">
                        <label className="pc-toggle-row nm-toggle">
                            <input
                                type="checkbox"
                                checked={form.sendNow}
                                onChange={(event) => updateField('sendNow', event.target.checked)}
                            />
                            <span>Gửi ngay</span>
                        </label>

                        <label className="nm-field">
                            <span>Thời gian gửi</span>
                            <input
                                className="neo-input"
                                type="datetime-local"
                                value={form.scheduledAt}
                                disabled={form.sendNow}
                                onChange={(event) => updateField('scheduledAt', event.target.value)}
                            />
                        </label>
                    </div>
                </div>
            </form>

            <div className="nm-bottom-grid">
                <section className="pm-card">
                    <div className="pm-card-header">
                        <h3 className="pm-card-title">Xem trước</h3>
                    </div>
                    <div className={`nm-preview-card nm-preview-${form.priority.toLowerCase()}`}>
                        <div className="nm-preview-meta">
                            <span>{audienceLabels[form.audience]}</span>
                            <span>{priorityLabels[form.priority]}</span>
                        </div>
                        <h3>{form.title || 'Tiêu đề thông báo'}</h3>
                        <p>{form.content || 'Nội dung thông báo sẽ hiển thị tại đây.'}</p>
                    </div>
                </section>

                <section className="pm-card">
                    <div className="pm-table-header">
                        <h3 className="pm-table-title">Thông báo gần đây</h3>
                    </div>

                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th>Tiêu đề</th>
                                <th>Người nhận</th>
                                <th>Mức độ</th>
                                <th>Trạng thái</th>
                                <th>Tạo lúc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockNotifications.map((notification) => (
                                <tr key={notification.id}>
                                    <td className="pm-name-cell">{notification.title}</td>
                                    <td>{notification.audience}</td>
                                    <td>
                                        <span className="nm-table-badge">{notification.priority}</span>
                                    </td>
                                    <td>{notification.status}</td>
                                    <td className="pm-date-cell">{notification.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

export default NotificationManagement;
