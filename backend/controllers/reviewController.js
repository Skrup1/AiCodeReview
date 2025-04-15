import { Configuration, OpenAIApi } from 'openai';
import Review from '../models/Review.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function analyzeCode(req, res) {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No code provided for analysis' });
    }

    const prompt = `You are an expert in JavaScript/TypeScript... Code:\n${code}`;
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI code reviewer.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
    });

    const feedback = completion.data.choices[0].message.content;
    const newReview = new Review({ code, feedback });
    await newReview.save();

    return res.json({ feedback });
  } catch (error) {
    console.error('Error in analyzeCode:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
