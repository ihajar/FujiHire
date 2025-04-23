import { useState } from "react";
import { CardWrapper } from "../components/card-wrapper";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { FormError } from "../components/form-error";
import { FormSuccess } from "../components/form-success";
import { Button } from "@/components/ui/button";


export default function VerifyEmail() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSucces] = useState<string | undefined>("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center">
      <CardWrapper
        headerLabel="Verify your email"
        description="Only one step left to complete your registration."
        backButtonHref="/signup"
        backButtonLabel="go back?"
      >
        <form
          className="flex flex-col space-y-6"
          onSubmit={() => {}}
        >
          <Input
            type="text"
            placeholder="Verification code"
            key="code" name="code"
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "...": "Validate email"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {}}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Send again"}
          </Button>
        </form>
      </CardWrapper>
    </div>
  )
}
