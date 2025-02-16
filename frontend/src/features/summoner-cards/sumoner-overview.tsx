import React, { useEffect, useState } from "react";
import { Card, Avatar, Typography, Spin, Tooltip } from "antd";
import Meta from "antd/es/card/Meta";
import { getSummonerStats } from "../../libs/apis/league-api";
import { Summoner } from "../../libs/league/league-types";

interface SummonerStats {
  tier: string;
  rank: string;
  wins: number;
  losses: number;
  winRate: string;
}

interface SummonerOverviewProps {
  summoner: Summoner;
}

const SummonerStatBlock: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <Tooltip title={label}>
    <div className="flex flex-col items-center justify-center">
      <Typography.Text strong style={{ fontSize: 16 }}>
        {value}
      </Typography.Text>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        {label}
      </Typography.Text>
    </div>
  </Tooltip>
);

export const SummonerOverview: React.FC<SummonerOverviewProps> = ({
  summoner,
}) => {
  const [summonerStats, setSummonerStats] = useState<SummonerStats | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchStats = async () => {
      try {
        const stats = await getSummonerStats("NA", summoner.puuid);
        console.log("stats: ", stats, summoner);

        const wins = stats?.ranked?.wins || 0;
        const losses = stats?.ranked?.losses || 0;
        const winRateCalc = wins + losses > 0 ? wins / (wins + losses) : 0;
        const winRate = winRateCalc
          ? (winRateCalc * 100).toFixed(2) + "%"
          : "N/A";
        const tierRaw = stats?.ranked?.tier;
        const formattedTier = tierRaw
          ? tierRaw.charAt(0).toUpperCase() + tierRaw.slice(1).toLowerCase()
          : "N/A";

        if (isMounted) {
          setSummonerStats({
            tier: formattedTier,
            rank: stats?.ranked?.rank,
            wins,
            losses,
            winRate,
          });
        }
      } catch (error) {
        console.error("Failed to fetch summoner stats:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [summoner]);

  const tierLabel = summonerStats
    ? `${summonerStats.tier} ${summonerStats.rank}`
    : "";

  return (
    <div className="flex gap-5">
      <Card
        style={{ width: 300, height: "100%" }}
        cover={
          <img
            alt="Champion Splash"
            src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${summoner.championImageId}_0.jpg`}
          />
        }
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            {summoner.riotId.split("#")[0]}
            <span style={{ color: "gray", fontStyle: "italic", marginLeft: 4 }}>
              #{summoner.riotId.split("#")[1]}
            </span>
          </Typography.Title>
        }
      >
        <Spin spinning={isLoading}>
          <Meta
            avatar={
              <Avatar
                size={80}
                src={`/images/ranks/RANK=${summonerStats?.tier}.png`}
              />
            }
            title={
              <Typography.Title level={4} style={{ margin: 0 }}>
                {tierLabel}
              </Typography.Title>
            }
            description={
              summonerStats ? (
                <div className="flex justify-between mt-2">
                  <SummonerStatBlock
                    label="Wins"
                    value={summonerStats.wins.toString()}
                  />
                  <SummonerStatBlock
                    label="Losses"
                    value={summonerStats.losses.toString()}
                  />
                  <SummonerStatBlock
                    label="Win Rate"
                    value={summonerStats.winRate}
                  />
                </div>
              ) : (
                "Fetching stats..."
              )
            }
          />
        </Spin>
      </Card>
    </div>
  );
};
