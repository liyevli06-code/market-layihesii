# UniShare

Next.js 14 + Tailwind + Supabase (Auth, DB, Storage) + Vercel.

## Quraşdırma
1. `npm install`
2. Supabase Dashboard → SQL Editor → `supabase/schema.sql` faylının məzmununu işə sal.
3. (Test üçün) Authentication → Providers → Email → "Confirm email" söndürülə bilər.
4. `npm run dev` → http://localhost:3000

## CLI (istəyə bağlı)
    supabase login
    supabase init
    supabase link --project-ref jvlpplrhsjmbzzqpmdcb
    supabase db push   # migrations istifadə etsən

## Vercel
Repo-nu GitHub-a at → vercel.com-da import et → Environment Variables:
NEXT_PUBLIC_SUPABASE_URL və NEXT_PUBLIC_SUPABASE_ANON_KEY (`.env.example`-dakı kimi).
Verilənlər bazası şifrəsini heç vaxt frontend koduna və ya repo-ya yazma.

## Gündəlik avtomatik sorğu (keep-alive)
Pulsuz Supabase layihəsi 7 gün sorğu almasa dayandırılır. `vercel.json` hər gün 06:00 UTC-də
`/api/keepalive` marşrutunu çağırır, o da bazaya sorğu göndərir.
İstəsən Vercel-də `CRON_SECRET` adlı dəyişən əlavə et (təsadüfi uzun mətn) ki, marşrutu kənar adam çağıra bilməsin.
Yoxlamaq üçün: `https://SAYTIN.vercel.app/api/keepalive`
