(async () => {
  const r = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sontd.vn', password: '123456' })
  });
  console.log(await r.json());
})();
