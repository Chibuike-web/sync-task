"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, X } from "lucide-react";
import { useToggleVisibility } from "@/lib/hooks/use-toggle-visibility";
import { authSchema, FormData } from "@/lib/schemas/auth-schema";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpClient() {
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
			const res = await fetch("http://localhost:3222/sign-up", {
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
						router.push("/sign-in");
						reset();
					}, 1000);
				} else {
					setRegistrationError(resData.error || "Something went wrong");
				}
				return;
			}
			reset();
			router.push("/sign-in");
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
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex gap-4 mb-6">
					<div>
						<Label htmlFor="email" className="mb-2 flex items-center justify-between">
							First name
							<span id="firstName-optional" className="text-[12px] text-foreground/40">
								Optional
							</span>
						</Label>
						<Input
							type="text"
							id="firstName"
							aria-describedby="firstName-optional"
							{...register("firstName")}
							className="text-[14px] placeholder:text-[14px]"
							placeholder="Enter your first name"
						/>
					</div>
					<div>
						<Label htmlFor="email" className="mb-2 flex items-center justify-between">
							Last name{" "}
							<span id="lastName-optional" className="text-[12px] text-foreground/40">
								Optional
							</span>
						</Label>
						<Input
							type="text"
							id="lastName"
							aria-describedby="lastName-optional"
							{...register("lastName")}
							className="text-[14px] placeholder:text-[14px]"
							placeholder="Enter your last name"
						/>
					</div>
				</div>
				<div className="mb-6">
					<Label htmlFor="email" className="mb-2">
						Email
					</Label>
					<Input
						type="email"
						id="email"
						{...register("email")}
						className="text-[14px] placeholder:text-[14px]"
						placeholder="you@example.com"
						aria-invalid={!!errors.email}
						aria-describedby="email-error"
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
						/>
						<button
							onClick={handleToggleVisibility}
							type="button"
							className="absolute right-2 top-1/2 -translate-y-1/2"
							aria-label={toggleVisibility ? "Hide password" : "Show password"}
							aria-pressed={toggleVisibility}
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
					className="w-full disabled:opacity-50 outline-2 outline-red-500"
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
		</>
	);
}
