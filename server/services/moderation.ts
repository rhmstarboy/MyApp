import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim(),
});

export interface ModerationResult {
  status: 'approved' | 'flagged' | 'rejected';
  flags: string[];
}

export async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    // Validate API key format
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey?.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format');
      return { 
        status: 'flagged', 
        flags: ['invalid_api_key'] 
      };
    }

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
    // Log detailed error information
    console.error('OpenAI Moderation API error:', {
      error: error instanceof Error ? error.message : String(error),
      status: error?.status,
      type: error?.type,
      code: error?.code
    });

    // For API errors, flag for manual review
    return { 
      status: 'flagged', 
      flags: ['api_error'] 
    };
  }
}