import LoginClient from "./login-client";

export default function Login() {
	return (
		<main className="flex items-center justify-center h-screen bg-gray-50 px-4">
			<div className="w-full max-w-md flex flex-col bg-white shadow-md rounded-2xl p-8">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900 mb-2">Log in</h1>
					<p className="text-sm text-gray-500 mb-6">Log into your account</p>
				</div>
				<LoginClient />
			</div>
		</main>
	);
}
