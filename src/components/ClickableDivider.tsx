import dayjs from "dayjs";
import { SummaryDialog } from "./SummaryDialog";

export const ClickableDivider = (props: {
  text: string;
  summary: string;
  timestamp: number;
}) => {
  return (
    <div className="w-full flex justify-center relative">
      <div className="bg-secondary w-full h-[1px] absolute top-[50%] left-0 -z-10"></div>
      <SummaryDialog summary={props.summary}>
        <div className="bg-background px-5">
          <div className="text-center cursor-pointer">
            {/* <p>{props.text}</p>
            <p className="text-xs opacity-30">Click for AI Summary</p> */}
            <p className="text-xs opacity-30">
              {dayjs(props.timestamp).toDate().toLocaleString()}
            </p>
          </div>
        </div>
      </SummaryDialog>
    </div>
  );
};
