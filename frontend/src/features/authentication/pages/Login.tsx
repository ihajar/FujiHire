import { z } from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/formSchema";

import { CardWrapper } from "../components/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormError } from "../components/form-error";
import { FormSuccess } from "../components/form-success";


export default function Login() {

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const doLogin = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      console.log(values);
    })
  }
  return (
   <div className="flex w-full min-h-screen items-center justify-center">
    <CardWrapper
      headerLabel="Log in to FujiHire"
      description="Welcome back. Please enter your details."
      backButtonHref="/signup"
      backButtonLabel="Don't have an account? Sing up now"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(doLogin)} className="space-y-6">
          <div className="flex flex-col space-y-4">
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
                <Button
                  size={"sm"}
                  variant={"link"}
                  asChild
                  className="px-0 font-normal justify-start"
                >
                  <Link to="/request-password-reset">Forgotten password?</Link>
                </Button>
                <FormMessage/>
              </FormItem>
            )}
          />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Submitting..." : "Log in"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
   </div>
  )
}
