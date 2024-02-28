import { Loader } from "./Loader";

export function LoadingIndicator(props: { currentGenerations: number }) {
  return (
    <div className="text-primary flex mb-10">
      <Loader
        text={`New cards are being generated... ${props.currentGenerations > 1 ? `(${props.currentGenerations} jobs currently processing)` : ""}`}
      ></Loader>
    </div>
  );
}
