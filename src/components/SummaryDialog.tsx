import { TailwindMarkdown } from "./TailwindMarkdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useCopyToClipboard } from "usehooks-ts";

export const SummaryDialog = (props: {
  summary: string;
  children: React.ReactNode;
}) => {
  const [_, copyToClipboard] = useCopyToClipboard();

  return (
    <Dialog>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogOverlay className="opacity-40"></DialogOverlay>
      <DialogContent className="max-w-[750px]">
        <DialogHeader>
          <DialogTitle className="flex">
            AI Summary
            <Button
              size="xs"
              className="ml-auto mr-5"
              variant="ghost"
              autoFocus={false}
              onClick={() => copyToClipboard(props.summary)}
            >
              Copy to clipboard
            </Button>
          </DialogTitle>
          <ScrollArea className="max-h-72">
            <TailwindMarkdown markdownStr={props.summary}></TailwindMarkdown>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
