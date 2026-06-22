import fetchAgent from "../services/aiService";

export const sendMessage = async (req, res) => {
    console.log("rearaer");
    try {
    const { message, provider, history } = req.body;
    const reply = await fetchAgent(provider, message, history);
    
    res.json({ reply });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
}