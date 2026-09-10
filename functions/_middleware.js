const PASSWORD = 'teamyoccer';
const COOKIE_NAME = 'wr_auth';

function passwordPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>William Rauscher</title>
<style>
@font-face {
  font-family: 'Neue Haas Grotesk';
  src: url('/fonts/NHGPro55Romanfont.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Neue Haas Grotesk';
  src: url('/fonts/NHGPro65Mediumfont.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Neue Haas Grotesk', Helvetica, Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #fff;
  color: #000;
}
.gate {
  text-align: left;
  width: 320px;
}
.gate h1 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 32px;
}
.gate input[type="password"] {
  width: 100%;
  padding: 10px 0;
  font-family: inherit;
  font-size: 15px;
  border: none;
  border-bottom: 1px solid rgba(0,0,0,0.10);
  outline: none;
  background: transparent;
  color: #000;
}
.gate input[type="password"]::placeholder {
  color: rgba(0,0,0,0.35);
}
.gate input[type="password"]:focus {
  border-bottom-color: #000;
}
.gate button {
  margin-top: 20px;
  padding: 8px 24px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #000;
  color: #fff;
  border: none;
  cursor: pointer;
}
.error {
  margin-top: 16px;
  font-size: 13px;
  color: rgba(0,0,0,0.50);
}
</style>
</head>
<body>
<form class="gate" method="POST">
  <h1>William Rauscher</h1>
  <input type="password" name="password" placeholder="Password" autofocus>
  <button type="submit">Enter</button>
  ${error ? '<p class="error">Incorrect password</p>' : ''}
</form>
</body>
</html>`;
}

export async function onRequest(context) {
  const { request, next } = context;

  const cookie = request.headers.get('Cookie') || '';
  if (cookie.includes(`${COOKIE_NAME}=authenticated`)) {
    return next();
  }

  if (request.method === 'POST') {
    const formData = await request.formData();
    const password = formData.get('password');

    if (password === PASSWORD) {
      const url = new URL(request.url);
      const response = new Response(null, {
        status: 302,
        headers: {
          'Location': url.pathname + url.search + url.hash,
          'Set-Cookie': `${COOKIE_NAME}=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
        },
      });
      return response;
    }

    return new Response(passwordPage(true), {
      status: 401,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  return new Response(passwordPage(false), {
    status: 401,
    headers: { 'Content-Type': 'text/html' },
  });
}
