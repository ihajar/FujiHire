import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardWrapper } from "../components/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "../components/form-error";
import { FormSuccess } from "../components/form-success";
import { request } from "@/utils/api";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ResetPassword() {
  const navigate = useNavigate();
  usePageTitle("Reset Password");

  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSucces] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  const sendPasswordResetToken = async (email: string) => {
    setIsLoading(true);
    setError("");
    setSucces("");

    await request<void>({
      endpoint: `/api/v1/auth/send-password-reset-token?email=${email}`,
      method: "PUT",
      onSuccess: () => {
        setSucces("Email sent successfully.");
        setEmailSent(true);
        setEmail(email);
      },
      onFailure: (error) => {
        setError(error);
      },
    });
    setIsLoading(false);
  };

  const resetPassword = async (
    email: string,
    code: string,
    password: string
  ) => {
    setError("");
    setSucces("");
    setIsLoading(true);

    await request<void>({
      endpoint: `/api/v1/auth/reset-password?email=${email}&token=${code}&newPassword=${password}`,
      method: "PUT",
      onSuccess: () => {
        setSucces("Password reset successfully.");
        navigate("/login");
      },
      onFailure: (error) => {
        setError(error);
      },
    });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center">
      <CardWrapper
        headerLabel="Forgot password?"
        description="Enter your email to change your password."
        backButtonHref="/login"
        backButtonLabel="Back to login page"
      >
        {!emailSent ? (
          <form
            className="flex flex-col space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const email = e.currentTarget.email.value;
              await sendPasswordResetToken(email);
              setEmail(email);
            }}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              key="email"
              name="email"
              disabled={isLoading || emailSent}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? "Processing..." : "Next"}
            </Button>
          </form>
        ) : (
          <form
            className="flex flex-col space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const code = e.currentTarget.code.value;
              const password = e.currentTarget.password.value;
              await resetPassword(email, code, password);
            }}
          >
            <Input
              type="text"
              placeholder="Enter new code"
              key="code"
              name="code"
              disabled={isLoading}
            />
            <Input 
              disabled={isLoading} 
              placeholder="*******" 
              type="password"
              key="password"
              name="password"
            />

            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Reseting password..." : "Reset password"}
            </Button>
          </form>
        )}
      </CardWrapper>
    </div>
  );
}
