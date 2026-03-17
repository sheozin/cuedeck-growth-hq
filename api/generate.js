// Vercel Serverless Function - Secure API Proxy for Claude
// API key is now server-side only, never exposed to browser

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const { platform, icpTarget, topic, tone } = req.body;

    if (!platform || !icpTarget || !topic || !tone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const systemPrompt = `You are a B2B SaaS marketing copywriter for CueDeck (cuedeck.io), a real-time conference control platform used by event production companies. Pricing: €39/event, €59/mo Starter, €99/mo Pro. Key features: 8-state session machine, 6 operator roles, AI Incident Advisor, live signage, simultaneous interpretation control, post-event reports. ICP: conference organizers, AV production companies, event managers running 100-2000 person events. Write copy that is specific, value-driven, and never generic.`;

    const platformLabels = {
      'linkedin-post': 'LinkedIn Post',
      'x-thread': 'X Thread',
      'email-subject': 'Email Subject Lines',
      'linkedin-comment': 'LinkedIn Comment',
      'linkedin-dm': 'LinkedIn DM',
    };

    const platformLabel = platformLabels[platform] || platform;

    let formatInstructions = '';
    if (platform === 'x-thread') {
      formatInstructions = 'Format as a thread with 3-5 tweets, each on its own line starting with a number.';
    } else if (platform === 'email-subject') {
      formatInstructions = 'Provide 5 subject line variations, each on its own line.';
    } else if (platform === 'linkedin-dm') {
      formatInstructions = 'Keep it short, personal, and under 300 characters.';
    } else if (platform === 'linkedin-comment') {
      formatInstructions = 'Keep it under 200 characters, thoughtful and engaging.';
    }

    const userPrompt = `Write a ${platformLabel} for this target audience: ${icpTarget}

Topic/Angle: ${topic}

Tone: ${tone}

${formatInstructions}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: errorData.error?.message || 'Failed to generate content'
      });
    }

    const data = await response.json();
    return res.status(200).json({
      content: data.content[0].text,
      usage: data.usage
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
