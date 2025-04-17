import { Mail, MessageCircle, PhoneCall } from "lucide-react";
import { useState } from "react";

export default function DirectContactTab() {
  const [contactMethod, setContactMethod] = useState<string>("phone");

  return (
    <div className="bg-white dark:bg-slate-800  p-6 sm:p-8">
      <div className="mx-auto">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Contact directly to deposit credits</h2>

        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please choose the contact method that suits you. Our support staff will contact you and guide you through
            the token deposit process.
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
                Phone
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
                Chat online
              </span>
            </div>
          </div>
        </div>

        {contactMethod === "phone" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 mb-6">
            <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">Contact by phone</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Call us during business hours (8:00 - 18:00)</p>
            <div className="flex items-center">
              <PhoneCall className="h-5 w-5 text-blue-600 mr-2" />
              <a href="tel:0967747745" className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                0967747745
              </a>
            </div>
          </div>
        )}

        {contactMethod === "email" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 mb-6">
            <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">Contact via email</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Send your request via email and we will respond within 24 hours
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
            <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">Chat online</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">24/7 online support staff</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Start chatting
            </button>
          </div>
        )}

        <div className="mt-8 border-t dark:border-gray-700 pt-6">
          <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">Important information</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
            <li>We can offer special packages for corporate customers.</li>
            <li>Payment can be made via bank transfer or other payment methods as agreed.</li>
            <li>Please have your account information ready when contacting us.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
