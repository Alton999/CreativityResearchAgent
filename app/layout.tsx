import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import Providers from "@/components/Providers";

export const metadata: Metadata = {
	title: "Creative agent",
	description: "Revolutionize your research and creative process"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
				<Toaster />
			</body>
		</html>
	);
}
