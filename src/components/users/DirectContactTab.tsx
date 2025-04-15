import { useState } from "react";
import { PhoneCall, Mail, MessageCircle } from "lucide-react";

export default function DirectContactTab() {
  const [contactMethod, setContactMethod] = useState<string>("phone");

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Liên hệ trực tiếp để nạp token</h2>

        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Vui lòng chọn phương thức liên hệ phù hợp với bạn. Nhân viên hỗ trợ của chúng tôi sẽ liên hệ lại và hướng
            dẫn bạn quy trình nạp token.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div
              className={`border-2 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                contactMethod === "phone"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
              onClick={() => setContactMethod("phone")}
            >
              <PhoneCall
                className={`h-8 w-8 ${
                  contactMethod === "phone" ? "text-blue-600" : "text-gray-500 dark:text-gray-400"
                } mb-2`}
              />
              <span
                className={`font-medium ${
                  contactMethod === "phone" ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Gọi điện thoại
              </span>
            </div>

            <div
              className={`border-2 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                contactMethod === "email"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
              onClick={() => setContactMethod("email")}
            >
              <Mail
                className={`h-8 w-8 ${
                  contactMethod === "email" ? "text-blue-600" : "text-gray-500 dark:text-gray-400"
                } mb-2`}
              />
              <span
                className={`font-medium ${
                  contactMethod === "email" ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Email
              </span>
            </div>

            <div
              className={`border-2 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                contactMethod === "chat"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
              onClick={() => setContactMethod("chat")}
            >
              <MessageCircle
                className={`h-8 w-8 ${
                  contactMethod === "chat" ? "text-blue-600" : "text-gray-500 dark:text-gray-400"
                } mb-2`}
              />
              <span
                className={`font-medium ${
                  contactMethod === "chat" ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Chat trực tuyến
              </span>
            </div>
          </div>
        </div>

        {contactMethod === "phone" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 mb-6">
            <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">Liên hệ qua điện thoại</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Gọi cho chúng tôi trong giờ làm việc (8:00 - 18:00)</p>
            <div className="flex items-center">
              <PhoneCall className="h-5 w-5 text-blue-600 mr-2" />
              <a href="tel:+84123456789" className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                +84 123 456 789
              </a>
            </div>
          </div>
        )}

        {contactMethod === "email" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 mb-6">
            <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">Liên hệ qua email</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Gửi yêu cầu qua email và chúng tôi sẽ phản hồi trong vòng 24 giờ
            </p>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-600 mr-2" />
              <a href="mailto:support@pixelvox.ai" className="text-blue-600 dark:text-blue-400 font-medium">
                support@pixelvox.ai
              </a>
            </div>
          </div>
        )}

        {contactMethod === "chat" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 mb-6">
            <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">Chat trực tuyến</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Nhân viên hỗ trợ trực tuyến 24/7</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Bắt đầu chat
            </button>
          </div>
        )}

        <div className="mt-8 border-t dark:border-gray-700 pt-6">
          <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">Thông tin quan trọng</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
            <li>Số lượng token tối thiểu khi nạp qua liên hệ trực tiếp là 100 token.</li>
            <li>Chúng tôi có thể cung cấp các gói ưu đãi đặc biệt cho khách hàng doanh nghiệp.</li>
            <li>
              Thanh toán có thể được thực hiện qua chuyển khoản hoặc các phương thức thanh toán khác tùy theo thỏa
              thuận.
            </li>
            <li>Vui lòng chuẩn bị sẵn thông tin tài khoản của bạn khi liên hệ với chúng tôi.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
