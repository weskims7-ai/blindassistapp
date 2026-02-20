export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { image } = JSON.parse(req.body);

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.2-11b-vision-preview",
                messages: [{
                    role: "user",
                    content: [
                        { type: "text", text: "Assistant for the blind. Describe obstacles and estimate steps. Max 12 words." },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
                    ]
                }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to reach AI" });
    }
}
