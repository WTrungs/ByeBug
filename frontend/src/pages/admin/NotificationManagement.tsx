import React, { useEffect, useMemo, useState } from 'react';
import {
    createBroadcast,
    getAdminBroadcasts,
    type BroadcastItem,
    type CreateBroadcastPayload,
} from '../../api/adminApi';

type NotificationAudience = 'ALL' | 'USER' | 'ADMIN';
type NotificationPriority = 'NORMAL' | 'IMPORTANT' | 'URGENT';

type NotificationFormState = {
    title: string;
    content: string;
    audience: NotificationAudience;
    priority: NotificationPriority;
    sendNow: boolean;
    scheduledAt: string;
};

const initialForm: NotificationFormState = {
    title: '',
    content: '',
    audience: 'ALL',
    priority: 'NORMAL',
    sendNow: true,
    scheduledAt: '',
};

const audienceLabels: Record<string, string> = {
    ALL: 'Tất cả',
    USER: 'Người dùng',
    ADMIN: 'Admin',
};

const priorityLabels: Record<string, string> = {
    NORMAL: 'Thường',
    IMPORTANT: 'Quan trọng',
    URGENT: 'Khẩn cấp',
};

const NotificationManagement: React.FC = () => {
    const [form, setForm] = useState<NotificationFormState>(initialForm);
    const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBroadcasts = async () => {
        setLoading(true);
        try {
            const data = await getAdminBroadcasts({ size: 20 });
            setBroadcasts(data.content);
        } catch {
            // silently ignore list fetch errors
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const payloadPreview = useMemo(() => ({
        title: form.title.trim(),
        content: form.content.trim(),
        audienceType: form.audience,
        priority: form.priority,
        scheduledAt: form.sendNow ? null : form.scheduledAt || null,
    }), [form]);

    const updateField = <K extends keyof NotificationFormState>(
        field: K,
        value: NotificationFormState[K],
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const payload: CreateBroadcastPayload = {
                title: payloadPreview.title,
                content: payloadPreview.content,
                audienceType: payloadPreview.audienceType as NotificationAudience,
                priority: payloadPreview.priority as NotificationPriority,
                scheduledAt: payloadPreview.scheduledAt,
            };
            await createBroadcast(payload);
            setForm(initialForm);
            await fetchBroadcasts();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Gửi thông báo thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleString('vi-VN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit',
            });
        } catch {
            return iso;
        }
    };

    return (
        <div className="nm-wrapper">
            <form className="pm-card nm-composer" onSubmit={handleSubmit}>
                <div className="pm-card-header nm-header">
                    <div>
                        <p className="nm-eyebrow">Trung tâm thông báo</p>
                        <h2 className="pm-table-title">Tạo thông báo</h2>
                    </div>
                    <button type="submit" className="btn-neo-sub nm-submit-btn" disabled={submitting}>
                        {submitting ? 'Đang gửi...' : 'Tạo thông báo'}
                    </button>
                </div>

                {error && <p style={{ color: 'var(--color-danger)', padding: '0 1rem' }}>{error}</p>}

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
                            <option value="USER">Người dùng</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </label>

                    <label className="nm-field">
                        <span>Mức độ</span>
                        <div className="nm-priority-options" role="radiogroup" aria-label="Chọn mức độ thông báo">
                            {(['NORMAL', 'IMPORTANT', 'URGENT'] as NotificationPriority[]).map((priority) => (
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
                                <th>Tạo lúc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>
                                        Đang tải...
                                    </td>
                                </tr>
                            )}
                            {!loading && broadcasts.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '1rem', opacity: 0.5 }}>
                                        Chưa có thông báo nào.
                                    </td>
                                </tr>
                            )}
                            {broadcasts.map((b) => (
                                <tr key={b.broadcastId}>
                                    <td className="pm-name-cell">{b.title}</td>
                                    <td>{audienceLabels[b.audienceType] ?? b.audienceType}</td>
                                    <td>
                                        <span className="nm-table-badge">
                                            {priorityLabels[b.priority] ?? b.priority}
                                        </span>
                                    </td>
                                    <td className="pm-date-cell">{formatDate(b.createdAt)}</td>
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
