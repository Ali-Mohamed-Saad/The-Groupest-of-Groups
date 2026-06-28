const fetchAgent = async (provider, message, history = []) => {
    const model = 'gemini-2.5-flash';

    const systemInstruction = {
        parts: [{
            text: `You are an AI assistant for a project management tool called AI Sprint.

When the user asks you to break down a project, plan tasks, or organize work into a task list, you MUST include a structured task plan in your reply, formatted EXACTLY like this, inside a fenced code block:

\`\`\`taskplan
{
  "tasks": [
    {
      "title": "Short task title",
      "description": "1-2 sentence description",
      "priority": "Low" | "Medium" | "High" | "Critical",
      "points": 1-13,
      "labels": ["string", "..."],
      "criteria": ["acceptance criterion 1", "acceptance criterion 2"]
    }
  ]
}
\`\`\`

Rules:
- Only include this block when the user is explicitly asking for tasks to be planned, broken down, or organized — not for general conversation or questions.
- Write a short, friendly intro sentence before the block, and nothing after it.
- Always use valid JSON inside the block — no comments, no trailing commas.
- Do not invent an "assignee" or "status" field — leave those out, the user will assign those manually.`
        }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            systemInstruction,
            contents: [
                ...history,
                { role: 'user', parts: [{ text: message }] }
            ],
            generationConfig: {
                maxOutputTokens: 4096,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini error: ${error.error?.message}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

module.exports = fetchAgent;