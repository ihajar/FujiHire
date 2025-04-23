import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react"
import { Header } from "./header";
import { BackButton } from "./back-button";


interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    description: string;
    backButtonLabel: string;
    backButtonHref: string;
    showDisclaimer?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    description,
    backButtonLabel,
    backButtonHref,
    showDisclaimer = false,
}: CardWrapperProps) => {
  return (
    <Card className="max-w-lg w-full shadow-md">
        <CardHeader className="text-center">
            <CardTitle>
                <Header label={headerLabel} />
            </CardTitle>
            <CardDescription className="text-[#525252] text-lg max-w-sm mx-auto">{description}</CardDescription>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-y-4">
            <BackButton
                label={backButtonLabel}
                href={backButtonHref}
            />
            {showDisclaimer && (
                <p className="max-w-md mx-auto text-center text-sm text-[#525252]">
                    By clicking 'Sign up', you acknowledge that you have read and accepted the
                    <span className="text-primary"> Terms of Service</span>
                    and
                    <span className="text-primary">Privacy Policy</span>
                </p>
            )} 
        </CardFooter>
    </Card>
  )
}
