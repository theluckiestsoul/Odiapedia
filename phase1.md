Below are the **clear, executable action items for Phase 1**.
This is written like a **checklist you can literally follow**, in order, without ambiguity.

---

# Phase 1 – Action Items

**Goal:** Get Odiapedia live with a solid foundation
**Outcome:** `odiapedia.com` is deployed, reachable, and ready for content

---

## Phase 1 Objective (Non-Negotiable)

* Website is **live on Vercel**
* Domain is connected
* No CMS, no DB, no infra complexity
* You can publish content immediately

---

## 1️⃣ Project Initialization

### Action Items

* [ ] Install Node.js (v18+)
* [ ] Create Next.js app using App Router
* [ ] Enable TypeScript
* [ ] Enable Tailwind CSS
* [ ] Use `src/` directory

### Deliverable

* App runs locally at `localhost:3000`

---

## 2️⃣ Repository Setup

### Action Items

* [ ] Create GitHub repository `odiapedia`
* [ ] Push initial Next.js code
* [ ] Set `.gitignore` correctly
* [ ] Add a basic `README.md`

### Deliverable

* Clean repo with first commit
* GitHub is the source of truth

---

## 3️⃣ Clean the Default App

### Action Items

* [ ] Remove demo content
* [ ] Simplify `page.tsx`
* [ ] Simplify `layout.tsx`
* [ ] Add a basic site title (“Odiapedia”)

### Deliverable

* Minimal homepage rendering
* No Next.js boilerplate noise

---

## 4️⃣ Basic Layout Skeleton

### Action Items

* [ ] Create `Navbar` component
* [ ] Create `Footer` component
* [ ] Add basic navigation links:

  * Language
  * Culture
  * History
  * Food
  * People
  * About

### Deliverable

* Consistent layout across pages
* Navigation works (even if pages are empty)

---

## 5️⃣ Create Core Routes (Empty Pages Are Fine)

### Action Items

* [ ] Create `/language`
* [ ] Create `/culture`
* [ ] Create `/history`
* [ ] Create `/food`
* [ ] Create `/people`
* [ ] Create `/about`

### Deliverable

* All routes load without error
* URLs are SEO-friendly

---

## 6️⃣ Styling Baseline

### Action Items

* [ ] Choose base font (system or Google font)
* [ ] Ensure mobile-first layout
* [ ] Keep colors minimal (white + accent)
* [ ] Ensure Odia text renders correctly

### Deliverable

* Clean, readable UI
* No design perfection required

---

## 7️⃣ Deploy to Vercel

### Action Items

* [ ] Create Vercel account
* [ ] Import GitHub repo into Vercel
* [ ] Trigger first deployment
* [ ] Verify site loads on Vercel URL

### Deliverable

* Live URL like `odiapedia.vercel.app`

---

## 8️⃣ Connect Custom Domain

### Action Items

* [ ] Add `odiapedia.com` in Vercel
* [ ] Update DNS (via domain provider)
* [ ] Verify HTTPS works

### Deliverable

* `https://odiapedia.com` loads successfully

---

## 9️⃣ Basic SEO Setup (Minimal, Not Advanced)

### Action Items

* [ ] Set site title and description
* [ ] Add favicon
* [ ] Ensure `<title>` renders correctly
* [ ] Ensure pages are crawlable

### Deliverable

* Site is SEO-ready at a basic level

---

## 10️⃣ Phase 1 Exit Criteria (Very Important)

Phase 1 is **DONE** only when:

* [ ] `odiapedia.com` is live
* [ ] Navigation works
* [ ] No broken routes
* [ ] You feel confident pushing changes
* [ ] You can say: *“I can now focus on content”*

If any of these are missing → Phase 1 is not complete.

---

## 🚫 Explicitly OUT of Scope for Phase 1

Do **not** do these yet:

* ❌ MDX rendering
* ❌ Writing articles
* ❌ Terraform
* ❌ Ansible
* ❌ Database
* ❌ CMS
* ❌ Analytics

Those belong to **Phase 2+**.

---

## Phase 1 Success Signal (Mental Check)

If tomorrow you can:

> “Open VS Code, change text, push to GitHub, and see it live in minutes”

Then Phase 1 is a success.

---

## Next Step (When You’re Ready)

When Phase 1 is complete, the **only correct next phase** is:

👉 **Phase 2 – MDX Content System**

Say **`phase2`** when you’re done with Phase 1, and we’ll continue cleanly.
