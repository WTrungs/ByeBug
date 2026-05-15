import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    createAdminProblem,
    getAdminProblemDetail,
    updateAdminProblem,
    uploadProblemTests,
    type AdminProblemPayload,
} from '../../api/adminApi';

type ProblemFormState = {
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    timeLimitMs: string;
    memoryLimitKb: string;
    tags: string;
    description: string;
    constraints: string;
    sampleInput: string;
    sampleOutput: string;
    sampleExplanation: string;
    isPublic: boolean;
};

type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

const initialForm: ProblemFormState = {
    title: '',
    difficulty: 'EASY',
    timeLimitMs: '1000',
    memoryLimitKb: '262144',
    tags: '',
    description: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    sampleExplanation: '',
    isPublic: false,
};

const difficultyOptions: Array<{
    value: ProblemFormState['difficulty'];
    label: string;
    hint: string;
}> = [
    { value: 'EASY', label: 'Dễ', hint: 'Cơ bản' },
    { value: 'MEDIUM', label: 'Vừa', hint: 'Tư duy' },
    { value: 'HARD', label: 'Khó', hint: 'Nâng cao' },
];

const ProblemCreate: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<ProblemFormState>(initialForm);
    const [testsFile, setTestsFile] = useState<File | null>(null);
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [uploadMessage, setUploadMessage] = useState('Chưa chọn file');
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const payloadPreview = useMemo<AdminProblemPayload>(() => ({
        title: form.title.trim(),
        difficulty: form.difficulty,
        timeLimitMs: Number(form.timeLimitMs) || 0,
        memoryLimitKb: Number(form.memoryLimitKb) || 0,
        tags: form.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        description: form.description.trim(),
        constraints: form.constraints.trim(),
        examples: [
            {
                input: form.sampleInput,
                output: form.sampleOutput,
                explanation: form.sampleExplanation,
                displayOrder: 1,
            },
        ],
        isPublic: form.isPublic,
    }), [form]);

    const isBusy = isSaving || uploadState === 'uploading';

    const updateField = <K extends keyof ProblemFormState>(
        field: K,
        value: ProblemFormState[K],
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleTestsFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) {
            setTestsFile(null);
            setUploadState('idle');
            setUploadMessage('Chưa chọn file');
            return;
        }

        if (file.name !== 'tests.zip') {
            setTestsFile(null);
            setUploadState('error');
            setUploadMessage('File phải có tên tests.zip');
            event.target.value = '';
            return;
        }

        setTestsFile(file);
        setUploadState('selected');
        setUploadMessage(`Đã chọn ${file.name}`);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        setUploadState(testsFile ? 'uploading' : uploadState);
        setUploadMessage(testsFile ? 'Đang upload tests.zip...' : uploadMessage);

        try {
            const savedProblem = id
                ? await updateAdminProblem(Number(id), payloadPreview)
                : await createAdminProblem(payloadPreview);

            if (testsFile) {
                await uploadProblemTests(savedProblem.problemId, testsFile);
                setUploadState('success');
                setUploadMessage('Đã upload tests.zip thành công');
            }

            alert(id ? 'Sửa xong rồi nha sếp!' : 'Tạo mới thành công!');
            navigate('/admin/problems');
        } catch (error) {
            setUploadState(testsFile ? 'error' : uploadState);
            setUploadMessage('Lưu hoặc upload thất bại, sếp kiểm tra lại thử!');
            alert('Lưu thất bại, sếp kiểm tra lại thử!');
        } finally {
            setIsSaving(false);
        }
    };

     useEffect(() => {
    const fetchDetail = async () => {
        // Nếu không có ID thì thôi, sếp đang tạo mới mà
        if (!id) return; 

        try {
            console.log("Đang lụm dữ liệu cho bài tập ID:", id);
            const data = await getAdminProblemDetail(Number(id));
            const tagNames = Array.isArray(data.tags)
                ? data.tags
                    .map((tag) => typeof tag === 'string' ? tag : tag.tagName)
                    .filter(Boolean)
                    .join(', ')
                : '';
            
            // 2. Lụm xong rồi thì gắn (set) vào Form thôi
            setForm({
                title: data.title || '',
                difficulty: data.difficulty || 'EASY',
                timeLimitMs: String(data.timeLimitMs || '1000'),
                memoryLimitKb: String(data.memoryLimitKb || '262144'),

                tags: tagNames,
                description: data.description || '',
                constraints: data.constraints || '',
                
                sampleInput: data.examples?.[0]?.input || '',
                sampleOutput: data.examples?.[0]?.output || '',
                sampleExplanation: data.examples?.[0]?.explanation || '',
                isPublic: data.isPublic || false,
            });
        } catch (error) {
            console.error("Lỗi lụm dữ liệu:", error);
            alert("Không tìm thấy bài tập này sếp ơi!");
            navigate('/admin/problems'); 
        }
    };

    fetchDetail();
}, [id, navigate]);

    return (
        <form className="pc-wrapper" onSubmit={handleSubmit}>
            <div className="pm-card pc-hero">
                <div>
                    <p className="pc-eyebrow">Ngân hàng đề bài</p>
                    <h2 className="pm-table-title">{id? "Chỉnh sửa đề bài": "Tạo mới đề bài"}</h2>
                    <p className="pc-subtitle">
                        Chuẩn bị metadata, nội dung Markdown và ví dụ mẫu trước khi nối API backend.
                    </p>
                </div>

                <div className="pc-actions">
                    <button
                        type="button"
                        className="pc-secondary-btn"
                        disabled={isBusy}
                        onClick={() => navigate('/admin/problems')}
                    >
                        Quay lại
                    </button>
                    <button type="submit" className="btn-neo-sub pc-submit-btn" disabled={isBusy}>
                        {isBusy ? 'Đang lưu...' : 'Lưu bản nháp'}
                    </button>
                </div>
            </div>

            <div className="pc-grid">
                <section className="pm-card pc-section">
                    <div className="pm-card-header">
                        <h3 className="pm-card-title">Thông tin cơ bản</h3>
                    </div>

                    <div className="pc-section-body">
                        <label className="pc-field pc-field-wide">
                            <span>Tên đề bài</span>
                            <input
                                className="neo-input"
                                value={form.title}
                                onChange={(event) => updateField('title', event.target.value)}
                                placeholder="VD: Tính tổng hai số"
                                required
                            />
                        </label>

                        <label className="pc-field">
                            <span>Độ khó</span>
                            <div className="pc-difficulty-options" role="radiogroup" aria-label="Chọn độ khó">
                                {difficultyOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`pc-difficulty-option pc-difficulty-${option.value.toLowerCase()} ${
                                            form.difficulty === option.value ? 'is-selected' : ''
                                        }`}
                                        role="radio"
                                        aria-checked={form.difficulty === option.value}
                                        onClick={() => updateField('difficulty', option.value)}
                                    >
                                        <span>{option.label}</span>
                                        <small>{option.hint}</small>
                                    </button>
                                ))}
                            </div>
                        </label>

                        <label className="pc-field">
                            <span>Trạng thái</span>
                            <div className="pc-toggle-row">
                                <input
                                    id="problem-public"
                                    type="checkbox"
                                    checked={form.isPublic}
                                    onChange={(event) => updateField('isPublic', event.target.checked)}
                                />
                                <label htmlFor="problem-public">Công khai</label>
                            </div>
                        </label>

                        <label className="pc-field">
                            <span>Time limit (ms)</span>
                            <input
                                className="neo-input"
                                type="number"
                                min="1"
                                step="1"
                                value={form.timeLimitMs}
                                onChange={(event) => updateField('timeLimitMs', event.target.value)}
                                required
                            />
                        </label>

                        <label className="pc-field">
                            <span>Memory limit (KB)</span>
                            <input
                                className="neo-input"
                                type="number"
                                min="1"
                                value={form.memoryLimitKb}
                                onChange={(event) => updateField('memoryLimitKb', event.target.value)}
                                required
                            />
                        </label>

                        <label className="pc-field pc-field-wide">
                            <span>Tags</span>
                            <input
                                className="neo-input"
                                value={form.tags}
                                onChange={(event) => updateField('tags', event.target.value)}
                                placeholder="array, math, greedy"
                            />
                        </label>
                    </div>
                </section>

                <aside className="pm-card pc-section pc-preview">
                    <div className="pm-card-header">
                        <h3 className="pm-card-title">Payload preview</h3>
                    </div>
                    <pre>{JSON.stringify(payloadPreview, null, 2)}</pre>
                </aside>
            </div>

            <section className="pm-card pc-section">
                <div className="pm-card-header">
                    <h3 className="pm-card-title">Nội dung đề bài</h3>
                </div>

                <div className="pc-section-body pc-content-grid">
                    <label className="pc-field">
                        <span>Mô tả</span>
                        <textarea
                            className="pc-textarea"
                            value={form.description}
                            onChange={(event) => updateField('description', event.target.value)}
                            placeholder="Nhập mô tả bài toán bằng Markdown..."
                            required
                        />
                    </label>

                    <label className="pc-field">
                        <span>Ràng buộc</span>
                        <textarea
                            className="pc-textarea"
                            value={form.constraints}
                            onChange={(event) => updateField('constraints', event.target.value)}
                            placeholder="VD: 1 <= n <= 10^5"
                        />
                    </label>
                </div>
            </section>

            <section className={`pm-card pc-section pc-upload-card pc-upload-${uploadState}`}>
                <div className="pm-card-header">
                    <h3 className="pm-card-title">Testcase judge</h3>
                </div>

                <div className="pc-upload-body">
                    <div>
                        <p className="pc-upload-title">Upload tests.zip</p>
                        <p className="pc-upload-copy">
                            File sẽ được lưu tại problems/{id ? id : '{problemId}'}/tests.zip sau khi bài được lưu.
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip,application/zip"
                        className="pc-upload-input"
                        onChange={handleTestsFileChange}
                        disabled={isBusy}
                    />

                    <div className="pc-upload-actions">
                        <button
                            type="button"
                            className="pc-secondary-btn"
                            disabled={isBusy}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Chọn tests.zip
                        </button>
                        <span className="pc-upload-status">{uploadMessage}</span>
                    </div>
                </div>
            </section>

            <section className="pm-card pc-section">
                <div className="pm-card-header">
                    <h3 className="pm-card-title">Ví dụ mẫu</h3>
                </div>

                <div className="pc-section-body pc-example-grid">
                    <label className="pc-field">
                        <span>Input</span>
                        <textarea
                            className="pc-textarea pc-code-area"
                            value={form.sampleInput}
                            onChange={(event) => updateField('sampleInput', event.target.value)}
                            placeholder="2 3"
                        />
                    </label>

                    <label className="pc-field">
                        <span>Output</span>
                        <textarea
                            className="pc-textarea pc-code-area"
                            value={form.sampleOutput}
                            onChange={(event) => updateField('sampleOutput', event.target.value)}
                            placeholder="5"
                        />
                    </label>

                    <label className="pc-field pc-field-wide">
                        <span>Giải thích</span>
                        <textarea
                            className="pc-textarea pc-code-area"
                            value={form.sampleExplanation}
                            onChange={(event) => updateField('sampleExplanation', event.target.value)}
                            placeholder="2 + 3 = 5"
                        />
                    </label>
                </div>
            </section>
        </form>
    );
};

export default ProblemCreate;
