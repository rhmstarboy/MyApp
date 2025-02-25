import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ModerationResult {
  status: 'approved' | 'flagged' | 'rejected';
  flags: string[];
}

export async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    const response = await openai.moderations.create({ input: content });
    const result = response.results[0];

    if (!result.flagged) {
      return { status: 'approved', flags: [] };
    }

    // Get the categories that were flagged
    const flags = Object.entries(result.categories)
      .filter(([_, flagged]) => flagged)
      .map(([category]) => category);

    // Determine status based on categories and scores
    const status = result.category_scores.hate > 0.8 || 
                  result.category_scores.violence > 0.8 || 
                  result.category_scores['self-harm'] > 0.8 
                  ? 'rejected' 
                  : 'flagged';

    return { status, flags };
  } catch (error) {
    console.error('Moderation API error:', error);
    // If the API fails, we'll flag the content for manual review
    return { 
      status: 'flagged', 
      flags: ['api_error'] 
    };
  }
}
