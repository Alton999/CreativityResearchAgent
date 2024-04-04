// Page used for redirection to the correct page
import PromptInputs from "@/components/PromptInputs";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import RedirectModal from "@/components/redirectModal";
import { Button } from "@/components/ui/button";

const Prompts = async () => {
	const cookieStore = cookies();
	let userId = cookieStore.get("userId")?.value;

	if (!userId) {
		userId = "";
	}
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});
	console.log(user);
	if (user) {
		return (
			<section className="mt-24 flex flex-col items-center justify-center">
				<Card className="w-[800px]">
					<CardHeader className="space-y-2">
						<CardTitle>Welcome to creative agents, {user?.name}</CardTitle>
						<CardDescription className="text-lg">
							We are excited to have you on board. Let&apos;s get you started
							with your first project.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<PromptInputs />
						{/* <PromptResults /> */}
					</CardContent>
				</Card>
			</section>
		);
	} else {
		return (
			<section className="mt-24 flex flex-col items-center justify-center">
				<RedirectModal />
			</section>
		);
	}
};

export default Prompts;
