import axiosInstance from "../axios";

/**
 * Payments Service
 * Gọi tới PaymentsController (Customer)
 *
 * Backend hiện có các endpoint:
 *  - GET  /api/payments/my-payments
 *  - GET  /api/payments/{id}
 *  - GET  /api/payments/upcoming
 *  - GET  /api/payments/history
 *  - POST /api/payments/make-payment
 *
 * Các endpoint admin (all, confirm, refund) đang dùng trong adminService,
 * nên ở đây ta chỉ tập trung cho phía Customer.
 */

const paymentsService = {
  /**
   * Lấy tất cả payments của user hiện đang đăng nhập
   * -> dùng cho màn "My Payments" nếu sau này bạn cần
   */
  getMyPayments: async () => {
    return await axiosInstance.get("/api/payments/my-payments");
  },

  /**
   * Lấy chi tiết 1 payment theo Id
   */
  getPaymentById: async (paymentId) => {
    return await axiosInstance.get(`/api/payments/${paymentId}`);
  },

  /**
   * Lấy các kỳ phí sắp tới trong 30 ngày
   * -> /api/payments/upcoming
   */
  getUpcomingPayments: async () => {
    return await axiosInstance.get("/api/payments/upcoming");
  },

  /**
   * Lịch sử thanh toán (Paid + Failed)
   * -> /api/payments/history
   */
  getPaymentHistory: async () => {
    return await axiosInstance.get("/api/payments/history");
  },

  /**
   * Customer thực hiện thanh toán cho 1 kỳ phí
   * Map vào MakePaymentRequest ở backend:
   *
   * public class MakePaymentRequest {
   *   public int PaymentId { get; set; }
   *   public string PaymentMethod { get; set; }
   *   public string? TransactionId { get; set; }
   *   public string? Notes { get; set; }
   * }
   */
  makePayment: async ({ paymentId, paymentMethod, transactionId, notes }) => {
    return await axiosInstance.post("/api/payments/make-payment", {
      PaymentId: paymentId,
      PaymentMethod: paymentMethod,
      TransactionId: transactionId,
      Notes: notes,
    });
  },
};

export default paymentsService;
