"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import SignupCard from "@/components/SignupCard";
import LoginCard from "./LoginCard";

const Welcome = () => {
  const [currStep, setCurrStep] = useState<string>("INTRO");

  const setStep = (step: string) => {
    setCurrStep(step);
  };

  const renderSteps = () => {
    switch (currStep) {
      // Introduction
      case "INTRO":
        return (
          <Card className="w-[800px]">
            <CardHeader className="space-y-2">
              <CardTitle> Welcome to creative agent V2</CardTitle>
              <CardDescription className="text-lg">
                We are excited to launch version 2 of this beta, this new
                version introduces human in the loop hypotheiss generation and
                evaluation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="border-l-4 border-gray-800 pl-8">
                This is an early exploration of how an AI agent might be helpful
                in human-AI collaborative hypothesis generation and scientific
                creativity. At the moment you can ask it a research question and
                it will generate, evaluate, and refine a set of hypotheses for
                you. We currently have it spitting all that information out so
                you can read through it&apos;s process, but eventually we want
                to clean up the output and show you just the best bits. If you
                have fun playing with this, or if it doesn&apos;t work quite how
                you&apos;d expect, please feel free to get in touch at
                aong3299@uni.sydney.edu.au, we&apos;d love to hear your
                thoughts!
              </p>
            </CardContent>
            <CardFooter>
              <section className="space-y-8">
                <Separator className="my-8" />
                <p className="font-semibold">
                  Is this your first time here? If yes, please create a new
                  account. If not please login with your email.
                </p>
                <div className="flex gap-8">
                  <Button
                    className="w-full py-2"
                    variant="secondary"
                    onClick={setStep.bind(null, "LOGIN")}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full py-2"
                    onClick={setStep.bind(null, "SIGNUP")}
                  >
                    Create new account
                  </Button>
                </div>
              </section>
            </CardFooter>
          </Card>
        );
      // Details
      case "SIGNUP":
        return <SignupCard setStep={setStep} />;
      case "LOGIN":
        return <LoginCard setStep={setStep} />;
      default:
        return <div> Something went wrong </div>;
    }
  };
  return <>{renderSteps()}</>;
};

export default Welcome;
