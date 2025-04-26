import { useEffect } from "react"

export const usePageTitle = (title: string) => {
    useEffect(() => {
        document.title = "FujiHire | " + title;
    }, [title]);
};