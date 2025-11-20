import { Button } from "@/components/ui/button";
import GoogleIcon from "../icons/google-icon";
import GithubIcon from "../icons/github-icon";
import Link from "next/link";
import SignUpClient from "./sign-up-client";

export default function SignUp() {
	return (
		<main className="grid place-items-center min-h-screen px-6 xl:px-0 bg-white">
			<div className="shadow-xl max-w-[500px] w-full bg-accent rounded-2xl overflow-hidden my-20 border-2 border-accent">
				<div className="w-full  p-8 md:p-10 bg-white rounded-xl ring-2 ring-accent">
					<span className="tracking-[-0.02em] text-[18px] font-bold text-center block">
						SyncTask
					</span>
					<div className="text-center">
						<h1 className="text-[20px] font-semibold text-gray-900 mb-1 mt-6">
							Create your account
						</h1>
						<p className="text-sm text-gray-500 mb-6">
							Welcome! Please fill in the details to get started
						</p>
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
						<span className="inline-block h-px w-full bg-foreground/10" />
						<span>or</span>
						<span className="inline-block h-px w-full bg-foreground/10" />
					</div>
					<SignUpClient />
				</div>

				<div className="py-6">
					<p className="text-sm text-center text-gray-600">
						Already have an account?{" "}
						<Link
							href="/sign-in"
							className="text-gray-700 font-medium hover:underline cursor-pointer "
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</main>
	);
}
