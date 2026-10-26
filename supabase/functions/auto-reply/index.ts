import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const GMAIL_USER = Deno.env.get('GMAIL_USER');
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*';

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD');
}

const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const client = new SMTPClient({
  connection: {
    hostname: 'smtp.gmail.com',
    port: 465,
    tls: true,
    auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
  },
});

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: { email?: unknown; name?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { email, name } = body;
  if (
    typeof email !== 'string' ||
    email.length > 254 ||
    !EMAIL_RE.test(email)
  ) {
    return json({ error: 'Invalid email' }, 400);
  }
  if (
    typeof name !== 'string' ||
    name.trim().length === 0 ||
    name.length > 100 ||
    /[\r\n]/.test(name)
  ) {
    return json({ error: 'Invalid name' }, 400);
  }

  try {
    await Promise.race([
      client.send({
        from: `"Your Team" <${GMAIL_USER}>`,
        to: email,
        subject: 'Thank you for contacting us!',
        content: `Dear ${name},\n\nThank you for reaching out...`,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP timeout')), 10_000)
      ),
    ]);
    return json({ ok: true });
  } catch (err) {
    console.error('Email send failed:', err);
    return json({ error: 'Failed to send email' }, 500);
  }
});