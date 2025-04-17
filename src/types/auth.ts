import { z } from "zod";

// Schema validation
export const registerFormSchema = z.object({
    name: z.string().min(2, {
        message: "Tên phải chứa ít nhất 2 ký tự.",
    }),
    email: z.string().email({
        message: "Email không hợp lệ.",
    }),
    password: z.string().min(6, {
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
    }),
    terms: z.boolean().refine((val) => val === true, {
        message: "Bạn phải đồng ý với điều khoản để tiếp tục.",
    }),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;