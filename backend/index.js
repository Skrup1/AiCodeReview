import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express(); // Создаем экземпляр express
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;

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
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    const feedback = completion.data.choices[0].message.content;
    return res.json({ feedback });
  } catch (error) {
    console.error('Ошибка на /api/review:', error);
    return res.status(500).json({ error: 'Что-то пошло не так' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

