
const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ההזמנה של עומרי</title>
<style>
*{box-sizing:border-box}
body{
  margin:0;min-height:100vh;display:flex;align-items:center;
  justify-content:center;padding:24px;
  background:linear-gradient(145deg,#101820,#253746,#101820);
  color:#f8f3e9;font-family:Arial,sans-serif;text-align:center
}
.card{
  width:100%;max-width:440px;padding:42px 25px;
  border:1px solid #b99a61;border-radius:22px;
  background:rgba(12,20,27,.88);
  box-shadow:0 15px 60px #0008
}
.gold{color:#d9bd83}
.line{width:65px;height:1px;background:#b99a61;margin:24px auto}
h1{font-size:39px;margin:18px 0}
h2{font-size:20px;font-weight:400}
p{color:#d5d1c8;line-height:1.8}
input{
  width:100%;padding:15px;margin:20px 0;
  border:1px solid #b99a61;border-radius:10px;
  background:#17232c;color:white;font-size:16px;text-align:center
}
button{
  width:100%;padding:15px;margin:7px 0;
  border:1px solid #b99a61;border-radius:10px;
  background:#b99a61;color:#101820;
  font-size:17px;font-weight:bold;cursor:pointer
}
button.secondary{background:transparent;color:#e5d4b0}
button:disabled{opacity:.5}
#status{margin-top:18px;min-height:25px}
</style>
</head>
<body>
<main class="card">
  <div class="gold">✦ הזמנה אישית ✦</div>
  <div class="line"></div>
  <h1>אתם מוזמנים</h1>
  <h2 class="gold">לערב מיוחד אצל עומרי</h2>
  <div class="line"></div>
  <p>נשמח לדעת אם אתם מגיעים.<br>מחכים לחגוג וליהנות ביחד ❤️</p>
  <input id="guest" placeholder="איך קוראים לך? (לא חובה)">
  <button onclick="send('מאשרת הגעה',this)">🥂 מאשרת הגעה</button>
  <button class="secondary" onclick="send('לא מאשרת',this)">לא מגיעה</button>
  <button class="secondary" onclick="send('מתלבטת',this)">🤔 עדיין מתלבטת</button>
  <div id="status"></div>
</main>
<script>
async function send(choice, button) {
  const status = document.getElementById("status");
  const buttons = document.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);
  status.textContent = "שולחת את התשובה...";
  try {
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        choice,
        name: document.getElementById("guest").value
      })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message);
    status.textContent = "התשובה התקבלה בהצלחה ❤️";
  } catch (error) {
    status.textContent = error.message || "משהו השתבש. נסו שוב.";
    buttons.forEach(b => b.disabled = false);
  }
}
</script>
</body>
</html>`);
});

app.post("/api/rsvp", async (req, res) => {
  const choice = req.body && req.body.choice;
  const name = String((req.body && req.body.name) || "")
    .trim().slice(0, 60);
  const allowed = ["מאשרת הגעה", "לא מאשרת", "מתלבטת"];

  if (!allowed.includes(choice)) {
    return res.status(400).json({ok:false,message:"בחירה לא תקינה"});
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ok:false,message:"המערכת עדיין לא הוגדרה"});
  }

  const message =
    "🥂 עדכון RSVP להזמנה של עומרי\n\n" +
    "שם: " + (name || "לא צוין") + "\n" +
    "תשובה: " + choice;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({chat_id:CHAT_ID,text:message})
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram API error:",data);
      return res.status(502).json({
        ok:false,message:"לא הצלחנו לשלוח את העדכון לטלגרם"
      });
    }

    return res.json({ok:true});
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok:false,message:"שגיאה בשליחת התשובה"
    });
  }
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log("VIP invitation server running on port " + PORT);
});
