"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useToggleVisibility } from "@/lib/hooks/useToggleVisibility";
import { authSchema, FormData } from "@/lib/schemas/authSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginClient() {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({ resolver: zodResolver(authSchema) });
	const router = useRouter();
	const { toggleVisibility, handleToggleVisibility } = useToggleVisibility();
	const [loginError, setLoginError] = useState("");

	const onSubmit = async (data: FormData) => {
		try {
			const res = await fetch("http://localhost:3222/todos/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const resData = await res.json();
			if (!res.ok) {
				if (res.status === 409) {
					setLoginError(resData.error);
					router.push("/todos/signup");
					return;
				}
				setLoginError(resData.error);
				return;
			}
			localStorage.setItem("token", resData.token);
			console.log(resData.message);
			reset();
			router.push("/todos");
		} catch (err) {
			console.error("Issue authenticating user", err);
			setLoginError("Something went wrong. Please try again.");
		}
	};

	return (
		<>
			{loginError && (
				<div className="flex justify-between items-center gap-2 px-3 py-2 mb-4 bg-red-100 text-red-700 text-sm font-medium rounded-md border border-red-200 shadow-sm">
					{loginError}
					<button type="button" onClick={() => setLoginError("")} className="text-red-700">
						<X size={20} />
					</button>
				</div>
			)}
			<form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
				<fieldset className="mb-4">
					<Label htmlFor="email" className="mb-2">
						Email
					</Label>
					<Input
						type="email"
						id="email"
						{...register("email")}
						className="text-[14px] placeholder:text-[14px]"
						placeholder="you@example.com"
						aria-describedby={errors.email ? "email-error" : undefined}
						aria-invalid={errors.email ? true : false}
					/>
					{errors.email && (
						<p id="email-error" className="text-red-500 text-[14px] mt-1">
							{errors.email.message}
						</p>
					)}
				</fieldset>

				<fieldset className="mb-8 relative">
					<Label htmlFor="password" className="mb-2">
						Password
					</Label>
					<div className="relative">
						<Input
							type={toggleVisibility ? "text" : "password"}
							id="password"
							{...register("password")}
							className="text-[14px] placeholder:text-[14px]"
							placeholder="Enter your password"
							aria-describedby={errors.password ? "password-error" : undefined}
							aria-invalid={errors.password ? true : false}
						/>
						<button
							onClick={handleToggleVisibility}
							type="button"
							className="absolute right-2 top-1/2 -translate-y-1/2"
						>
							{toggleVisibility ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
						</button>
					</div>

					{errors.password && (
						<p id="password-error" className="text-red-500 text-[14px] mt-1">
							{errors.password.message}
						</p>
					)}
				</fieldset>

				<Button
					className="w-full disabled:opacity-50"
					type="submit"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					{isSubmitting ? (
						<span className="flex items-center gap-2" aria-live="polite">
							<div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
							Logging in
						</span>
					) : (
						"Log in"
					)}
				</Button>
			</form>

			<p className="text-sm text-center text-gray-600">
				Don't have an account?{" "}
				<Link href="/todos/signup" className="text-blue-600 hover:underline cursor-pointer">
					Sign Up
				</Link>
			</p>
		</>
	);
}
