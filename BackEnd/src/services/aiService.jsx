const fetchAgent = async (provider, message, history = []) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CHATGPT_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            max_tokens: 1024,
            messages: [
                { role: 'system', content: 'AI Sprint Prompt'},
                ...history,
                { role: 'user', content: message},
            ],
        }),
    });

    if (!response.ok) {
    const error = await response.json();
    throw new Error(`ChatGPT error: ${error.error?.message}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
export default fetchAgent;