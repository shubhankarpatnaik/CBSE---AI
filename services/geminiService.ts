
import { GoogleGenAI } from "@google/genai";
import { GenerationRequest, OutputType } from '../types';
import { findRelevantUploads } from './contentService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
    You are an expert CBSE teacher specializing in Classes 9-10. 
    Strictly follow NCERT books. 
    Use exam-oriented terminology (e.g., "marking points", "key definitions").
    Avoid hallucination. If data is not in the chapter context, state you don't know based on NCERT.
    Tone: Formal, encouraging, and structured.
`;

export const generateStudyContent = async (request: GenerationRequest): Promise<string> => {
  const relevantContent = findRelevantUploads(request.class, request.subject, request.chapter.name);
  
  const internalContext = relevantContent.length > 0 
    ? `\nContext from internal repository:\n${relevantContent.map(c => `[${c.contentType}] ${c.content}`).join('\n')}`
    : '';

  let userPrompt = `
    Subject: ${request.subject}
    Class: ${request.class}
    Chapter: ${request.chapter.number} - ${request.chapter.name}
    Sub-topic: ${request.subTopic || 'Entire Chapter'}
    Key Terms: ${request.chapter.keyTerms.join(', ')}
    Focus: ${request.focusAreas || 'Comprehensive NCERT coverage'}
    Output Mode: ${request.outputType}
    ${internalContext}
  `;

  switch (request.outputType) {
    case OutputType.FULL_EXPLANATION:
      userPrompt += `\nGenerate a complete concept clarity section. Include:
      1. Conceptual foundation.
      2. Detailed breakdown of sub-topics.
      3. NCERT-style diagrams described in text.
      4. Crucial definitions.
      5. Application in daily life.`;
      break;
    case OutputType.SUMMARY:
      userPrompt += `\nGenerate an exam-ready summary with bullet points, high-weightage keywords, and "Master Tips" for revision.`;
      break;
    case OutputType.MIND_MAP:
      userPrompt += `\nGenerate a hierarchical text mind-map. Root is the chapter/subtopic, branched into major themes, then definitions/examples.`;
      break;
    case OutputType.REVISION_PLAN:
      userPrompt += `\nGenerate a 3-Day Rapid Revision Plan:
      - Day 1: Deep dive into concepts & NCERT reading.
      - Day 2: Problem solving, diagrams, and formula practice.
      - Day 3: Mock Test & self-assessment using spaced repetition logic.`;
      break;
    case OutputType.MOCK_QUESTIONS:
      userPrompt += `\nGenerate: 
      - 5 MCQs (1M)
      - 3 VSAQ (2M)
      - 2 LAQ (5M)
      - 1 Case-Study (4M)
      Provide a Detailed Marking Scheme with points for each answer.`;
      break;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: userPrompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.1 }
  });

  return response.text || "No content generated.";
};

export const startChapterChat = (chapterInfo: string) => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\nYou are currently in a chat session focusing ONLY on: ${chapterInfo}. 
      Do not answer questions outside this scope unless they directly relate to the context.`,
      temperature: 0.2,
    },
  });
};
