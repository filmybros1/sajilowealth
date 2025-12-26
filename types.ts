
export type InvestmentFrequency = 'monthly' | 'quarterly' | 'yearly';

export interface SIPInputs {
  monthlyInvestment: number;
  expectedReturnRate: number;
  timePeriod: number;
  frequency: InvestmentFrequency;
}

export interface SIPResults {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
  growthData: GrowthPoint[];
  schedule: ScheduleEntry[];
}

export interface GrowthPoint {
  year: number;
  invested: number;
  returns: number;
  total: number;
}

export interface ScheduleEntry {
  period: number;
  label: string;
  investmentAmount: number;
  periodicReturn: number;
  cumulativeInvested: number;
  estimatedValue: number;
}

export interface AdvisorResponse {
  analysis: string;
  recommendation: string;
  milestones: string[];
}
