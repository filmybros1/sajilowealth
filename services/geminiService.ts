
import { GoogleGenAI } from "@google/genai";
import { SIPInputs, SIPResults } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (inputs: SIPInputs, results: SIPResults): Promise<string> => {
  const prompt = `
    Act as a senior wealth manager and financial advisor specializing in the Nepalese financial market.
    User's SIP Goal Profile in Nepal:
    - Investment Frequency: ${inputs.frequency}
    - Installment Amount: रू ${inputs.monthlyInvestment.toLocaleString()}
    - Duration: ${inputs.timePeriod} years
    - Expected Annual Return: ${inputs.expectedReturnRate}%
    - Projected Final Wealth: रू ${results.totalValue.toLocaleString()}
    - Total Invested: रू ${results.totalInvested.toLocaleString()}
    - Net Profit: रू ${results.estimatedReturns.toLocaleString()}

    Provide a concise, professional analysis for a Nepalese investor. Include:
    1. A strategic evaluation considering NEPSE (Nepal Stock Exchange) volatility and typical mutual fund performance in Nepal.
    2. Specific advice on managing inflation in Nepal (mention NRB context if relevant).
    3. Milestone projections (e.g., buying property in Kathmandu, retirement planning).
    Keep the tone expert, localized, and encouraging. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "हामी अहिले सल्लाह प्रदान गर्न असमर्थ छौं। कृपया पछि प्रयास गर्नुहोस्।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI advisor is currently unavailable. Please check your network connection.";
  }
};
