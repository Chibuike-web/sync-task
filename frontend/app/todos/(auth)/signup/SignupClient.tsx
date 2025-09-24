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
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupClient() {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({ resolver: zodResolver(authSchema) });
	const router = useRouter();

	const [registrationError, setRegistrationError] = useState("");

	const { toggleVisibility, handleToggleVisibility } = useToggleVisibility();

	const onSubmit = async (data: FormData) => {
		try {
			const res = await fetch("http://localhost:3222/todos/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const resData = await res.json();
			if (!res.ok) {
				if (res.status === 400) {
					const error = resData.error;
					setRegistrationError(error);
				} else if (res.status === 409) {
					const error = resData.error;
					setRegistrationError(error);
					setTimeout(() => {
						router.push("/todos/login");
						reset();
					}, 1000);
				} else {
					setRegistrationError(resData.error || "Something went wrong");
				}
				return;
			}
			reset();
			router.push("/todos/login");
		} catch (err) {
			console.error("Issue registering user:", err);
			setRegistrationError("Something went wrong. Please try again.");
		}
	};

	return (
		<>
			{registrationError && (
				<div className="flex justify-between items-center gap-2 px-3 py-2 mb-4 bg-red-100 text-red-700 text-sm font-medium rounded-md border border-red-200 shadow-sm">
					{registrationError}
					<button type="button" onClick={() => setRegistrationError("")} className="text-red-700">
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
					/>
					{errors.email && <p className="text-red-500 text-[14px] mt-1">{errors.email.message}</p>}
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
						<p className="text-red-500 text-[14px] mt-1">{errors.password.message}</p>
					)}
				</fieldset>

				<Button
					className="w-full disabled:opacity-50"
					type="submit"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					{isSubmitting ? (
						<span className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Signing up...
						</span>
					) : (
						"Sign up"
					)}
				</Button>
			</form>

			<p className="text-sm text-center text-gray-600">
				Already have an account?{" "}
				<Link href="/todos/login" className="text-blue-600 hover:underline cursor-pointer">
					Log In
				</Link>
			</p>
		</>
	);
}
