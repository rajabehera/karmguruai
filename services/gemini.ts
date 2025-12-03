
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { RoadmapStep, MCQuestion, CareerPathRecommendation, InterviewReport, InterviewConfig, CodeRunResult, TestCase, RoleplayAnalysis, Job } from "../types";

const apiKey = import.meta.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateRoadmap = async (goal: string, currentStatus: string): Promise<RoadmapStep[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a detailed career roadmap for a student currently in "${currentStatus}" who wants to become a "${goal}". 
      Break it down into 5-7 distinct chronological steps (e.g., School, College, Internships, Entry Level).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              duration: { type: Type.STRING },
              skills: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "description", "duration", "skills"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RoadmapStep[];
    }
    return [];
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return [];
  }
};

export const generateMCQs = async (topic: string, count: number = 5, resumeContext?: string): Promise<MCQuestion[]> => {
  try {
    let prompt = `Generate ${count} multiple choice questions about "${topic}" for an interview preparation test. Include an explanation for the correct answer.`;
    
    if (resumeContext) {
      prompt += `\n\nAlso, consider the following candidate resume context. Mix in 1-2 questions related to the specific skills or projects mentioned if applicable (but keep it multiple choice).\nResume Context:\n${resumeContext.substring(0, 1000)}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MCQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating MCQs:", error);
    return [];
  }
};

export const generateDescriptiveQuestion = async (config: InterviewConfig): Promise<string> => {
  try {
    let prompt = `Generate a single, deep ${config.category} interview question for a ${config.subRole} role at ${config.company}.
    Tech Stack: ${config.techStack.join(', ')}.`;
    
    if (config.category === 'HR') {
        prompt = `Generate a single HR/Behavioral interview question for a ${config.subRole} role at ${config.company}. Focus on culture, salary, or workplace scenarios.`;
    } else if (config.category === 'Coding') {
        prompt = `Generate a single Coding/Algorithm problem description (without code solution) for a ${config.subRole}. Focus on Logic/DSA.`;
    }

    if (config.resumeContext) {
      prompt += `\n\nCandidate Resume Context:\n${config.resumeContext}\n\nAsk a question specifically about a project, skill, or experience mentioned in their resume to test their depth of knowledge.`;
    } else {
      prompt += `\n\nAsk a scenario-based question relevant to the role and category.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || `Explain the core principles of ${config.subRole} and how you utilize ${config.techStack[0]} in your workflow.`;
  } catch (error) {
    return `Explain the core principles of ${config.subRole} and how you utilize ${config.techStack[0]} in your workflow.`;
  }
};

export const evaluateDescriptiveAnswer = async (question: string, answer: string): Promise<{score: number, feedback: string, keywords: string[]}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Evaluate this interview answer. 
      Question: "${question}"
      Answer: "${answer}"
      Provide a score out of 100, constructive feedback, and identified keywords.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            keywords: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return JSON.parse(response.text) as any;
    }
    return { score: 0, feedback: "Error evaluating", keywords: [] };
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return { score: 0, feedback: "Error evaluating", keywords: [] };
  }
};

export const runCodeSimulation = async (
  code: string, 
  language: string, 
  problemContext: string = "",
  testCases: TestCase[] = []
): Promise<CodeRunResult> => {
  try {
    const prompt = `Act as a code runner and analyzer.
      Language: ${language}
      Code: 
      ${code}
      
      Problem Context: ${problemContext}

      Tasks:
      1. Simulate running the code against these specific test cases:
         ${testCases.map((tc, i) => `Test Case ${i+1}: Input=${tc.input}, Expected=${tc.expectedOutput}`).join('\n')}
      2. For each test case, determine the Actual Output and if it Passed.
      3. If there are syntax errors, describe them in 'error'.
      4. Provide a brief analysis.
      
      Return JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            output: { type: Type.STRING, description: "Standard output of the run" },
            error: { type: Type.STRING },
            analysis: { type: Type.STRING },
            testResults: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  input: { type: Type.STRING },
                  expected: { type: Type.STRING },
                  actual: { type: Type.STRING },
                  passed: { type: Type.BOOLEAN }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as CodeRunResult;
    }
    return { output: "", error: "Failed to run simulation", analysis: "" };
  } catch (error) {
    return { output: "", error: "AI Service Error", analysis: "" };
  }
};

export const analyzeCodeAction = async (code: string, action: 'FIX' | 'OPTIMIZE' | 'EXPLAIN'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Perform action: ${action} on the following code:
      ${code}
      
      Keep the response concise and developer-focused.`,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    return "Error generating analysis.";
  }
};

export const generateCareerPaths = async (profile: string, interests: string[], aptitudeScore: number): Promise<CareerPathRecommendation[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this student profile:
      Stage: ${profile}
      Interests: ${interests.join(', ')}
      Aptitude Score: ${aptitudeScore}/100
      
      Suggest top 3 career paths.
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              description: { type: Type.STRING },
              requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "matchScore", "description", "requiredSkills", "steps"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};

