import React, { useState } from 'react';

const CodeReviewForm: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch('http://localhost:5003/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка сервера');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>AI Code Reviewer</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="codeInput">Ваш код:</label>
        <textarea
          id="codeInput"
          style={{ width: '100%', height: 200 }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? 'Проверяем...' : 'Отправить'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      {feedback && (
        <div style={{ marginTop: 20 }}>
          <h3>Результат проверки:</h3>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeReviewForm;
