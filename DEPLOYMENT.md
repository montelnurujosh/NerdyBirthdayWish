# 🚀 How to Take Your Nerdy Birthday Wish Website Live

Your website is built, verified, and completely ready to go live! Here are the 3 fastest, free ways to put it online and share the link with your special person.

---

## ⚡ Option 1: Instant Drag & Drop on Netlify (No Git / Fastest — 30 Seconds)

You don't even need a GitHub account for this:

1. Open **[app.netlify.com/drop](https://app.netlify.com/drop)** in your browser.
2. Drag and drop the built folder from your computer:
   ```
   Nerdy-Birthday-Wish-main/artifacts/nerdy-birthday-wish/dist
   ```
3. Netlify will instantly give you a live HTTPS link (e.g. `https://peaceful-star-12345.netlify.app`)!
4. *(Optional)* Click "Site settings" > "Change site name" to customize the link (e.g. `https://for-maya-birthday.netlify.app`).

---

## 🌟 Option 2: Deploy with Vercel (Recommended)

1. Push or import your repository into your GitHub account.
2. Go to **[vercel.com](https://vercel.com)** and log in with GitHub.
3. Click **"Add New..."** > **"Project"**.
4. Select your **Nerdy-Birthday-Wish** repository and click **"Deploy"**.
   - *(Note: The included `vercel.json` automatically sets the build command and output directory for you!)*
5. Within 1 minute, you will receive your free live production URL (e.g. `https://nerdy-birthday-wish.vercel.app`).

---

## 🐙 Option 3: Deploy with GitHub Pages (Automated via Actions)

1. Push your repository to GitHub.
2. In your repository on GitHub:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) will automatically build and publish your site at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

---

## 💌 How to Personalize the Live Link

Once your site is live, you have two super easy ways to customize it for the birthday person:

### Method A: Use the On-Screen Personalize Tool
1. Open your live website.
2. Click the **"Personalize"** button in the top navigation bar.
3. Enter the birthday person's name (To), your name (From), an optional WhatsApp number (Phone), and an optional custom note.
4. Click **"Copy Personalized Link"**. The custom URL with everything pre-filled is copied to your clipboard!
5. When she opens the link:
   - She sees NO edit or share buttons (it feels 100% custom-built for her!).
   - At the end, she can write a reply and hit **"Transmit via WhatsApp"** to send her response straight to your phone!

### Method B: URL Parameters
Simply add query parameters directly to the link you send:
```
https://your-site.vercel.app/?to=Maya&from=Alex&phone=+1234567890&date=September+4
```
Supported parameters:
- `to`: Birthday person's name (e.g., `?to=Sophia`)
- `from`: Your name / sign-off (e.g., `?from=Sam`)
- `phone`: Your WhatsApp number with country code (e.g., `?phone=+1234567890`)
- `date`: Earth date displayed in the header (e.g., `?date=September+4`)
- `note`: Custom P.S. note at the bottom of the letter
- `edit`: Set to `true` (e.g., `&edit=true`) to view the personalization menu on a customized link


---

## 💻 Local Testing / Development

To preview or run the site locally on your machine at any time:

```bash
# Start local development server
pnpm run dev

# Or test the production preview
pnpm run preview
```
Visit `http://localhost:5173` in your browser.

