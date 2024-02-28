import { AICard } from "../utils/card_chain";
import { ClickableDivider } from "./ClickableDivider";
import { CardDisplay } from "./CardDisplay";
import { KbdShortcut } from "./KbdShortcut";
import { useCardsStore } from "./AppZustand";

export function CardsList() {
  const cards = useCardsStore.use.cards();

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
        <p >
          Press <KbdShortcut /> to generate new cards from text in your
          clipboard.
        </p>
      )}
      {groupCardsByTimestamp(cards)
        .toReversed()
        .map((pack, packIndex) => (
          <div key={packIndex}>
            <ClickableDivider
              timestamp={pack.timestamp}
              summary={[...new Set(pack.cards.map((c) => c.facts))].join(
                "\n ----- \n"
              )}
              text={pack.cards[0].deck}
            ></ClickableDivider>
            <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pack.cards.map((c) => (
                <CardDisplay card={c} key={c.uuid}></CardDisplay>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
