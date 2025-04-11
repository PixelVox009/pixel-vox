import React from "react";

const ImportantNotes: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Lưu ý quan trọng:</h3>
          <ul className="space-y-2 text-blue-700 dark:text-blue-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Token sẽ được tự động cộng vào tài khoản sau khi hệ thống xác nhận giao dịch (5-15 phút)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Vui lòng điền chính xác nội dung chuyển khoản để hệ thống xác nhận tự động</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Số tiền tối thiểu để nhận được 1 token là 25,000 VND</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Nếu cần hỗ trợ, vui lòng liên hệ hotline: 1900 xxxx</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportantNotes;
