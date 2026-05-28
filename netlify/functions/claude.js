exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  try {
    const body = JSON.parse(event.body);
    const { goal, why, score, committed, wentWell, fellShort, insight, thinks, feels, acts, missions, nonneg, callWant } = body;

    const prompt = `You are a deeply perceptive mindset and performance coach reading a Sunday Protocol reflection from someone in a 12-week group coaching programme. Respond specifically to their actual words — not generically.

THEIR GOAL: ${goal}
THEIR WHY: ${why}
WEEK SCORE: ${score}/10

WHAT THEY COMMITTED TO VS WHAT THEY ACTUALLY DID: ${committed}
WHAT WENT WELL: ${wentWell}
WHERE THEY FELL SHORT AND WHY: ${fellShort}
ONE GENUINE INSIGHT OR AWARENESS: ${insight}
HOW THE BECOMING VERSION THINKS THIS WEEK: ${thinks}
HOW THAT VERSION FEELS THIS WEEK: ${feels}
HOW THAT VERSION ACTS THIS WEEK: ${acts}
THEIR MISSIONS THIS WEEK: ${missions}
THEIR DAILY NON-NEGOTIABLE: ${nonneg}
WHAT THEY WANT FROM THE CALL: ${callWant}

Write a personal coaching reflection. No headers. Second person. Direct and warm. 350-450 words. Five parts flowing as one piece:

1 — Acknowledge the win deeply. What does it reveal about who they are becoming?
2 — Take their insight one layer deeper. What does it unlock going forward?
3 — Reframe where they fell short as a direction not a failure. Use their actual words.
4 — Anchor their think-feel-act intentions to their missions. Make it feel real.
5 — Connect everything back to their goal and why specifically. Leave them with one truth to carry into the week.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (data.error) return { statusCode: 500, headers, body: JSON.stringify({ error: data.error.message }) };
    return { statusCode: 200, headers, body: JSON.stringify({ reflection: data.content[0].text }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
