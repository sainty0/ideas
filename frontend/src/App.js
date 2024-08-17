import ScriptEditor from './components/ScriptEditor';

import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setImageUrl(data.image_url);
        setError('');
      } else {
        setError(data.error || 'Something went wrong');
        setImageUrl('');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setImageUrl('');
    }
  };

  return (
    <div className="App">
      <h1>Script Writing App</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          required
        />
        <button type="submit">Generate</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Generated" />}
      <ScriptEditor />
    </div>
  );


}

export default App;