export const generateEnglishDrill = async (accent: string, level: string, scenario: string = "General Conversation"): Promise<{phrase: string, tip: string, userRole: string, practiceSet: {phrase: string, tip: string}[], dialogue: {speaker: string, text: string}[]}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a short English practice drill for ${level} level focusing on ${accent} accent.
      CONTEXT / SCENARIO: ${scenario}.
      
      1. Include a key phrase useful for this scenario.
      2. Include a pronunciation tip specific to ${accent} accent.
      3. Create a realistic 6-8 line roleplay dialogue between two people in this scenario.
      4. Explicitly state which role the USER should play (e.g., if scenario is 'Buying Groceries', userRole could be 'Customer').
      5. Provide a 'practiceSet' of 10 additional useful phrases for this specific situation.
      
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phrase: { type: Type.STRING },
            tip: { type: Type.STRING },
            userRole: { type: Type.STRING },
            practiceSet: { 
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { phrase: { type: Type.STRING }, tip: { type: Type.STRING } }
              }
            },
            dialogue: { 
              type: Type.ARRAY, 
              items: { 
                 type: Type.OBJECT, 
                 properties: { speaker: { type: Type.STRING }, text: { type: Type.STRING } }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { phrase: "Hello World", tip: "Practice makes perfect", userRole: "Speaker A", practiceSet: [], dialogue: [] };
  }
};

export const analyzeRoleplayPerformance = async (script: string): Promise<RoleplayAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this roleplay session performance. 
      Script followed: 
      ${script}
      
      Provide a fluency score (0-100), accuracy score (how well they stuck to context), feedback, and 2 improvements.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fluencyScore: { type: Type.INTEGER },
            accuracyScore: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { fluencyScore: 0, accuracyScore: 0, feedback: "Analysis Failed", improvements: [] };
  }
};

export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const generateCandidateResponse = async (
  question: string,
  role: string,
  experience: string,
  personality: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Act as a job candidate with the following profile:
      Role: ${role}
      Experience Level: ${experience}
      Personality Trait: ${personality}
      
      The interviewer asked: "${question}"
      
      Answer the question embodying the persona.
      - If 'Nervous', stammer slightly, hesitate, or use filler words.
      - If 'Confident', be clear, concise, and professional.
      - If 'Arrogant', sound a bit dismissive or overconfident.
      - If 'Detailed', give a very long, technical answer.
      
      Keep the answer under 100 words.`,
    });
    return response.text || "I'm not sure how to answer that.";
  } catch (e) {
    return "Could you please repeat the question?";
  }
};

export const generateInterviewFeedback = async (
  config: InterviewConfig,
  actualData?: { questions: string[], userAnswers: string[] }
): Promise<InterviewReport> => {
  try {
    const isRealData = actualData && actualData.questions.length > 0;
    
    let prompt = "";
    if (isRealData) {
      prompt = `Analyze this ${config.mode} interview for a ${config.role} (${config.subRole}) role at ${config.company}.
      Category: ${config.category}
      Experience Level: ${config.experience}.
      
      Here is the transcript of questions and user answers:
      ${actualData.questions.map((q, i) => `Q${i+1}: ${q}\nA${i+1}: ${actualData.userAnswers[i] || "No Answer"}`).join('\n\n')}
      
      Provide a comprehensive performance report based on these specific answers.`;
      
      if (config.resumeContext) {
        prompt += `\n\nTake into account the candidate's resume context: ${config.resumeContext}`;
      }
    } else {
      prompt = `Simulate a realistic post-interview analysis for a ${config.role} (${config.subRole}) candidate at ${config.company} (${config.experience} experience).
      Interview Category: ${config.category}.
      Tech Stack: ${config.techStack.join(', ')}.
      
      Since this was a Voice Interview simulation, generate a *hypothetical* transcript of 3 key Q&A pairs that likely occurred.
      Then, provide feedback, score, and metrics as if evaluating that specific transcript.
      Make the feedback specific to the category and technologies.`;

       if (config.resumeContext) {
        prompt += `\n\nSimulate questions that would have been asked based on this resume context: ${config.resumeContext}`;
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            duration: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                confidence: { type: Type.INTEGER },
                clarity: { type: Type.INTEGER },
                technicalAccuracy: { type: Type.INTEGER }
              }
            },
            feedback: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            transcript: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  text: { type: Type.STRING },
                  timestamp: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as InterviewReport;
    }
    throw new Error("No response");
  } catch (error) {
    console.error("Error generating feedback:", error);
    return {
      overallScore: 0,
      duration: "00:00",
      metrics: { confidence: 0, clarity: 0, technicalAccuracy: 0 },
      feedback: "Unable to generate report at this time. Please check your connection.",
      strengths: [],
      improvements: [],
      transcript: []
    };
  }
};

export const generateResumeSummary = async (role: string, skills: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a professional, impactful 3-sentence resume summary for a ${role}. 
      Key skills to highlight: ${skills.join(', ')}.
      Tone: Professional, Results-oriented.`,
    });
    return response.text || "Experienced professional seeking new opportunities.";
  } catch (e) {
    return "Error generating summary.";
  }
};

export const enhanceResumeDescription = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rewrite this resume job description bullet point to make it more impactful.
      Use action verbs and imply results/metrics where appropriate.
      Original: "${text}"`,
    });
    return response.text || text;
  } catch (e) {
    return text;
  }
};

export const findJobs = async (resumeText: string, preferences: string): Promise<Job[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Act as a job matching engine.
      Resume: "${resumeText.substring(0, 1000)}..."
      User Preferences: "${preferences}"
      
      Generate 5 realistic job listings that match this profile.
      For each job, provide a 'matchScore' (0-100) and 'matchReason'.
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                type: { type: Type.STRING },
                matchScore: { type: Type.INTEGER },
                matchReason: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } }
             },
             required: ["id", "title", "company", "location", "matchScore", "matchReason", "skills"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Job[];
    }
    return [];
  } catch (error) {
    console.error("Job Search Error", error);
    return [];
  }
};
