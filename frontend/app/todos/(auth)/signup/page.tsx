import SignupClient from "./signup-client";

export default function Signup() {
	return (
		<main className="flex items-center justify-center h-screen bg-gray-50 px-4">
			<div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 flex flex-col">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign Up</h1>
					<p className="text-sm text-gray-500 mb-6">Create an account to get started</p>
				</div>
				<SignupClient />
			</div>
		</main>
	);
}
