const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/api/rsvp", async (req, res) => {
  const choice = req.body && req.body.choice;
  const allowed = ["מאשרת הגעה", "לא מאשרת", "מתלבטת"];

  if (!allowed.includes(choice)) {
    return res.status(400).json({ ok: false, message: "בחירה לא תקינה" });
  }
  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ ok: false, message: "המערכת עדיין לא הוגדרה" });
  }

  const message = `🥂 עדכון RSVP להזמנה של עומרי\n\nהתשובה שהתקבלה: ${choice}`;
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.error("Telegram API error:", data);
      return res.status(502).json({ ok: false, message: "לא הצלחנו לשלוח את העדכון לטלגרם" });
    }
    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: "שגיאה בשליחת התשובה" });
  }
});

app.get("/health", (_req, res) => res.send("OK"));

app.listen(PORT, () => console.log(`VIP invitation server running on port ${PORT}`));
