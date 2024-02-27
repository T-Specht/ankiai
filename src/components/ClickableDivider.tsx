import { useRef } from "react";
import dayjs from "dayjs";
import { TailwindMarkdown } from "./TailwindMarkdown";

export const ClickableDivider = (props: {
    text: string;
    summary: string;
    timestamp: number;
}) => {
    const ref = useRef<HTMLDialogElement>(null);
    return (
        <>
            <div className="divider divider-neutral mb-20">
                <div
                    className="text-center cursor-pointer"
                    onClick={() => ref.current!.showModal()}
                >
                    <p>{props.text}</p>
                    <p className="text-xs opacity-30">Click for AI Summary</p>
                    <p className="text-xs opacity-30 mt-2">
                        {dayjs(props.timestamp).toDate().toLocaleString()}
                    </p>
                </div>
            </div>
            <dialog className="modal" ref={ref}>
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg">AI Summary</h3>
                    <div className="py-4">
                        <TailwindMarkdown markdownStr={props.summary}></TailwindMarkdown>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};
