import { Game, Summoner } from "./league-types";



export const getChampionIconSrc = (championName: string) => {
  return `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${championName}.png`;
}

export const getSummonerSpellIconSrc = (summonerSpellName: string) => {
  console.log(summonerSpellName);
  return `https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${summonerSpellName}.png`
}

export const getTeams = (game: Game) => {
  const searchedSummonerPuuid = game.searchedSummoner.puuid;
  const searchedSummoner = game.participants.find(p => p.puuid === searchedSummonerPuuid) as Summoner;
  const allies = [searchedSummoner, ...game.participants.filter(p => p.teamId === searchedSummoner?.teamId && p.puuid !== searchedSummonerPuuid)] || [];
  const enemies = game.participants.filter(p => !allies.includes(p));

  return { allies, enemies };
};