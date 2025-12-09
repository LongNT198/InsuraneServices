# Quy Trình Làm Việc Với Git (Team 3 Người)

Tài liệu này hướng dẫn quy trình đóng góp code để tránh xung đột (conflict) và mất code khi làm việc nhóm.

## ⛔ Quy Tắc Vàng
1. **KHÔNG BAO GIỜ** push code trực tiếp lên nhánh `main` (hoặc `master`).
2. Nhánh `main` chỉ chứa code đã được kiểm tra và chạy ổn định.
3. Luôn **Pull** code mới nhất về trước khi bắt đầu làm task mới.

---

## 🔄 Quy Trình Các Bước (Workflow)

Mỗi khi bắt đầu một tính năng mới (hoặc sửa lỗi), hãy tuân thủ 5 bước sau:

### Bước 1: Cập nhật code mới nhất
Đảm bảo bạn đang ở nhánh chính và code của bạn giống hệt trên server.
```bash
git checkout main
git pull origin main
```

### Bước 2: Tạo nhánh mới (Feature Branch)
Đặt tên nhánh theo cú pháp: `feature/ten-tinh-nang` hoặc `fix/ten-loi`.
Ví dụ: `feature/login-page`, `feature/payment-momo`, `fix/header-logo`
```bash
git checkout -b feature/ten-tinh-nang-cua-ban
```

### Bước 3: Code và Commit
Làm việc trên nhánh này. Commit thường xuyên.
```bash
git add .
git commit -m "Mô tả ngắn gọn những gì bạn đã làm"
```

### Bước 4: Đẩy code lên GitHub (Push)
```bash
git push origin feature/ten-tinh-nang-cua-ban
```

### Bước 5: Tạo Pull Request (PR)
1. Truy cập repo trên GitHub.
2. Bạn sẽ thấy thông báo có nhánh mới -> Bấm **"Compare & pull request"**.
3. Viết mô tả những gì đã thay đổi.
4. **Báo cho đồng đội** vào review (xem) code.
5. Nếu mọi thứ OK -> Bấm **Merge**.

---

## 💥 Cách Xử Lý Xung Đột (Conflict)

Nếu khi tạo PR mà báo conflict (do người khác đã sửa vào file bạn đang sửa và merge trước bạn), hãy làm như sau:

1. Tại nhánh của bạn (ví dụ `feature/cua-bạn`), lấy code mới nhất từ `main` về để trộn:
   ```bash
   git pull origin main
   ```

2. VS Code sẽ báo file nào bị conflict. Mở file đó ra.

3. Tìm các đoạn bị đánh dấu:
   ```
   <<<<<<< HEAD
   Code của bạn
   =======
   Code trên main (của người khác)
   >>>>>>> main
   ```

4. **Sửa bằng tay**: Chọn code đúng, xóa các ký tự `<<<<`, `====`, `>>>>`.

5. Lưu file, sau đó commit và push lại:
   ```bash
   git add .
   git commit -m "Fix conflict"
   git push origin feature/cua-bạn
   ```
   *(Lúc này PR trên GitHub sẽ tự động cập nhật và hết conflict)*

---

## 📝 Một số quy ước khác
* **Tên Commit**: Nên rõ ràng. VD: `Thêm giao diện trang Login` thay vì `update code`.
* **Tên Nhánh**: Không dấu, dùng gạch nối. VD: `trang-chu` thay vì `trang chủ`.
