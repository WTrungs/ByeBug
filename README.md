# 🐞 ByeBug - Online Judge Platform

## 📖 Giới thiệu

**ByeBug** là một nền tảng Online Judge hỗ trợ luyện tập lập trình và đánh giá lời giải tự động.

Người dùng có thể lựa chọn bài toán, nộp mã nguồn và nhận kết quả chấm bài theo thời gian thực. Hệ thống được thiết kế theo hướng mở rộng, hỗ trợ xử lý bất đồng bộ thông qua Redis Queue và thực thi chương trình trong Docker Sandbox nhằm đảm bảo tính an toàn và ổn định.
<br>

## 🚀 Chức năng chính

### Người dùng

* Đăng ký, đăng nhập và khôi phục mật khẩu bằng OTP Email.
* Xem và tìm kiếm bài tập theo độ khó, chủ đề.
* Nộp mã nguồn trực tuyến.
* Theo dõi kết quả chấm bài.
* Xem lịch sử làm bài.
* Theo dõi bảng xếp hạng.
* Xem thống kê kết quả cá nhân.

### Quản trị viên

* Quản lý người dùng.
* Quản lý bài toán và testcase.
* Theo dõi hoạt động hệ thống.
* Gửi thông báo tới người dùng.
* Giám sát các bài nộp.

<br>

## 🏗️ Kiến trúc hệ thống

### Công nghệ sử dụng

| Thành phần     | Công nghệ                         |
| -------------- | --------------------------------- |
| Frontend       | React, TypeScript, Vite           |
| Backend API    | Spring Boot, Spring Security, JWT |
| Database       | PostgreSQL                        |
| Message Queue  | Redis                             |
| Object Storage | MinIO                             |
| Judge Engine   | Spring Boot Worker                |
| Sandbox        | Docker                            |

### Kiến trúc tổng thể

* Frontend gửi yêu cầu tới Backend API.
* Backend lưu dữ liệu vào PostgreSQL.
* Submission được đưa vào Redis Queue.
* Judge Engine lấy Job từ Queue để xử lý.
* Docker Sandbox thực hiện biên dịch và chạy chương trình.
* Kết quả được cập nhật vào cơ sở dữ liệu và trả về người dùng.

<br>

### Cấu trúc dự án

```text
ByeBug/
├── frontend/
├── backend/
├── judge-engine/
├── database/
├── docs/
└── README.md
```

<br>

## ⚙️ Hướng dẫn chạy dự án

### Yêu cầu

* Java 17+
* Node.js 20+
* PostgreSQL
* Redis
* MinIO
* Docker

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

<br>

## 📄 Tài liệu

Toàn bộ tài liệu thiết kế hệ thống được lưu trong thư mục:

```text
BAOCAO_LATEX/
```

Bao gồm:

* Thiết kế hệ thống
* Thiết kế cơ sở dữ liệu
* Đặc tả REST API
* Kiến trúc triển khai
* Đánh giá hiệu năng

<br>

## 👨‍💻 Nhóm thực hiện

| MSSV     | Họ và tên             |
| -------- | --------------------- |
| 24520403 | Trần Nhật Duy         |
| 24521885 | Nguyễn Cao Xuân Trung |
| 24521238 | Tô Công Hữu Nhân      |
| 24520063 | Nguyễn Ngọc Thu An    |

**Giảng viên hướng dẫn:** ThS. Nghi Hoàng Khoa

**Môn học:** Lập trình Ứng dụng Web (NT208)

<br>

## 📌 Ghi chú

Dự án được phát triển phục vụ mục đích học tập và nghiên cứu trong học phần Lập trình Ứng dụng Web tại Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM.
