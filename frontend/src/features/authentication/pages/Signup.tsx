import { z } from "zod";
import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/formSchema";
import { useAuth } from "../contexts/AuthContextProvider";

import { CardWrapper } from "../components/card-wrapper";
import { Loader } from "@/components/loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "../components/form-error";
import { FormSuccess } from "../components/form-success";



export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  const [isPending] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const doSignup = async (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    const email = values.email;
    const password = values.password;

    try {
      await signup(email, password);
      setSuccess("User registered successfully. Please verify your email.");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occured");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center">
      {isLoading && (<Loader/>)}
      <CardWrapper
        headerLabel="Sign up to FujiHire"
        description="Join over 50,000 satisfied job seekers and companies who are already on FujiHire"
        backButtonHref="/login"
        backButtonLabel="Already have an account? Log in"
        showDisclaimer={true}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(doSignup)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="*******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Registering ..." : "Sign up"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
