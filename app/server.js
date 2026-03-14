const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// SPA-style fallback: always return index.html so in-page routing works.
// For Express 5 / path-to-regexp, regex routes should be passed as RegExp.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 GitX is running!`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log(`   Press Alt+I inside browser to enter the app\n`);
});
