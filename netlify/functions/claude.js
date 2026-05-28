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
    const { goal, why, wentWell, learned, better, mission, callWant, score } = body;
 
    const prompt = `You are a deeply perceptive mindset and performance coach. You are reading a weekly reflection from someone in a 12-week group coaching programme. They have shared their goal, their why, and their honest reflection on the past week.
 
Your role is to respond in a way that genuinely moves them — not with generic encouragement, but with real insight that makes them feel seen, challenged, and clear on what comes next.
 
THEIR GOAL: ${goal}
THEIR WHY: ${why}
 
WEEK SCORE: ${score}/10
 
WHAT WENT WELL THIS WEEK:
${wentWell}
 
WHAT I LEARNED:
${learned}
 
WHAT COULD BE BETTER:
${better}
 
ONE MISSION FOR NEXT WEEK:
${mission}
 
WHAT I WANT FROM THE UPCOMING CALL:
${callWant}
 
Respond with a reflection that has five clear parts. Be specific to their actual words — not generic. Be direct. Be warm but not soft. This person is investing in themselves and they deserve honesty.
 
PART 1 — ACKNOWLEDGEMENT OF THE WIN
Genuinely acknowledge what went well. Not just "great job" — go deeper. What does this win actually say about them? What does it reveal about who they are becoming? Make them feel the significance of it.
 
PART 2 — DEEPER INSIGHT ON WHAT THEY LEARNED
Take what they said they learned and go one layer deeper. What is the real insight underneath it? What does this learning unlock for them going forward? Connect it to the identity work they are doing.
 
PART 3 — REFRAME OF WHAT COULD BE BETTER
Do not treat this as failure. Take what they identified as a gap and reframe it as forward momentum. What is this gap actually pointing to? What does it reveal that they now have the awareness to change? Turn it from a criticism into a direction.
 
PART 4 — SPECIFIC SETUP FOR THEIR MISSION NEXT WEEK
Take their stated mission and make it more specific, more felt, more locked in. What is the one thing they need to understand or hold in mind as they go into it? What would make this mission land differently than previous weeks?
 
PART 5 — CONNECTION BACK TO THEIR GOAL AND WHY
Close by connecting everything back to their goal and why. Remind them — specifically, not generically — why this week's reflection matters in the context of the larger thing they are building. Make the long game feel real and close.
 
Write in second person ("you"). Speak directly to them. No headers or labels — let it flow as one piece of honest, personal coaching. Aim for 300-400 words total. Make every sentence earn its place.`;
 
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
 
    const data = await response.json();
 
    if (data.error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: data.error.message }) };
    }
 
    const reflection = data.content[0].text;
    return { statusCode: 200, headers, body: JSON.stringify({ reflection }) };
 
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
