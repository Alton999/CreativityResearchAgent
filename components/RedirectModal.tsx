"use client";
import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Props = {};

const RedirectModal = (props: Props) => {
	const router = useRouter();
	return (
		<Card className="w-[800px]">
			<CardHeader className="space-y-2">
				<CardTitle>Seems like you are not logged in.</CardTitle>
			</CardHeader>
			<CardContent>
				<div>
					<p>Please login or sign up to continue.</p>
				</div>
				{/* <PromptResults /> */}
			</CardContent>
			<CardFooter>
				<Button onClick={() => router.push("/")}>Back</Button>
			</CardFooter>
		</Card>
	);
};

export default RedirectModal;
