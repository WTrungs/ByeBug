import React, { useEffect, useMemo, useRef, useState } from 'react';
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
};

const initialForm: NotificationFormState = {
    title: '',
    content: '',
    audience: 'ALL',
    priority: 'NORMAL',
};

const audienceOptions: Array<{ value: NotificationAudience; label: string }> = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'USER', label: 'Người dùng' },
    { value: 'ADMIN', label: 'Admin' },
];

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

const getErrorMessage = (error: unknown) => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } | string } }).response;
        if (typeof response?.data === 'string') {
            return response.data;
        }
        return response?.data?.message;
    }
    return undefined;
};

const NotificationManagement: React.FC = () => {
    const [form, setForm] = useState<NotificationFormState>(initialForm);
    const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
    const [selectedBroadcast, setSelectedBroadcast] = useState<BroadcastItem | null>(null);
    const [isAudienceOpen, setIsAudienceOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const audienceRef = useRef<HTMLDivElement | null>(null);

    const fetchBroadcasts = async () => {
        setLoading(true);
        try {
            const data = await getAdminBroadcasts({ size: 20 });
            setBroadcasts(data.content);
        } catch (err) {
            setError(getErrorMessage(err) || 'Không tải được danh sách thông báo');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!audienceRef.current?.contains(event.target as Node)) {
                setIsAudienceOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const payloadPreview = useMemo(() => ({
        title: form.title.trim(),
        content: form.content.trim(),
        audienceType: form.audience,
        priority: form.priority,
    }), [form]);

    const updateField = <K extends keyof NotificationFormState>(
        field: K,
        value: NotificationFormState[K],
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        try {
            const payload: CreateBroadcastPayload = {
                title: payloadPreview.title,
                content: payloadPreview.content,
                audienceType: payloadPreview.audienceType,
                priority: payloadPreview.priority,
            };
            await createBroadcast(payload);
            setForm(initialForm);
            setSuccess('Đã gửi thông báo thành công');
            await fetchBroadcasts();
        } catch (err: unknown) {
            setError(getErrorMessage(err) || 'Gửi thông báo thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (iso?: string | null) => {
        if (!iso) return 'Chưa có';
        try {
            return new Date(iso).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
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
                        {submitting ? 'Đang gửi...' : 'Gửi thông báo'}
                    </button>
                </div>

                {error && <p className="nm-message nm-message-error">{error}</p>}
                {success && <p className="nm-message nm-message-success">{success}</p>}

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

                    <div className="nm-field" ref={audienceRef}>
                        <span>Người nhận</span>
                        <div className={`nm-audience-select ${isAudienceOpen ? 'is-open' : ''}`}>
                            <button
                                type="button"
                                className="nm-audience-trigger"
                                aria-haspopup="listbox"
                                aria-expanded={isAudienceOpen}
                                onClick={() => setIsAudienceOpen((isOpen) => !isOpen)}
                            >
                                <span>{audienceLabels[form.audience]}</span>
                                <span className="nm-audience-chevron" aria-hidden="true" />
                            </button>

                            {isAudienceOpen && (
                                <div className="nm-audience-menu" role="listbox" aria-label="Chọn người nhận">
                                    {audienceOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="option"
                                            aria-selected={form.audience === option.value}
                                            className={`nm-audience-option ${
                                                form.audience === option.value ? 'is-selected' : ''
                                            }`}
                                            onClick={() => {
                                                updateField('audience', option.value);
                                                setIsAudienceOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

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
                                    <td colSpan={4} className="nm-table-empty">
                                        Đang tải...
                                    </td>
                                </tr>
                            )}
                            {!loading && broadcasts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="nm-table-empty">
                                        Chưa có thông báo nào.
                                    </td>
                                </tr>
                            )}
                            {broadcasts.map((broadcast) => (
                                <tr
                                    key={broadcast.broadcastId}
                                    className="nm-clickable-row"
                                    onClick={() => setSelectedBroadcast(broadcast)}
                                >
                                    <td className="pm-name-cell">{broadcast.title}</td>
                                    <td>{audienceLabels[broadcast.audienceType] ?? broadcast.audienceType}</td>
                                    <td>
                                        <span className={`nm-table-badge nm-table-badge-${broadcast.priority.toLowerCase()}`}>
                                            {priorityLabels[broadcast.priority] ?? broadcast.priority}
                                        </span>
                                    </td>
                                    <td className="pm-date-cell">{formatDate(broadcast.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {selectedBroadcast && (
                <div className="nm-modal-backdrop" role="presentation" onClick={() => setSelectedBroadcast(null)}>
                    <section className="nm-modal" role="dialog" aria-modal="true" aria-labelledby="admin-notification-title" onClick={(event) => event.stopPropagation()}>
                        <div className="nm-modal-header">
                            <div>
                                <p className="nm-eyebrow">Chi tiết thông báo</p>
                                <h3 id="admin-notification-title">{selectedBroadcast.title}</h3>
                            </div>
                            <button type="button" className="nm-modal-close" onClick={() => setSelectedBroadcast(null)} aria-label="Đóng">
                                ×
                            </button>
                        </div>
                        <div className="nm-modal-meta">
                            <span>{audienceLabels[selectedBroadcast.audienceType] ?? selectedBroadcast.audienceType}</span>
                            <span>{priorityLabels[selectedBroadcast.priority] ?? selectedBroadcast.priority}</span>
                            <span>Người gửi: {selectedBroadcast.createdByAdminUsername || 'Admin'}</span>
                            <span>{formatDate(selectedBroadcast.createdAt)}</span>
                        </div>
                        <p className="nm-modal-content">{selectedBroadcast.content}</p>
                    </section>
                </div>
            )}
        </div>
    );
};

export default NotificationManagement;
