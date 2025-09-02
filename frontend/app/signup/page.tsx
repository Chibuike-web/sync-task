"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useToggleVisibility } from "../Hooks";
import { authSchema, FormData } from "../schemas/authSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
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
			const res = await fetch("http://localhost:3222/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const errorData = await res.json();
				if (res.status === 400) {
					const error = errorData.message || "Missing Inputs";
					setRegistrationError(error);
				} else if (res.status === 409) {
					const error = errorData.message || "user already exist";
					console.log(error);
					setRegistrationError(error);
					setTimeout(() => {
						router.push("/login");
						reset();
					}, 1000);
				} else {
					setRegistrationError(errorData.message || "Something went wrong");
				}
				return;
			}
			const resData = await res.json();
			console.log(resData.message);
			reset();
			router.push("/login");
		} catch (err) {
			console.error("Issue registering user:", err);
			setRegistrationError("Something went wrong. Please try again.");
		}
	};

	return (
		<section className="flex items-center justify-center h-screen bg-gray-50 px-4">
			<main className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 flex flex-col">
				{registrationError && (
					<p className="inline-block self-center px-3 py-1 mb-4 bg-red-100 text-red-700 text-sm font-medium rounded-md border border-red-200 shadow-sm">
						{registrationError}
					</p>
				)}
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign Up</h1>
					<p className="text-sm text-gray-500 mb-6">Create an account to get started</p>
				</div>

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
						{errors.email && (
							<p className="text-red-500 text-[14px] mt-1">{errors.email.message}</p>
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

					<Button className="w-full" type="submit">
						{isSubmitting ? (
							<span className="">
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
					<Link href="/login" className="text-blue-600 hover:underline cursor-pointer">
						Log In
					</Link>
				</p>
			</main>
		</section>
	);
}
