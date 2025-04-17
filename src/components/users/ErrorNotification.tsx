import React from "react";

const ErrorNotification: React.FC = () => {
  return (
    <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
      <p className="text-red-700 text-sm">Không thể kiểm tra trạng thái thanh toán</p>
    </div>
  );
};

export default ErrorNotification;
