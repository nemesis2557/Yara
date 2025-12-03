"use client";

import React, { useState } from "react";
import Image from "next/image"; // 👈 IMPORTANTE
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
}: LoginFormProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data.email, data.password);
      onSuccess?.();
    } catch (err: any) {
      setError(err.errorMessage || "Login failed. Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-[#f3e1c5]/25 bg-[#1b120a] text-[#f7e7cf] shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center gap-3 py-6 px-6">
        <div className="text-center text-3xl font-extrabold tracking-[0.18em]">
          LUWAK MANAGER
        </div>

        {/* 👇 Logo responsive (PC / laptop / pantallas pequeñas) */}
        <div className="mt-2 w-full max-w-[380px] md:max-w-[440px] h-40 md:h-52 relative">
          <Image
            src="/IMG-HEADER/LogoLuwak.WEBP"
            alt="Logo Luwak"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p className="text-sm text-[#f7e7cf]/70">
          Inicia sesión para continuar
        </p>
      </div>

      {/* FORM */}
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="mb-1 h-[22px] text-sm font-medium text-[#f7e7cf]">
              Email
            </div>
            <Input
              id="email"
              type="email"
              placeholder="email"
              {...register("email")}
              disabled={isLoading}
              className="bg-[#0f0a06]/70 border-[#f3e1c5]/30 text-[#f7e7cf] placeholder:text-[#f7e7cf]/40"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1 h-[22px] text-sm font-medium text-[#f7e7cf]">
              <span>Password</span>
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-[#f7e7cf]/70 hover:underline cursor-pointer"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="password"
              {...register("password")}
              disabled={isLoading}
              className="bg-[#0f0a06]/70 border-[#f3e1c5]/30 text-[#f7e7cf] placeholder:text-[#f7e7cf]/40"
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full my-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>

          {onSwitchToRegister && (
            <div className="text-center text-sm flex items-center justify-center gap-2 text-[#f7e7cf]/80">
              <span className="text-[#f7e7cf]/70">
                Don't have an account?
              </span>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="cursor-pointer hover:underline"
                disabled={isLoading}
              >
                Register now
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
