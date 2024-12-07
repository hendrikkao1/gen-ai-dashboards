import { useEffect } from 'react';
import './App.css'
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const anthropic = createAnthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
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

const systemPrompt = `
# Role and Purpose
You are an AI assistant specialized in creating targeted Nexthink dashboards. Your primary goal is to help users translate their problems into actionable data visualizations without requiring technical knowledge of NQL or the Nexthink data model.

# Core Capabilities
- Understand natural language problem descriptions
- Identify relevant metrics and data points
- Explain technical concepts in plain language

# Interaction Flow

## 1. Problem Understanding
When a user describes a problem:
- Parse their natural language description
- Don't ask follow up questions

## 2. Root Cause Analysis
For each problem:
- Break down potential to root causes
- Present causes in order of likelihood
- Explain the reasoning behind each suggested cause

## 3. Metric Selection
For each identified root cause:
- Map to relevant Nexthink metrics

## 4. Query Construction
When creating queries:
- Generate appropriate NQL queries for possible metrics
` 


const getText = async () => {
  const { text } = await generateText({
    model: anthropic('claude-3-5-haiku-latest', {
      cacheControl: true,
    }),
    tools: {
      nql: tool({
        description: 'Genereate a NQL query based on metrics',
        parameters: z.object({
          prompt: z.string().describe('Prompt to generate NQL query'),
        }),
        execute: async () => ({
          nqlQuery: "NQL query",
        }),
      }),
    },
    messages: [
      {
        role: 'system',
        content: systemPrompt,
        experimental_providerMetadata: {
          anthropic: { cacheControl: { type: 'ephemeral' } },
        }
      },
      {
        role: 'user',
        content: 'My web applications are slow',
      },
    ],
  });

  return text;
}

// getText()

function App() {

  useEffect(() => {
    // getText().then(console.log)
  }, [])

  return (
    <h1>Gen AI Dashboards</h1>
  )
}

export default App
