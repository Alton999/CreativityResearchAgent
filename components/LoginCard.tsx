import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userLoginSchema } from "@/schemas/userInfo";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type LoginCardProps = {
  setStep: (step: string) => void;
};
type Input = z.infer<typeof userLoginSchema>;

const LoginCard = ({ setStep }: LoginCardProps) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // const cookieStore = cookies();

  const form = useForm<Input>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutate: submitLogin, status } = useMutation({
    mutationFn: async ({ email }: Input) => {
      const response = await axios.post("/api/userAccounts/login", {
        email,
      });
      return response.data;
    },
  });
  function onLogin(input: Input) {
    setError(null);
    submitLogin(
      {
        email: input.email,
      },
      {
        onSuccess: ({ userId }) => {
          const userIdFromStorage = localStorage.getItem("userId");
          if (!userIdFromStorage) {
            console.log("User id not found, adding to local storage");
            localStorage.setItem("userId", userId);
          }
          router.push(`prompts`);
          console.log("User id from login:", userId);
        },
        onError: (error: any) => {
          setError(error.response.data.error);
          console.log("Error", error);
        },
      },
    );
  }
  return (
    <Card className="w-[800px]">
      <CardHeader className="space-y-2">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription className="text-lg">
          Great to have you back to our beta, please use your email to sign in
          to your previous session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onLogin)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your email?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email..." {...field} />
                  </FormControl>
                  {error && (
                    <FormMessage className="text-red-500">{error}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <div className="flex gap-16">
              <Button
                className="w-1/2 py-2"
                variant="secondary"
                onClick={() => setStep("INTRO")}
              >
                Back
              </Button>
              <Button
                disabled={status === "pending"}
                className="w-full py-2"
                type="submit"
              >
                {status === "pending" ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
