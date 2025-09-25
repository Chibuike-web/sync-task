import SWRProvider from "./swr-config";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<SWRProvider>{children}</SWRProvider>
		</>
	);
}
