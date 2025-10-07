"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useToggleVisibility } from "@/lib/hooks/useToggleVisibility";
import { authSchema, FormData } from "@/lib/schemas/auth-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInClient() {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({ resolver: zodResolver(authSchema) });
	const router = useRouter();
	const { toggleVisibility, handleToggleVisibility } = useToggleVisibility();
	const [loginError, setLoginError] = useState("");

	const onSubmit = async (data: FormData) => {
		try {
			const res = await fetch("http://localhost:3222/sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const resData = await res.json();
			if (!res.ok) {
				if (res.status === 409) {
					setLoginError(resData.error);
					router.push("/sign-up");
					return;
				}
				setLoginError(resData.error);
				return;
			}
			localStorage.setItem("token", resData.token);
			localStorage.setItem("todos", JSON.stringify(resData.todos));
			console.log(resData.message);
			reset();
			router.push("/");
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
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mb-4">
					<Label htmlFor="email" className="mb-2">
						Email
					</Label>
					<Input
						type="email"
						id="email"
						{...register("email")}
						className="text-[14px] placeholder:text-[14px]"
						placeholder="you@example.com"
						aria-describedby="email-error"
						aria-invalid={!!errors.email}
					/>
					{errors.email && (
						<p id="email-error" className="text-red-500 text-[14px] mt-1">
							{errors.email.message}
						</p>
					)}
				</div>

				<div className="mb-8 relative">
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
							aria-describedby="password-error"
							aria-invalid={!!errors.password}
							aria-label={toggleVisibility ? "Hide password" : "Show password"}
							aria-pressed={toggleVisibility}
						/>
						<button
							onClick={handleToggleVisibility}
							type="button"
							className="absolute right-2 top-1/2 -translate-y-1/2"
						>
							{toggleVisibility ? (
								<EyeOff className="size-4" aria-hidden="true" />
							) : (
								<Eye className="size-4" aria-hidden="true" />
							)}
						</button>
					</div>

					{errors.password && (
						<p id="password-error" className="text-red-500 text-[14px] mt-1">
							{errors.password.message}
						</p>
					)}
				</div>

				<Button
					className="w-full disabled:opacity-50"
					type="submit"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					{isSubmitting ? (
						<span className="flex items-center gap-2" aria-live="polite">
							<div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
							Signing in ...
						</span>
					) : (
						"Sign in"
					)}
				</Button>
			</form>
		</>
	);
}
