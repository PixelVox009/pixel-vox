import React from "react";
import { XIcon } from "lucide-react";

interface PendingNotificationProps {
  checkCount: number;
  onClose: () => void;
}

const PendingNotification: React.FC<PendingNotificationProps> = ({ checkCount, onClose }) => {
  return (
    <div className="mt-6 bg-blue-50 p-4 rounded-md relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-blue-700 hover:text-blue-900"
        aria-label="Đóng thông báo"
      >
        <XIcon className="h-5 w-5" />
      </button>
      <p className="text-blue-700 text-sm">
        Hệ thống đang chờ xác nhận thanh toán từ ngân hàng. Thông báo sẽ xuất hiện ở đây khi thanh toán được xác nhận.
        {checkCount > 1 && ` (Đã kiểm tra ${checkCount} lần)`}
      </p>
    </div>
  );
};

export default PendingNotification;
