import Markdown from "react-markdown";

export const TailwindMarkdown: React.FunctionComponent<{
  markdownStr: string;
}> = ({ markdownStr }) => {
  return (
    <Markdown
      className="prose dark:prose-invert prose-sm text-left"
      components={{
        // hr: () => <div className="divider text-sm my-10">Next section</div>,
        hr: () => (
          <div className="w-full flex justify-center relative my-10">
            <div className="bg-secondary w-full h-[1px] absolute top-[50%] left-0 -z-10"></div>
            <div className="text-sm px-5 bg-background">Next section</div>
          </div>
        ),
      }}
    >
      {markdownStr}
    </Markdown>
  );
};
