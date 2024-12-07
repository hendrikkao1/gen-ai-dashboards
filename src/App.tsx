import { useEffect } from 'react';
import './App.css'
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const anthropic = createAnthropic({
  apiKey: '',
  baseURL: '/llm',
  fetch(input, init) {
    const headers = new Headers(Object.entries(init?.headers ?? {}));
    headers.append('anthropic-dangerous-direct-browser-access', 'true');

    return fetch(input, {
      ...init,
      headers,
    });
  },
});


const getText = async () => {
  const { text } = await generateText({
    model: anthropic('claude-3-5-haiku-latest', {
      cacheControl: true,
    }),
    messages: [
      {
        role: 'system',
        content: 'Nexthink expert',
        experimental_providerMetadata: {
          anthropic: { cacheControl: { type: 'ephemeral' } },
        }
      },
      {
        role: 'user',
        content: 'Write a vegetarian lasagna recipe for 4 people.',
      }
    ],
  });

  return text;
}

function App() {

  useEffect(() => {
    // getText().then(console.log)
  }, [])

  return (
    <h1>Gen AI Dashboards</h1>
  )
}

export default App
