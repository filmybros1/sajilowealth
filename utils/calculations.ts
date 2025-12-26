
import { SIPInputs, SIPResults, GrowthPoint, ScheduleEntry, InvestmentFrequency } from '../types';

const getFrequencyMultiplier = (freq: InvestmentFrequency) => {
  switch (freq) {
    case 'quarterly': return 4;
    case 'yearly': return 1;
    default: return 12;
  }
};

export const calculateSIP = (inputs: SIPInputs): SIPResults => {
  const { monthlyInvestment, expectedReturnRate, timePeriod, frequency } = inputs;
  
  const periodsPerYear = getFrequencyMultiplier(frequency);
  const totalPeriods = timePeriod * periodsPerYear;
  const ratePerPeriod = expectedReturnRate / 100 / 12; 
  const monthsPerPeriod = 12 / periodsPerYear;
  
  let totalInvested = 0;
  let totalValue = 0;
  const currentInvestment = monthlyInvestment;
  const growthData: GrowthPoint[] = [];
  const schedule: ScheduleEntry[] = [];

  for (let p = 1; p <= totalPeriods; p++) {
    const previousValue = totalValue;
    totalInvested += currentInvestment;
    
    // Each period consists of monthsPerPeriod months of growth
    for (let m = 0; m < monthsPerPeriod; m++) {
      totalValue = (totalValue + (m === 0 ? currentInvestment : 0)) * (1 + ratePerPeriod);
    }
    
    const periodicReturn = Math.round(totalValue - (previousValue + currentInvestment));

    if (p % periodsPerYear === 0 || p === totalPeriods) {
      const year = Math.ceil(p / periodsPerYear);
      growthData.push({
        year,
        invested: Math.round(totalInvested),
        returns: Math.round(totalValue - totalInvested),
        total: Math.round(totalValue)
      });
    }

    schedule.push({
      period: p,
      label: `${frequency === 'monthly' ? 'Month' : frequency === 'quarterly' ? 'Quarter' : 'Year'} ${p}`,
      investmentAmount: Math.round(currentInvestment),
      periodicReturn: periodicReturn,
      cumulativeInvested: Math.round(totalInvested),
      estimatedValue: Math.round(totalValue)
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(totalValue - totalInvested),
    totalValue: Math.round(totalValue),
    growthData: [{ year: 0, invested: 0, returns: 0, total: 0 }, ...growthData],
    schedule: schedule // No slice here so PDF can show all data
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(value).replace('NPR', 'रू');
};
