const fetchAgent = async (provider, message, history = []) => {
    const model = 'gemini-2.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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