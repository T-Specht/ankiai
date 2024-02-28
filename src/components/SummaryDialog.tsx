import { TailwindMarkdown } from "./TailwindMarkdown";
import {
    Dialog,
    DialogContent, DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";


export const SummaryDialog = (props: {
    summary: string;
    children: React.ReactNode;
}) => {
    return (
        <Dialog>
            <DialogTrigger>{props.children}</DialogTrigger>
            <DialogOverlay className="opacity-40"></DialogOverlay>
            <DialogContent className="max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>AI Summary</DialogTitle>
                    <ScrollArea className="max-h-72">
                        <TailwindMarkdown markdownStr={props.summary}></TailwindMarkdown>
                    </ScrollArea>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
