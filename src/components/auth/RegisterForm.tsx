import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export const RegisterForm = () => {
  const { register, handleSubmit, errors, setValue, termsValue, error, isSubmitting, onSubmit } = useRegisterForm();

  return (
    <div>
      {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Họ tên
          </label>
          <Input
            id="name"
            placeholder="Nguyễn Văn A"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="example@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Ít nhất 6 ký tự"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={termsValue}
              onChange={(e) => setValue("terms", e.target.checked)}
            />
            <label htmlFor="terms" className="text-sm">
              Tôi đồng ý với{" "}
              <a href="#" className="text-primary">
                điều khoản sử dụng
              </a>
            </label>
          </div>
          {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"} {!isSubmitting && <ArrowRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
