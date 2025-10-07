import SignInClient from "./sign-in-client";
import { Button } from "@/components/ui/button";
import GoogleIcon from "../icons/google-icon";
import GithubIcon from "../icons/github-icon";
import Link from "next/link";

export default function SignIn() {
	return (
		<main className="flex items-center justify-center h-screen bg-gray-50 px-4">
			<div className="shadow-xl rounded-2xl bg-foreground/1 w-full max-w-[450px]">
				<div className="w-full bg-white p-8 flex flex-col border-b border-foreground/10 rounded-t-2xl rounded-b-xl">
					<span className="tracking-[-0.02em] text-[18px] font-bold text-center">SyncTask</span>
					<div className="text-center">
						<h1 className="text-[20px] font-semibold text-gray-900 mb-1 mt-6">
							Sign in to SyncTask
						</h1>
						<p className="text-sm text-gray-500 mb-6">Welcome back! Please sign in to continue </p>
					</div>
					<div className="flex w-full gap-4">
						<Button variant="outline" className="flex-1 font-medium flex gap-2 items-center">
							<span>
								<GoogleIcon />
							</span>

							<span className="leading-0">Google</span>
						</Button>
						<Button variant="outline" className="flex-1 font-medium">
							<span>
								<GithubIcon />
							</span>
							<span className="leading-0">Github</span>
						</Button>
					</div>
					<div className="flex gap-4 items-center my-6">
						<span className="inline-block h-[1px] w-full bg-foreground/10" />
						<span>or</span>
						<span className="inline-block h-[1px] w-full bg-foreground/10" />
					</div>
					<SignInClient />
				</div>
				<div className="py-6">
					<p className="text-sm text-center text-gray-600">
						Don't have an account?{" "}
						<Link
							href="/sign-up"
							className="text-gray-700 font-medium hover:underline cursor-pointer "
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
