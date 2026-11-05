הזמנה דיגיטלית VIP של עומרי — מדריך פרסום

מה הפרויקט עושה?
דף הזמנה שחור-זהב עם 3 כפתורי תשובה. בחירה נשלחת לבוט הטלגרם כהודעה פרטית.

חשוב:
- לעולם לא מכניסים את BOT_TOKEN לתוך קובץ HTML או לקוד שנשלח לדפדפן.
- לא שולחים את ה-Token בצ'אט. שומרים אותו רק ב-Environment Variables של Render.
- CHAT_ID הוא 904139517 לפי המספר שעומרי סיפק.

שלבי פרסום (אחרי העלאת הפרויקט ל-GitHub):
1. ב-GitHub צור Repository חדש בשם omri-vip-invitation.
2. העלה אליו את כל הקבצים שבתיקייה הזו, כולל התיקייה public.
3. ב-Render בחר New + ואז Web Service.
4. חבר את חשבון GitHub ובחר את repository בשם omri-vip-invitation.
5. הגדר:
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
6. תחת Environment Variables הוסף:
   BOT_TOKEN = הטוקן שקיבלת מ-BotFather (להדביק רק בתוך Render)
   CHAT_ID = 904139517
7. לחץ Deploy.
8. לאחר פריסה מוצלחת Render יציג כתובת שמסתיימת ב-onrender.com. זו כתובת ההזמנה לשיתוף.

בדיקה:
- פתח קודם את כתובת האתר בעצמך.
- לחץ על אחד הכפתורים.
- ודא שהתקבלה הודעה מהבוט בטלגרם.
- רק אז שלח את הקישור.

אם לא מתקבלת הודעה:
- ודא שלחצת Start בבוט.
- בדוק שאין רווחים בתחילת/סוף BOT_TOKEN.
- בדוק ש-CHAT_ID הוזן בדיוק.
