# ByeBug
# 🐛 ByeBug - Online Judge System - Đồ án Lập trình Web
Đây là dự án Hệ thống chấm bài trực tuyến được thực hiện cho môn Lập trình Web. Nền tảng cho phép người dùng luyện tập lập trình bằng cách nộp code giải các bài toán thuật toán. Hệ thống tự động chấm bài trong sandbox cách ly, trả về kết quả realtime với các verdict: **AC / WA / TLE / MLE / RE / CE**.


## 🛠 Công nghệ sử dụng (Tech Stack)
Để hoàn thành đồ án này, nhóm mình sử dụng các công nghệ chính:
- **Frontend:** ReactJS  (JavaScript) để xây dựng giao diện người dùng.
- **Backend:** Spring Boot (Java) xử lý logic hệ thống và quản lý bài tập.
- **Cơ sở dữ liệu:** PostgreSQL để lưu trữ thông tin user và bài tập.
- **Lưu trữ:** MinIO để quản lý cái file testcase và code nộp.


## ✨ Tính năng
### 1. Dành cho người dùng (User)
- **Xác thực:** Đăng ký, đăng nhập, quên mật khẩu và lấy lại mật khẩu qua mã OTP gửi tới Email.
- **Luyện tập:** Xem, lọc danh sách bài tập theo độ khó, chủ đề, trạng thái, phân trang.
- **Chấm bài:** Nộp code trực tuyến hoặc upload file. Kết quả trả về gồm: AC(Đúng), WA(Sai), TLE(Quá thời gian)...
- **Xếp hạng:** Xem bảng vinh danh những người dùng có tổng điểm cao nhất.
- **Cá nhân:** Theo dõi lịch sử làm bài và biểu đồ thống kê kết quả của bản thân.

### 2. Dành cho quản trị viên (Admin) 
- **Dashboard:** Theo dõi biểu đồ submission và thống kê hệ thống realtime.
- **Quản lý bài tập:** Thêm, sửa, xóa bài toán và bộ testcase tương ứng.
- **Quản lý người dùng:** Theo dõi danh sách, khóa tài khoản hoặc xem lịch sử của bất kỳ user nào.
- **Giám sát hệ thống:** Xem toàn bộ các bài nộp để hỗ trợ người dùng kịp thời.


## 📁 Cấu trúc thư mục dự án
Chia dự án thành 2 phần chính để quản lý:

```plaintext
online-judge/
├── frontend/           
├── backend/            
├── database/          
└── README.md           
```
## 🚀 Cách chạy đồ án trên máy (Local)
### 1. Chuẩn bị
- Cài đặt Java 17 và Node.js.
- Cài đtặ PostgreSQL để chạy database.

### 2. Chạy Backend
- Mở thư mục ```backend/``` bằng IntelliJ hoặc VS Code.
- Cấu hình thông tin database trong file ```application.yml```.
- Chạy ứng dụng Spring Boot.

### 3. Chạy Frontend
- Mở terminal tại thư mục ```frontend/```.
- Chạy lệnh ```npm install``` để cài thư viện.
- Chạy lệnh ```npm run dev``` để mở trang web.


## 🗄 Database Schema

Gồm 6 bảng chính:

| Bảng | Mô tả |
|------|-------|
| `users` | Thông tin người dùng, role, điểm |
| `problems` | Bài toán, Markdown đề, time/memory limit |
| `testcases` | Input/output lưu path MinIO |
| `submissions` | Kết quả mỗi lần nộp bài |
| `testcase_results` | Kết quả từng testcase trong 1 lần nộp |
| `notifications` | Thông báo hệ thống |

> Migration tự động bằng **Flyway** khi khởi động backend.

---

## 🗺 Pages Map

| Route | Trang | Quyền |
|-------|-------|-------|
| `/login` | Đăng nhập | Public |
| `/register` | Đăng ký | Public |
| `/forgot-password` | Quên mật khẩu | Public |
| `/` | Trang chủ | User |
| `/problems` | Danh sách bài tập | User |
| `/problems/:id` | Chi tiết & nộp bài | User |
| `/submissions/:id` | Chi tiết lần nộp | User |
| `/ranking` | Bảng xếp hạng | User |
| `/profile/:username` | Hồ sơ cá nhân | User |
| `/settings` | Cài đặt tài khoản | User |
| `/admin` | Dashboard | Admin |
| `/admin/users` | Quản lý Users | Admin |
| `/admin/problems` | Quản lý Bài tập | Admin |
| `/admin/problems/:id/edit` | Sửa bài toán | Admin |
| `/admin/submissions` | Quản lý Submissions | Admin |
| `/admin/notifications` | Quản lý Thông báo | Admin |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập, nhận JWT |
| POST | `/api/auth/forgot-password` | Gửi OTP về email |
| POST | `/api/auth/reset-password` | Đặt mật khẩu mới |

### Problems
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/problems` | Danh sách bài (filter, phân trang) |
| GET | `/api/problems/:id` | Chi tiết bài toán |
| POST | `/api/admin/problems` | Tạo bài mới |
| PUT | `/api/admin/problems/:id` | Sửa bài |
| DELETE | `/api/admin/problems/:id` | Xóa bài |

### Submissions
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/submissions` | Nộp bài |
| GET | `/api/submissions/:id` | Chi tiết lần nộp |
| GET | `/api/problems/:id/my-submissions` | Lịch sử nộp của tôi |
| POST | `/api/admin/submissions/:id/rejudge` | Re-judge |

### Users & Ranking
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/ranking` | Bảng xếp hạng |
| GET | `/api/users/:username` | Hồ sơ user |
| PUT | `/api/users/me` | Cập nhật thông tin |

## 📝 Lời kết

Dự án **ByeBug** 🐛 là kết quả của quá trình học tập và nghiên cứu về lập trình Web  với **ReactJS** và **Spring Boot**. Hy vọng hệ thống này sẽ là một công cụ hữu ích cho các bạn sinh viên trong việc rèn luyện tư duy thuật toán và kỹ năng lập trình.

Do thời gian thực hiện có hạn, dự án chắc chắn không tránh khỏi những thiếu sót. Rất mong nhận được sự góp ý và phản hồi từ Thầy/Cô và các bạn để hệ thống ngày càng hoàn thiện hơn.

**Xin chân thành cảm ơn!**

---