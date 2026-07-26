import { Button } from "@tabletalk/shad-ui/components/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="">
      <section className="">
        <Button onClick={() => console.log("Hello")}>Link Google Calendar</Button>
        <p>Hello</p>
      </section>
    </main>
  );
}
