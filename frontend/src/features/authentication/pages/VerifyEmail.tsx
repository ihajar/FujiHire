import { z } from "zod";
import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { CardWrapper } from "../components/card-wrapper";
import { Input } from "@/components/ui/input";
import { FormError } from "../components/form-error";
import { FormSuccess } from "../components/form-success";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { EmailValidationSchema } from "@/schemas/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "../contexts/AuthContextProvider";
import { request } from "@/utils/api";
import { Loader } from "@/components/loader";

export default function VerifyEmail() {
  const { user, setUser } = useAuth();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSucces] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  const [isPending] = useTransition();
  
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof EmailValidationSchema>>({
    resolver: zodResolver(EmailValidationSchema),
    defaultValues: {
      code: "",
    },
  });

  const validateEmail = async({ code }: z.infer<typeof EmailValidationSchema>) => {
      setError("");
      setSucces("");
      setIsLoading(true);
      
      await request<void>({
        endpoint: `/api/v1/auth/validate-email-verification-token?token=${code}`,
        method: "PUT",
        onSuccess: () => {
          setUser({ ...user!, emailVerified: true });
          setSucces("User's email verified successfully.");
          navigate("/");
        },
        onFailure: (error) => {
          setError(error);
        },
      });
      setIsLoading(false);
  };

  const resendEMailverificationToken = async() => {
    setError("");
    setSucces("");
    setIsLoading(true);

    await request<void>({
      endpoint: `/api/v1/auth/send-email-verification-token`,
      onSuccess: () => {
        setSucces("Code sent successfully. Please check your email.");
      },
      onFailure: (error) => {
        setError(error);
      },
    });
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center">
      {isLoading && (<Loader/>)}
      <CardWrapper
        headerLabel="Verify your email"
        description="Only one step left to complete your registration."
        backButtonHref="/signup"
        backButtonLabel="go back?"
      >
        <Form {...form}>
          <form
            className="flex flex-col space-y-6"
            onSubmit={form.handleSubmit(validateEmail)}
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Verification code"
                      key="code"
                      name="code"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Validating..." : "Validate email"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => resendEMailverificationToken()}
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send again"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
