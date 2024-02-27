import Markdown from "react-markdown";

export const TailwindMarkdown: React.FunctionComponent<{
  markdownStr: string;
}> = ({ markdownStr }) => {
  return (
    <Markdown
      components={{
        ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
        hr: () => <div className="divider text-sm my-10">Next section</div>,
      }}
    >
      {markdownStr}
    </Markdown>
  );
};
