import { useState, useTransition } from "react";
import { CardWrapper } from "../components/card-wrapper";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "../components/form-error";
import { FormSuccess } from "../components/form-success";



export default function ResetPassword() {
  const navigate = useNavigate();

  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSucces] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);

  const sendPasswordResetToken = async(email: string) => {
    setIsLoading(false);
    setError("");
    setSucces("");
  }
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
            onSubmit={async(e) => {
              e.preventDefault();
              setIsLoading(true);
              const email = e.currentTarget.email.value;
              await sendPasswordResetToken(email);
              setEmail(email);
              setIsLoading(false);
            }}
          >
            <Input
              key="email"
              type="email"
              placeholder="Email"
              name="email"
            />
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              Next
            </Button>
          </form>
        ) : (
          <form
            className="flex flex-col space-y-6"
            onSubmit={async(e) => {
              e.preventDefault();
              setIsLoading(true);
              const code = e.currentTarget.code.value;
              const password = e.currentTarget.password.value;
              await sendPasswordResetToken(email);
              setIsLoading(false);
            }}
          >
            <p>Enter the verification code we sent to your email and your new password.</p>
            <Input
              type="password"
              name="password"
              placeholder="New Password"
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
  )
}
