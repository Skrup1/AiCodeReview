import React, { useState } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import './CodeReviewForm.css';

const CodeReviewForm: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Please enter some code for analysis.');
      return;
    }
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
        throw new Error(data.error || 'Server error');
      }
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2f1 0%, #ffffff 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{ color: '#388e3c', mb: 4, fontWeight: 'bold' }}
        >
          AI Code Reviewer
        </Typography>
        {/* Flex container to mimic two columns */}
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Left column: input area */}
          <Box sx={{ flex: '1 1 300px', maxWidth: '600px' }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#2e7d32' }}>
                Enter your code:
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    flex: 1,
                    border: '1px solid #c8e6c9',
                    borderRadius: 50,
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <CodeMirror
                    value={code}
                    height="40px"
                    extensions={[javascript()]}
                    onChange={(value) => setCode(value)}
                    placeholder="function test() { return true; }"
                    basicSetup={{
                      lineNumbers: false,
                      highlightActiveLine: false,
                      foldGutter: false,
                    }}
                    style={{ fontSize: '14px' }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={loading}
                  sx={{ borderRadius: 8, textTransform: 'none' }}
                >
                  Submit
                </Button>
              </Box>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <div className="clover-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </Box>
              )}
              {error && (
                <Typography variant="body1" color="error">
                  Error: {error}
                </Typography>
              )}
            </Paper>
          </Box>
          {/* Right column: feedback display */}
          <Box sx={{ flex: '1 1 300px', maxWidth: '600px' }}>
            {!feedback && !loading ? (
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  textAlign: 'center',
                  color: '#9e9e9e',
                }}
              >
                <Typography variant="subtitle1">
                  No response yet. Your result will appear here.
                </Typography>
              </Paper>
            ) : (
              <Paper
                elevation={3}
                sx={{ p: 3, borderRadius: 4, backgroundColor: '#f1f8e9' }}
              >
                {feedback && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1b5e20' }}>
                      Review Result:
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        backgroundColor: '#ffffff',
                        overflowX: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0 }}>{feedback}</pre>
                    </Paper>
                  </>
                )}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <div className="clover-spinner">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CodeReviewForm;
