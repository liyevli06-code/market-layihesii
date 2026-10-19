# UniShare

Azərbaycan tələbələri üçün mühazirə qeydləri, konspektlər, xülasələr və sınaq testləri platforması.
Stack: Next.js 14 (App Router) · Tailwind CSS · TypeScript · Supabase · Vercel.

## 1. Supabase quraşdırması
1. https://supabase.com saytında yeni layihə yaradın.
2. **SQL Editor** → `supabase/schema.sql` faylının məzmununu yapışdırıb işə salın (cədvəllər, RLS, storage bucket).
3. **Project Settings → API** bölməsindən `Project URL` və `anon public` açarını götürün.

## 2. Lokal işə salma
```bash
cp .env.example .env.local   # dəyərləri doldurun
npm install
npm run dev
```
Sayt http://localhost:3000 ünvanında açılır.

## 3. Vercel-ə yerləşdirmə
1. Kodu GitHub-a yükləyin, Vercel-də **Import Project** edin.
2. **Environment Variables** bölməsinə `NEXT_PUBLIC_SUPABASE_URL` və `NEXT_PUBLIC_SUPABASE_ANON_KEY` əlavə edin.
3. Deploy.

## Qovluq quruluşu
- `app/page.tsx` – ana səhifə (hero + bölmələr)
- `app/materials` – axtarış, filtr, yükləmə, bəyənmə, şikayət
- `app/upload` – PDF yükləmə (10 MB limit, giriş tələb olunur)
- `app/login` – qeydiyyat / giriş
- `components/ui/prisma-hero.tsx` – hero komponenti (shadcn `components/ui` yolu)
- `supabase/schema.sql` – verilənlər bazası sxemi

## Sonrakı addımlar
- Moderator paneli (şikayətlərə baxmaq üçün `reports` cədvəli hazırdır)
- Fənn səhifələri və universitet siyahısı
- Sınaq testlərinin interaktiv versiyası
- Şikayət sayı müəyyən həddi keçəndə materialı gizlətmək
