import React, { useEffect, useState } from "react";
import { SummonerOverview } from "../summoner-cards/sumoner-overview";
import { MatchHistory } from "../match-history/match-history";
import { Game, Summoner } from "../../libs/league/league-types";
import ChatComponent from "../chat/chat";
import { useParams } from "react-router-dom";
import { getActiveGame, getSummoner } from "../../libs/apis/league-api";

interface PlayerViewProps {
  summoners?: Summoner[];
  playerPuuid?: string;
  game?: Game;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  playerPuuid,
  game,
}) => {
  const { tagLine, gameName } = useParams();
  const [player, setPlayer] = useState(
    game?.participants?.find((summoner) => summoner.puuid === playerPuuid)
  );

  useEffect(() => {
    let ignore = false;
    if (!game) {
      getSummoner(gameName as string, tagLine as string).then((summoner) => {
        setPlayer(summoner);
      });
      return () => {
        ignore = true;
      };
    }
  }, [gameName, tagLine]);

  return (
    <>
      {player && <SummonerOverview summoner={player} />}
      <div className="flex w-full">
        {" "}
        {/* Increased space here */}
        <div className="w-1/3 min-w-[300px]">
          {player && <MatchHistory summoner={player} />}
        </div>
        <div
          className="w-2/3 min-w-[300px]"
          style={{ height: `calc(70vh - 79px)` }}
        >
          {<ChatComponent game={game || null} height={"65vh"} />}
        </div>
      </div>
    </>
  );
};
