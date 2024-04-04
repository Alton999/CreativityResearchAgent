// Page used for redirection to the correct page
import PromptInputs from "@/components/PromptInputs";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Prompts = async () => {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log(user);
  return (
    <section className="mt-24 flex flex-col items-center justify-center">
      <Card className="w-[800px]">
        <CardHeader className="space-y-2">
          <CardTitle>Welcome to creative agents, {user?.name}</CardTitle>
          <CardDescription className="text-lg">
            We are excited to have you on board. Let&apos;s get you started with
            your first project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PromptInputs />
          {/* <PromptResults /> */}
        </CardContent>
      </Card>
    </section>
  );
};

export default Prompts;
