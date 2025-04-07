import dotenv from 'dotenv';
dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import mongoose from 'mongoose';
import Review from './models/Review.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/review', async (req, res) => {
  console.log("Received POST /api/review with body:", req.body);
  try {
    const { code } = req.body;
    if (!code) {
      console.log("No code provided.");
      return res.status(400).json({ error: 'Не передан код для анализа' });
    }

    const prompt = `Ты выступаешь в роли эксперта по JavaScript/TypeScript. Проанализируй следующий код, определи возможные ошибки, слабые места и предложи рекомендации по улучшению:\n\nКод:\n${code}`;
    console.log("Generated prompt:", prompt);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI code reviewer.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
    });
    console.log("Received response from OpenAI.");
    
    const feedback = completion.data.choices[0].message.content;
    console.log("Feedback received:", feedback);

    const newReview = new Review({ code, feedback });
    await newReview.save();
    console.log("Review saved in database.");

    return res.json({ feedback });
  } catch (error) {
    console.error('Ошибка на /api/review:', error);
    if (error.response && error.response.status === 401) {
      const testFeedback = "Test response: OpenAI API call failed (401 Unauthorized).";
      console.log("Returning test feedback due to OpenAI error.");
      try {
        const newReview = new Review({ code: req.body.code, feedback: testFeedback });
        await newReview.save();
        console.log("Review with test feedback saved in database.");
      } catch (saveError) {
        console.error("Error saving review after OpenAI failure:", saveError);
      }
      return res.json({ feedback: testFeedback });
    }
    return res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
