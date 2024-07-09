"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { promptInputsSchema } from "@/schemas/promptInputs";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Input = z.infer<typeof promptInputsSchema>;

const PromptInputs = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<Input>({
    resolver: zodResolver(promptInputsSchema),
    defaultValues: {
      question: "",
      field: "",
    },
  });
  const { mutate: submitQuery } = useMutation({
    mutationFn: async ({ question, field }: Input) => {
      const response = await axios.post("/api/generate", {
        question,
        field,
      });
      return response.data;
    },
  });
  function query(input: Input) {
    setError(null);
    setStatus("pending");
    submitQuery(
      {
        question: input.question,
        field: input.field,
      },
      {
        onSuccess: ({ promptId }) => {
          router.push(`/prompts/${promptId}`);
          setStatus("Resolved");
        },
        onError: (error: any) => {
          setError(error.response.data.message);
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(query)} className="space-y-8">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your research question..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What are you planning to research? Help our agent by providing
                it detailed and specific research question.
              </FormDescription>
              <FormMessage>
                {form.formState.errors.question?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field</FormLabel>
              <FormControl>
                <Input placeholder="Enter the field of study..." {...field} />
              </FormControl>
              <FormDescription>
                Under what field of study does your research question fall?
              </FormDescription>
              <FormMessage>{form.formState.errors.field?.message}</FormMessage>
            </FormItem>
          )}
        />
        <div className="flex gap-16">
          <Button
            disabled={status === "pending"}
            className="w-full py-2"
            type="submit"
          >
            {status === "pending" ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PromptInputs;
