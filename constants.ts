
export const COMMON_TOPICS = [
  "Introduce yourself and your background.",
  "What are your long-term career goals?",
  "Describe your favorite travel memory.",
  "What is the importance of technology in modern education?",
  "How do you usually spend your weekends?",
  "Talk about a book or movie that changed your perspective.",
  "What are the pros and cons of working from home?",
  "Describe a person who has influenced you the most.",
  "How do you handle stress in your daily life?",
  "Talk about your favorite hobby and why you enjoy it."
];

export const SYSTEM_PROMPT = `
Analyze the provided English speaking audio. 
Perform the following tasks:
1. Transcribe the audio precisely.
2. Rate the fluency on a scale of 0-100 based on flow, speed, and hesitation.
3. Rate the vocabulary usage on a scale of 0-100.
4. Identify grammar errors and provide corrections with simple explanations.
5. Provide overall suggestions for improvement.

The response MUST be a JSON object with this structure:
{
  "transcript": "...",
  "fluencyScore": 85,
  "vocabScore": 70,
  "grammarErrors": [
    { "original": "he go to store", "correction": "he goes to the store", "explanation": "Subject-verb agreement: 'he' takes 'goes'." }
  ],
  "generalSuggestions": "Try to use more varied adjectives and work on vowel clarity."
}
`;
