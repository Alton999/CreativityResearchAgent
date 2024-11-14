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
            <CardContent className="space-y-2">
              <p>
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
              <div className="p-4 bg-yellow-200/20 border border-yellow-400 rounded-lg space-y-4">
                <p className="text-lg font-semibold">Privacy Policy</p>
                <p className="border-l-4 border-gray-800 pl-8">
                  The Designing with AI Lab at the University of Sydney has
                  developed this tool as part of research into AI and scientific
                  creativity. This system uses exa.ai and Claude, here are links
                  to their privacy policies: (
                  <a
                    className="underline text-blue-600"
                    href="https://exa.ai/privacy-policy"
                  >
                    Exa AI
                  </a>
                  ) (
                  <a
                    className="underline text-blue-600"
                    href="https://www.wordware.ai/privacy-policy#:~:text=Information%20We%20Collect,you%20interact%20with%20our%20platform."
                  >
                    Wordware
                  </a>
                  ) by using this system you should be aware that your data will
                  be shared with those services through their APIs as part of
                  generating your results. Unless you have explicitly signed a
                  consent form to participate in a university-approved research
                  study with this tool, then your data will not be shared with
                  anyone, not be used as part of research or commercial
                  activity, and will only be kept for improving this tool. If
                  you have signed a consent form to participate in a
                  university-approved research study, and are using this tool as
                  part of that study, that form will describe the additional
                  ways that your data may be used for research.
                </p>
              </div>
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
