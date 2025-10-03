import SWRProvider from "./swrConfig";

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
