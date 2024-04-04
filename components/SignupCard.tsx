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
import { userInfoSchema } from "@/schemas/userInfo";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
type SignupCardProps = {
  setStep: (step: string) => void;
};
type Input = z.infer<typeof userInfoSchema>;

const SignupCard = ({ setStep }: SignupCardProps) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<Input>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      organisation: "",
      role: "",
    },
  });

  const { mutate: submitUserForm, status } = useMutation({
    mutationFn: async ({ name, email, organisation, role }: Input) => {
      console.log(name, email, organisation, role);
      const response = await axios.post("/api/userAccounts/createUser", {
        name,
        email,
        organisation,
        role,
      });
      return response.data;
    },
  });
  function onSignup(input: Input) {
    setError(null);
    submitUserForm(
      {
        name: input.name,
        email: input.email,
        organisation: input.organisation,
        role: input.role,
      },
      {
        onSuccess: ({ userId }) => {
          localStorage.setItem("userId", userId);
          router.push(`prompts`);
          console.log("Success", userId);
        },
        onError: (error: any) => {
          setError(error.response.data.error);
          console.log("Error", error);
        },
      },
    );
  }
  form.watch();

  return (
    <Card className="w-[800px]">
      <CardHeader className="space-y-2">
        <CardTitle>A little about you</CardTitle>
        <CardDescription className="text-lg">
          Before we begin can we know a little about you? This helps us refine
          our testing, data collection and improve our system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSignup)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is your full name?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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

            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What organisation or entity are you currently working for?
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your organisation..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What is your role within the organisation?
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your role..." {...field} />
                  </FormControl>
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
                  "Begin"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignupCard;
