'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function translateToEnglish(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `Translate the following text to English for use as a filename. Follow these strict rules:
1. Only use lowercase letters (a-z) and underscores (_)
2. Replace all spaces with underscores
3. Remove any punctuation, special characters, or symbols
4. If the text is already in English, still apply the formatting rules above

Return ONLY the formatted filename, nothing else.

Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('번역 중 오류가 발생했습니다.');
  }
}
