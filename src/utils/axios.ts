import axios from "axios";
import { signOut } from "next-auth/react";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL + "/api" || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    if (error?.response?.status === 401) {
      await signOut({
        callbackUrl: "/login",
        redirect: false,
      }).then(() => {
        // toast({
        //   title: "Đăng nhập thất bại",
        //   description: error?.response?.data.message,
        //   duration: 3000,
        //   className:
        //     "bg-red-400 text-white border border-red-600 rounded-lg shadow-lg fixed top-5 right-5 w-[400px] max-w-full",
        // });
      });
      return;
    }

    if (error?.response?.data && error?.response?.status !== 401) {
      return Promise.reject(error.response.data);
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
