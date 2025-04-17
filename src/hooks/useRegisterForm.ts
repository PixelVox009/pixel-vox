import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { RegisterFormData, registerFormSchema } from "@/types/auth";
import { authService } from "@/lib/api/auth";


export const useRegisterForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            terms: false,
        },
    });

    const termsValue = watch("terms");

    const { mutate, isError, error, isPending } = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            router.push("/login?success=Đăng ký thành công");
        },
    });

    const onSubmit = (values: RegisterFormData) => {
        mutate(values);
    };

    return {
        register,
        handleSubmit,
        errors,
        setValue,
        termsValue,
        isError,
        error: isError ? (error instanceof Error ? error.message : "Đăng ký thất bại") : null,
        isSubmitting: isPending,
        onSubmit,
    };
};