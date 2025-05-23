import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
    message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
    if(!message) return null;

    return (
        <div className="bg-emerald-600/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-600">
            <CheckCircledIcon className="size-4" />
            <p>{message}</p>
        </div>
    )
}
