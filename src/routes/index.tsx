import { createFileRoute } from "@tanstack/react-router";
import { CardCreator } from "../components/CardCreator";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <CardCreator></CardCreator>;
}
