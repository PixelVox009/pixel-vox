import Image from "next/image";
import React, { useEffect, useState } from "react";

interface QRCodeDisplayProps {
  qrCodeUrl: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCodeUrl }) => {
  const [exchangeRates, setExchangeRates] = useState({
    vndToUsdRate: 25000,
    usdToTokenRate: 10,
  });

  // Lấy tỷ giá từ API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("/api/settings/exchange-rates");
        if (response.ok) {
          const data = await response.json();
          setExchangeRates({
            vndToUsdRate: data.vndToUsdRate || 25000,
            usdToTokenRate: data.usdToTokenRate || 10,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy tỷ giá:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md sticky p-8 mt-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">Scan QR code to pay</h2>

      <div className="flex flex-col items-center justify-center">
        <div className="bg-white p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-md mb-4 w-full max-w-xs">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="QR Code chuyển khoản"
              width={300}
              height={300}
              className="w-full h-auto"
              unoptimized
            />
          ) : (
            <div className="animate-pulse bg-slate-200 dark:bg-slate-700 w-full h-64 rounded"></div>
          )}
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Use your banking app to scan this QR code or enter your transfer information manually
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 dark:text-green-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-slate-700 dark:text-slate-300">Quick</span>
            </div>

            <div className="inline-flex items-center px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-slate-700 dark:text-slate-300">Safe</span>
            </div>

            <div className="inline-flex items-center px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-sm text-slate-700 dark:text-slate-300">Easy</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Status: <span className="text-blue-600 dark:text-blue-400">Awaiting payment</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="italic">
                1 USD = {exchangeRates.usdToTokenRate} credits = {exchangeRates.vndToUsdRate.toLocaleString("vi-VN")}{" "}
                VND
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
