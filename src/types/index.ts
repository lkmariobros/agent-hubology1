export type AgentRank = 'Advisor' | 'Sales Leader' | 'Team Leader' | 'Group Leader' | 'Supreme Leader';

export interface RankRequirement {
  rank: AgentRank;
  transactions: number;
  salesVolume: number;
  personalSales: boolean;
  recruitedAgents?: number;
  color?: string;
}
