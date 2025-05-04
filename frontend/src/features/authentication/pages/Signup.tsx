import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/formSchema";
import { UserRole } from "@/types/user";
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
import { BriefcaseBusiness, Building2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const [isPending] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      role: undefined,
    },
  });
  useEffect(() => {
    if (selectedRole) {
      form.setValue("role", selectedRole);
    }
  }, [selectedRole, form])

  const doSignup = async (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    if(!selectedRole) {
      setError("Please select a role.");
      setIsLoading(false);
      return;
    }

    try {
      await signup(values.email, values.password, selectedRole);
      setSuccess("User registred successfully. Please verify your email");
      navigate("/verify-email");
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error instanceof Error ? error.message : "Registration failed. Please try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gray-50">
      {isLoading && (<Loader/>)}
      {!selectedRole ? (
        <CardWrapper
          headerLabel="Sign up to FujiHire"
          description="Join over 50,000 satisfied job seekers and companies who are already on FujiHire."
          backButtonHref="/login"
          backButtonLabel="Already have an account? Log in"
        >
          <div className="w-full flex flex-col items-center justify-center space-y-4">
            <RadioGroup 
              value={selectedRole}
              className="w-full space-y-4"
              onValueChange={(value) => {
                setSelectedRole(value as UserRole);
                setError("");
              }}
            >
              <Label
                className={`flex flex-row items-center p-4 justify-between w-full space-y-3 space-x-4 rounded-lg border-1 border-accent-foreground/15 hover:border-primary-500 hover:bg-primary/15 hover:border-primary/25 cursor-pointer transition-colors ${
                  selectedRole === UserRole.JOB_SEEKER ? 'border-primary-500 bg-primary/15' : ''
                }`}
                onClick={() => setSelectedRole(UserRole.JOB_SEEKER)}
              >
                <BriefcaseBusiness className="h-6 w-6" />
                <div className="flex flex-col space-y-2">
                  <h4 className="font-medium">I'm looking for a job</h4>
                  <p className="text-sm text-muted-foreground">Get matched with jobs for free.</p>
                </div>
                <RadioGroupItem value={UserRole.JOB_SEEKER} />
              </Label>
              <Label
                className={`flex flex-row items-center p-4 justify-between w-full space-y-3 space-x-4 rounded-lg border-1 border-accent-foreground/15 hover:border-primary-500 hover:bg-primary/15 hover:border-primary/25 cursor-pointer transition-colors ${
                  selectedRole === UserRole.EMPLOYER ? 'border-primary-500 bg-primary/15' : ''
                }`}
                onClick={() => setSelectedRole(UserRole.EMPLOYER)}
              >
                <Building2 className="h-6 w-6" />
                <div className="flex flex-col space-y-2">
                  <h4 className="font-medium">I'm hiring workers</h4>
                  <p className="text-sm text-muted-foreground">Connect with top talent.</p>
                </div>
                <RadioGroupItem value={UserRole.EMPLOYER} />
              </Label>
            </RadioGroup>
            <Button 
              type="button" 
              className="w-full mt-4" 
              onClick={() => {
                if (!selectedRole) {
                  setError("Please select a role!.");
                  return;
                }
              }}
              disabled={!selectedRole}
            >
              Continue
            </Button>
          </div>
        </CardWrapper>
      ) : (
        <CardWrapper
          headerLabel={selectedRole === UserRole.EMPLOYER 
            ? "Join hundreds of companies hiring on FujiHire"
            : "Start your job search journey with FujiHire"}
          description={selectedRole === UserRole.EMPLOYER
            ? "Get instant access to over 50,000 talent profiles and 400,000 active job seekers."
            : "Find your dream job with our AI-powered matching system."}
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
      )}
    </div>
  );
}
