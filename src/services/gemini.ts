import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateStudyPlan(input: {
  subjects: string[];
  topics: Record<string, string[]>;
  examDate: string;
  difficulty: Record<string, number>;
  dailyHours: number;
}) {
  const prompt = `Generate a detailed study plan for a student based on:
    Subjects: ${input.subjects.join(", ")}
    Topics: ${JSON.stringify(input.topics)}
    Exam Date: ${input.examDate}
    Difficulty (1-5): ${JSON.stringify(input.difficulty)}
    Daily Study Hours: ${input.dailyHours}
    
    Return a structured daily schedule for the next 7 days.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weeklyPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      subject: { type: Type.STRING },
                      topic: { type: Type.STRING },
                      duration: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getProductivityInsights(data: any) {
  const prompt = `Analyze this student activity data and provide 3 actionable insights:
    ${JSON.stringify(data)}
    
    Return insights as a list of strings.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text).insights;
}
