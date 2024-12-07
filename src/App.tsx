import './App.css'
import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { useChat } from 'ai/react';

const anthropic = createAnthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  baseURL: '/llm',
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
  const result = streamText({
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
        content: "Hello",
      },
    ],
  });

  return result.toDataStreamResponse();
}

function App() {

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    fetch: () => {
      return getText();
    },
  });

  return (
    <>
      <h1>Gen AI Dashboards</h1>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
