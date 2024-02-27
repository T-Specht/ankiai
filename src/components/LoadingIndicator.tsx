export function LoadingIndicator(props: { currentGenerations: number }) {
  return (
    <div className="text-primary flex my-10">
      <span className="loading loading-spinner mr-4"></span>
      <span>New cards are being generated... </span>
      {props.currentGenerations > 1 && (
        <span>({props.currentGenerations} jobs currently processing)</span>
      )}
    </div>
  );
}
