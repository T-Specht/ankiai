import { createFileRoute } from "@tanstack/react-router";
import { KbdShortcut } from "../../components/KbdShortcut";
import { useSettingsStore } from "../../components/AppZustand";

export const Route = createFileRoute("/_with_navbar/about")({
  component: About,
});

function About() {
  const generateHotkey = useSettingsStore.use.generateHotkey();

  return (
    <div className="prose mx-auto text-foreground prose-headings:text-foreground">
      <div className="grid grid-cols-2 items-center md:gap-6 md:grid-cols-3">
        <div className="col-span-2">
          <h1>Welcome to AnkiAI 🤖</h1>

          <p>
            AnkiAI was build to use AI for Anki card creation while still
            maintaing a user controlled workflow.
            <br />
            This means that while cards will be created by AI initially, you can
            still edit and editor them before adding to Anki.
          </p>
        </div>
        <div>
          <img src="ai.gif" alt="" className="max-w-52 rounded shadow-md" />
        </div>
      </div>

      <p>
        With AnkiAI, the process begins with AI-generated card suggestions,
        offering a streamlined starting point for your study regimen. However,
        what truly sets it apart is the flexibility it affords users.
        <br />
        Even though cards are initially crafted by AI, you retain the ability to
        tailor and refine them to better suit your learning style and
        preferences before seamlessly integrating them into your Anki decks.
        This blend of automation and customization not only saves time but also
        ensures that your study materials are precisely tailored to your needs.
        <br />
        <br />
        It's like having a knowledgeable study partner who provides insightful
        suggestions, but ultimately leaves the final decision-making in your
        hands. So whether you're studying for exams, learning a new language, or
        mastering complex concepts, AnkiAI empowers you to make the most out of
        your study sessions with confidence and efficiency.
      </p>

      <h3>Usage</h3>
      <ol>
        <li>
          Copy the text you want to create Anki cards about into your clipboard
        </li>
        <li>
          Press <KbdShortcut keys={generateHotkey} />
        </li>
        <li>AnkiAI will generate cards</li>
        <li>Edit the cards</li>
        <li>Add the cards to Anki</li>
      </ol>

      <div className="mt-6 opacity-80">
        © Tim Specht {new Date().getFullYear()}
      </div>
    </div>
  );
}
