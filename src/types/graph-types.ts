export interface ContributionDay {
  date: string;
  contributionCount: number;
  color?: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions?: number;
  weeks: ContributionWeek[];
  since?: Date;
}
