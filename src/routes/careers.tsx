import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "./index";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
});

function CareersPage() {
  useEffect(() => {
    document.getElementById("careers")?.scrollIntoView({ block: "start" });
  }, []);

  return <HomePage />;
}
