import api from "./axios";

export interface UserStats {
  solvedCount: number;
  totalProblems: number;
  attemptedCount: number;
  totalScore: number;
  rank: number;
}

export interface LeaderboardItem {
  username: string;
  initials: string;
  score: number;
  rank: number;
}

export interface ProblemItem {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  acRate: string;
  submissionCount: string;
}

export interface HomeSummary {
  userStats: UserStats;
  leaderboard: LeaderboardItem[];
  popularProblems: ProblemItem[];
  latestProblems: ProblemItem[];
}

export const getHomeSummary = async (): Promise<HomeSummary> => {
  const response = await api.get<HomeSummary>("/home/summary");
  return response.data;
};
