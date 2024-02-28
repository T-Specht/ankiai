import { AICard } from "../utils/card_chain";
import { useCardsStore, useSettingsStore } from "./AppZustand";
import { CardDisplay } from "./CardDisplay";
import { ClickableDivider } from "./ClickableDivider";
import { KbdShortcut } from "./KbdShortcut";

export function CardsList() {
  const cards = useCardsStore.use.cards();
  const generateHotkey = useSettingsStore.use.generateHotkey();

  const groupCardsByTimestamp = (cards: AICard[]) => {
    return cards.reduce<{ timestamp: number; cards: AICard[] }[]>((g, c) => {
      const o = g.find((e) => e.timestamp == c.timestamp);
      if (o) {
        o.cards.push(c);
      } else {
        g.push({
          timestamp: c.timestamp,
          cards: [c],
        });
      }

      return g;
    }, []);
  };

  return (
    <div className="">
      {cards.length == 0 && (
        <p>
          Press <KbdShortcut keys={generateHotkey} /> to generate new cards from
          text in your clipboard.
        </p>
      )}
      {groupCardsByTimestamp(cards)
        .toReversed()
        .map((pack, packIndex) => {
          const summary = [...new Set(pack.cards.map((c) => c.facts))].join(
            "\n ----- \n"
          );

          return (
            <div key={packIndex}>
              <ClickableDivider
                timestamp={pack.timestamp}
                summary={summary}
                text={pack.cards[0].deck}
              ></ClickableDivider>
              {/* <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"> */}
              <div className="my-4">
                {pack.cards.map((c) => (
                  <CardDisplay
                    card={c}
                    key={c.uuid}
                    summary={summary}
                  ></CardDisplay>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
