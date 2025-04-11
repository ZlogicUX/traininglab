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
        model: "gpt-4",
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

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ output: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No output returned from GPT." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from OpenAI API." });
  }
}
