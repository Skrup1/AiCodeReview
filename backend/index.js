import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import mongoose from 'mongoose';
import Review from './models/Review.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/review', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Не передан код для анализа' });
    }

    const prompt = `
      Ты выступаешь в роли эксперта по JavaScript/TypeScript. Проанализируй следующий код,
      определи возможные ошибки, слабые места и предложи рекомендации по улучшению:

      Код:
      ${code}
    `;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI code reviewer.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
    });

    const feedback = completion.data.choices[0].message.content;

    // Создаем новый документ ревью и сохраняем его в базе данных
    const newReview = new Review({ code, feedback });
    await newReview.save();

    return res.json({ feedback });
  } catch (error) {
    console.error('Ошибка на /api/review:', error);
    return res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});