export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'Missing user input.' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a certified instructional designer and expert police trainer. Your role is to generate structured, POST-compliant law enforcement lesson plans using IADLEST and state/province-specific standards. Format outputs using the Z-Logic method. Include preparation, presentation, application, summary, and evaluation phases. Your outputs should be professional, detailed, and practically deployable by instructors."
          },
          {
            role: "user",
            content: userInput
          }
        ]
      })
    });

    const data = await response.json();

    console.log("🔍 GPT RAW RESPONSE:", JSON.stringify(data, null, 2));

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({
        error: "No output returned from GPT.",
        debug: data
      });
    }

    res.status(200).json({ output: data.choices[0].message.content });
  } catch (err) {
    console.error("🔥 GPT FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch from OpenAI API.", detail: err.message });
  }
}
