# Dokumentasi Project — Portofolio Adelya Fauzi Alfian

Dokumen ini menjelaskan **seluruh isi project** dari nol — anggap saja kamu belum
pernah lihat kodenya sama sekali. Tujuannya supaya kamu bisa membuka file mana
pun di project ini dan langsung tahu "oh ini ngapain" tanpa harus tanya lagi.

Kalau ada istilah yang belum familiar, jangan khawatir — tiap istilah baru
dijelaskan pas pertama kali muncul.

---

## Daftar Isi

1. [Ringkasan Teknologi yang Dipakai](#1-ringkasan-teknologi-yang-dipakai)
2. [Struktur Folder Project](#2-struktur-folder-project)
3. [Alur Data (Data Flow)](#3-alur-data-data-flow)
4. [Database Schema Dijelaskan](#4-database-schema-dijelaskan)
5. [Fitur Autentikasi Dijelaskan](#5-fitur-autentikasi-dijelaskan)
6. [Daftar Semua API Endpoint](#6-daftar-semua-api-endpoint)
7. [Fitur-Fitur yang Sudah Jadi (Checklist)](#7-fitur-fitur-yang-sudah-jadi-checklist)
8. [Cara Menjalankan Project dari Awal](#8-cara-menjalankan-project-dari-awal)

---

## 1. Ringkasan Teknologi yang Dipakai

Semua tools ini bisa dilihat daftarnya di file [`package.json`](package.json) —
itu semacam "daftar belanja" project: semua library yang di-install ada di
sana. Di bawah ini dijelaskan satu-satu, mana yang termasuk "dependencies"
(dipakai saat website berjalan/production) dan mana yang "devDependencies"
(cuma dipakai pas development, tidak ikut ke website final).

### Fondasi (Framework & Bahasa)

**Next.js** (`next`)
Framework untuk membangun website dengan React. Kalau React itu ibarat kumpulan
"komponen LEGO" untuk bikin tampilan, Next.js itu kotak perkakas lengkap di
sekitarnya: routing (mengatur halaman apa muncul di URL apa), render di server,
API, optimasi gambar, dan banyak lagi — semua sudah disiapkan, kamu tidak perlu
merakit sendiri dari nol.
**Dipakai untuk:** seluruh fondasi website ini. Project ini pakai versi
terbaru Next.js dengan sistem routing "App Router" — artinya struktur folder di
`src/app/` itu **langsung menentukan** URL halaman (dijelaskan lebih detail di
bagian 2).

**TypeScript**
JavaScript, tapi dengan "tipe data" yang ditulis eksplisit. Contoh: kalau kamu
bilang suatu variabel isinya harus angka, TypeScript akan menegur (di editor,
sebelum kode dijalankan) kalau kamu tidak sengaja mengisinya dengan teks. Ini
mengurangi bug yang baru ketahuan setelah website online.
**Dipakai untuk:** semua kode di project ini — file-nya berakhiran `.ts` (logic
biasa) atau `.tsx` (logic + tampilan React).

**Tailwind CSS**
Cara menulis CSS (styling tampilan) langsung lewat nama class pendek di HTML,
misalnya `text-lg font-bold text-accent` — tiap kata itu representasi satu
aturan CSS. Bedanya dengan CSS biasa: kamu tidak perlu bolak-balik ke file
`.css` terpisah, semua langsung kelihatan di komponennya.
**Dipakai untuk:** seluruh styling visual website ini — warna, jarak/spacing,
ukuran font, responsive (tampilan beda di HP vs desktop), dark mode, semuanya.
Warna-warna khusus project ini (biru muda di light mode, biru tua di dark
mode) didefinisikan sebagai "variabel warna" di
[`src/app/globals.css`](src/app/globals.css).

### Database & Data

**Prisma** (`@prisma/client`, `prisma`, `@prisma/adapter-pg`)
ORM — singkatan dari *Object-Relational Mapping*. Ibaratnya penerjemah antara
"bahasa kode" (JavaScript/TypeScript) dan "bahasa database" (SQL). Tanpa
Prisma, untuk ambil data project dari database kamu harus nulis query SQL
manual seperti `SELECT * FROM projects ORDER BY order ASC`. Dengan Prisma,
kamu cukup nulis `prisma.project.findMany({ orderBy: { order: "asc" } })` —
lebih mirip kode biasa, lebih susah salah ketik, dan editor bisa bantu
autocomplete.
**Dipakai untuk:** SEMUA operasi ke database di project ini — ambil data untuk
ditampilkan di halaman publik, simpan/edit/hapus data lewat dashboard admin,
sampai proses login. File [`prisma/schema.prisma`](prisma/schema.prisma)
mendefinisikan struktur tabelnya (dijelaskan detail di bagian 4), dan
[`src/lib/prisma.ts`](src/lib/prisma.ts) adalah tempat "koneksi" ke database
itu disiapkan supaya bisa dipakai di seluruh project.

**PostgreSQL** (lewat provider **Neon**)
Database sesungguhnya — tempat semua data (project, skill, pesan kontak, dst)
benar-benar disimpan secara permanen. PostgreSQL adalah "mesin" databasenya;
Neon adalah layanan cloud yang meng-host mesin itu untukmu (jadi kamu tidak
perlu install PostgreSQL sendiri di komputer). Neon versi gratis akan
"menidurkan" databasenya kalau tidak dipakai beberapa menit, lalu bangun lagi
otomatis begitu ada request — ini normal, cuma bikin request pertama agak
lebih lambat.
**Dipakai untuk:** menyimpan semua data website: achievements, projects,
skills, experience, blog post, pesan dari contact form, dan akun admin.

### Autentikasi (Login)

**NextAuth.js** (`next-auth`, versi 5 — sering ditulis "Auth.js")
Library untuk mengurus proses login/logout dan menjaga status "siapa yang
sedang login" di seluruh website, tanpa kamu perlu bikin sistem login dari
nol (yang sebenarnya cukup rumit dan gampang salah dari sisi keamanan).
**Dipakai untuk:** login dashboard admin (satu akun admin, bukan multi-user).
Detail lengkap cara kerjanya ada di bagian 5.

**bcryptjs**
Library untuk **hashing** password — mengubah password asli jadi kumpulan
karakter acak yang searah (tidak bisa dibalik ke password asli). Jadi kalau
suatu saat database bocor, orang jahat tetap tidak bisa lihat password asli
kamu.
**Dipakai untuk:** menyimpan password admin dengan aman di database (field
`passwordHash` di model `User`), dan mencocokkan password yang kamu ketik saat
login dengan hash yang tersimpan.

### Komunikasi & Konten

**Resend**
Layanan pengiriman email lewat API (kirim email dari kode, bukan dari aplikasi
email biasa).
**Dipakai untuk:** mengirim notifikasi email ke kamu setiap kali ada pengunjung
mengisi contact form di halaman publik. Lihat
[`src/app/api/contact/route.ts`](src/app/api/contact/route.ts).

**marked**
Library kecil untuk mengubah teks **Markdown** (format teks sederhana pakai
simbol seperti `# Judul`, `**tebal**`, `- daftar`) menjadi HTML yang bisa
ditampilkan browser.
**Dipakai untuk:** menulis isi artikel blog di dashboard admin dalam format
Markdown, lalu ditampilkan sebagai halaman artikel yang rapi di sisi publik.

### Tampilan & Pengalaman Pengguna

**Framer Motion**
Library animasi untuk React — mengatur elemen muncul dengan fade-in, geser,
scale, dan sejenisnya, termasuk animasi yang baru jalan begitu elemennya
terlihat saat di-scroll ("scroll-triggered").
**Dipakai untuk:** hampir semua animasi di website ini — teks Hero yang muncul
bertahap, kartu-kartu yang fade-in saat di-scroll, carousel Projects yang bisa
digeser, tombol "kembali ke atas", garis progress scroll di bagian atas
halaman, dan animasi angka yang menghitung naik di bagian Achievements.

**next-themes**
Library kecil khusus untuk mengatur **dark mode / light mode** di Next.js —
termasuk mengingat pilihan pengguna dan menghindari "kedipan" warna salah
sesaat sebelum halaman selesai dimuat.
**Dipakai untuk:** tombol ganti tema di navbar (ikon matahari/bulan), dan
memastikan tema yang dipilih konsisten dipakai sampai halaman ganti.

**next-intl**
Library untuk multi-bahasa (i18n = *internationalization*) khusus Next.js.
**Dipakai untuk:** dua bahasa website ini — Inggris (default) dan Indonesia.
Semua teks pendek (label tombol, judul section, dll) disimpan di
[`src/messages/en.json`](src/messages/en.json) dan
[`src/messages/id.json`](src/messages/id.json). URL-nya otomatis dapat awalan
`/en` atau `/id` (contoh: `/en/blog/judul-artikel`).

**@vercel/analytics**
Modul kecil dari Vercel untuk mencatat statistik pengunjung (jumlah kunjungan,
halaman populer, device, dll) saat website di-deploy ke Vercel.
**Dipakai untuk:** komponen `<Analytics />` yang dipasang sekali di layout
utama ([`src/app/[locale]/layout.tsx`](src/app/[locale]/layout.tsx)) — tidak
melakukan apa-apa kalau dijalankan di luar Vercel (aman untuk development).

### Validasi Data

**Zod**
Library untuk mendefinisikan "bentuk data yang valid" dan otomatis
menolak/melaporkan data yang tidak sesuai — misalnya field `email` harus
format email, field `year` harus angka antara 2000–2100, dst.
**Dipakai untuk:** memvalidasi semua data yang masuk lewat API — baik dari
form contact publik maupun dari form-form di dashboard admin — sebelum data
itu disimpan ke database. Semua aturan validasinya terkumpul di satu file:
[`src/lib/validation.ts`](src/lib/validation.ts).

### Tools Development (Tidak Ikut ke Website Final)

Ini semua ada di `devDependencies` — dipakai pas kamu ngoding, tapi tidak
"ikut terbawa" ke website yang sudah online.

| Tool | Fungsinya |
|---|---|
| `@tailwindcss/postcss` | "Mesin" yang memproses class Tailwind jadi CSS asli. |
| `@tailwindcss/typography` | Preset styling otomatis untuk teks artikel blog yang panjang (dari Markdown), supaya heading/paragraf/list-nya rapi tanpa perlu styling manual satu-satu. |
| `@types/node`, `@types/react`, `@types/react-dom` | "Kamus" tipe data untuk Node.js/React, supaya TypeScript paham dan bisa mengecek kode yang memakai fitur-fitur bawaan itu. |
| `dotenv` | Membaca file `.env.local` (berisi data rahasia seperti password database) supaya bisa dipakai script di luar Next.js, contohnya script `seed` dan `create-admin`. |
| `eslint`, `eslint-config-next` | "Pemeriksa gaya kode" — mendeteksi pola kode yang berpotensi bug atau tidak konsisten, sebelum kamu commit. |
| `tsx` | Menjalankan file TypeScript langsung dari terminal (dipakai untuk script seperti `prisma/seed.ts`). |
| `typescript` | Compiler TypeScript itu sendiri. |

---

## 2. Struktur Folder Project

Ini peta besar folder-folder utamanya. Yang paling penting untuk kamu pahami
lebih dulu ditandai dengan ⭐.

```
portofolio/
├── prisma/                      ⭐ Semua yang berhubungan dengan database
│   ├── schema.prisma            ⭐ Definisi struktur tabel database (bagian 4)
│   ├── migrations/                Riwayat perubahan struktur database
│   ├── seed.ts                    Script isi data awal (contoh: prestasi, project)
│   ├── skills.ts                  Daftar skill yang dipakai seed & sync-skills.ts
│   └── projects-demo.ts           Dua project contoh (Sellsonar, StockScan)
│
├── public/                        File statis yang bisa diakses langsung lewat URL
│   ├── images/                    Foto profil, screenshot project
│   └── *.svg                      Ikon-ikon bawaan Next.js
│
├── scripts/                        Script yang dijalankan manual lewat terminal
│   ├── create-admin.ts            Bikin akun admin pertama kali
│   └── sync-skills.ts             Sinkronkan tabel skills ke isi prisma/skills.ts
│
├── src/
│   ├── app/                     ⭐ Routing halaman (App Router Next.js — lihat di bawah)
│   ├── components/              ⭐ Komponen UI yang dipakai berulang
│   │   ├── sections/               Satu file per section halaman utama (Hero, About, dst)
│   │   ├── motion/                 Komponen pembungkus animasi (Framer Motion)
│   │   └── admin/                  Komponen kecil khusus dashboard admin
│   ├── lib/                     ⭐ Kode logic/utility yang dipakai di banyak tempat
│   ├── hooks/                      Custom React hook (logic yang bisa dipakai ulang)
│   ├── i18n/                       Konfigurasi multi-bahasa (next-intl)
│   ├── messages/                   Teks-teks pendek dalam 2 bahasa (en.json, id.json)
│   ├── types/                      Tipe TypeScript tambahan
│   ├── generated/prisma/           Kode yang di-generate otomatis oleh Prisma (JANGAN diedit manual)
│   ├── auth.ts                  ⭐ Konfigurasi NextAuth.js (bagian 5)
│   └── proxy.ts                 ⭐ Middleware — jalan di SETIAP request (bagian 5)
│
├── .env.local                     Data rahasia (password database, dll) — TIDAK di-commit ke git
├── .env.example                   Contoh isi .env.local, aman di-commit (tanpa data asli)
└── package.json                   Daftar dependency + perintah npm (bagian 1 & 8)
```

### Isi `src/app/` — Peta Routing

Next.js App Router itu aturannya sederhana: **nama folder di dalam `src/app/`
= bagian dari URL**, dan file `page.tsx` di dalamnya = halaman yang tampil di
URL itu.

```
src/app/
├── [locale]/                    Folder "dinamis" — [locale] jadi /en atau /id
│   ├── page.tsx                 Halaman utama (semua section jadi satu: Hero, About, dst)
│   ├── layout.tsx               Kerangka halaman publik (Navbar, Footer, dll)
│   ├── blog/[slug]/page.tsx     Halaman detail SATU artikel blog
│   ├── not-found.tsx            Tampilan halaman 404 (khusus di dalam /en atau /id)
│   ├── error.tsx                Tampilan kalau ada error saat ambil data
│   └── opengraph-image.tsx      Gambar preview otomatis saat link di-share ke medsos
│
├── admin/                       Semua halaman dashboard admin
│   ├── login/                   Halaman login admin
│   └── (dashboard)/             Folder "group" — tidak muncul di URL, cuma pengelompokan
│       ├── layout.tsx           Kerangka dashboard (sidebar menu)
│       ├── page.tsx             Halaman utama dashboard (ringkasan jumlah data)
│       ├── projects/, skills/, achievements/, experience/, blog/
│       │                        Masing-masing: halaman daftar + form tambah/edit
│       └── messages/            Kotak masuk pesan dari contact form
│
├── api/                         Semua API endpoint (backend) — detail di bagian 6
│   ├── projects/, skills/, achievements/, experience/, blog/
│   ├── contact/                 Endpoint contact form
│   └── auth/[...nextauth]/      Endpoint login/logout (dikelola otomatis oleh NextAuth.js)
│
├── globals.css                  Warna tema, style dasar seluruh website
├── sitemap.ts                   Generate file sitemap.xml otomatis (untuk SEO)
└── robots.ts                    Generate file robots.txt otomatis (untuk SEO)
```

**Kenapa ada dua folder mirip, `[locale]` dan `admin`, yang terpisah?**
Karena halaman publik butuh dukungan 2 bahasa (makanya dibungkus `[locale]`),
sedangkan dashboard admin cuma untuk kamu sendiri, jadi tidak perlu
multi-bahasa — dia berdiri sendiri di `src/app/admin/`.

---

## 3. Alur Data (Data Flow)

### a. Pengunjung buka halaman utama

1. Pengunjung buka `namadomain.com` → otomatis diarahkan ke `/en` (bahasa
   default) oleh **middleware** ([`src/proxy.ts`](src/proxy.ts)) — file ini
   jalan duluan sebelum halaman mana pun diproses.
2. Next.js menjalankan [`src/app/[locale]/page.tsx`](src/app/[locale]/page.tsx).
   File ini adalah **Server Component** — artinya kodenya jalan di server
   (bukan di browser pengunjung), jadi dia bisa langsung `import { prisma }`
   dan query database tanpa perlu bikin API terpisah untuk dirinya sendiri.
3. Halaman ini memanggil tiap komponen section (`<Projects />`, `<Skills />`,
   dst dari `src/components/sections/`). Masing-masing section juga Server
   Component, dan **masing-masing query database-nya sendiri** — misalnya
   [`Projects.tsx`](src/components/sections/Projects.tsx) menjalankan
   `prisma.project.findMany(...)` untuk ambil semua project, diurutkan sesuai
   field `order`.
4. Prisma menerjemahkan itu jadi query SQL, dikirim ke database PostgreSQL di
   Neon, hasilnya balik ke Prisma dalam bentuk array of object JavaScript.
5. Data itu langsung dipakai untuk merender HTML — tiap project jadi satu
   kartu di section Projects, lengkap dengan judul, deskripsi (Inggris atau
   Indonesia sesuai `[locale]` di URL), gambar preview, dan tags.
6. HTML yang sudah jadi (lengkap dengan datanya) dikirim ke browser
   pengunjung. Karena section-section ini query langsung ke database, halaman
   utama ditandai `export const dynamic = "force-dynamic"` — artinya dia
   selalu di-generate ulang tiap kali diakses (tidak di-cache statis), supaya
   perubahan data lewat dashboard admin langsung kelihatan.

**Singkatnya:** Database → Prisma → Server Component (section) → HTML → Browser.
Tidak ada "API call" terpisah untuk data ini — Server Component-nya sendiri
yang jadi jembatan ke database.

### b. Kamu (admin) login lalu tambah project baru

1. Kamu buka `/admin/login`, isi email + password, klik submit.
2. Form ini memanggil **Server Action** `loginAction` (di
   [`src/app/admin/login/actions.ts`](src/app/admin/login/actions.ts)) — cara
   Next.js menjalankan fungsi di server langsung dari form, tanpa kamu perlu
   bikin API endpoint manual untuk itu.
3. `loginAction` memanggil `signIn("credentials", ...)` dari NextAuth.js, yang
   akan mencocokkan email + password ke tabel `User` di database (pakai
   bcrypt untuk mencocokkan password, dijelaskan detail di bagian 5).
4. Kalau cocok, NextAuth.js bikin **session** (dibahas di bagian 5) dan kamu
   diarahkan ke `/admin`.
5. Kamu buka `/admin/projects/new`, isi form (judul, deskripsi EN & ID, tags,
   URL gambar, dst), klik Save.
6. Form ini (komponen client, `ProjectForm.tsx`) mengirim data itu lewat
   `fetch()` sebagai request `POST` ke `/api/projects`.
7. Endpoint API itu ([`src/app/api/projects/route.ts`](src/app/api/projects/route.ts)):
   - Cek dulu apakah kamu benar-benar sedang login (`requireAdmin()`) — kalau
     tidak, ditolak dengan status 401.
   - Validasi bentuk datanya pakai Zod (`projectSchema`) — kalau ada field
     yang salah format (misalnya slug pakai huruf besar), ditolak dengan
     pesan error yang jelas.
   - Kalau valid, panggil `prisma.project.create({ data: ... })` — Prisma
     kirim `INSERT` ke database.
8. Data baru itu sekarang **sudah ada di database**. Dashboard admin
   redirect balik ke `/admin/projects` dan me-refresh datanya (jadi kamu
   langsung lihat project barumu di daftar).
9. Begitu ada pengunjung baru buka halaman utama (`/en` atau `/id`), skenario
   (a) di atas jalan lagi dari awal — dan karena halamannya `force-dynamic`,
   project barumu otomatis ikut muncul, tanpa perlu deploy ulang apa pun.

### c. Pengunjung isi contact form

1. Pengunjung isi nama, email, pesan di section Contact, klik Send.
2. Komponen [`ContactForm.tsx`](src/components/sections/ContactForm.tsx)
   (client component) mengirim data itu lewat `fetch()` sebagai `POST` ke
   `/api/contact`.
3. Endpoint [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts):
   - Validasi data pakai Zod (`contactSchema`) — nama tidak boleh kosong,
     email harus format email valid, pesan maksimal 5000 karakter.
   - Simpan pesan itu ke tabel `Message` di database lewat
     `prisma.message.create(...)` — **ini terjadi duluan**, jadi pesannya
     aman tersimpan meski langkah berikutnya (kirim email) gagal.
   - Kalau `RESEND_API_KEY` dan `CONTACT_EMAIL` sudah diisi di `.env.local`,
     endpoint ini memanggil Resend untuk mengirim email notifikasi ke alamat
     emailmu, isinya nama + email pengirim + pesannya.
4. Kamu menerima email notifikasi di inbox-mu. Kalau pengiriman emailnya
   gagal karena suatu sebab (misalnya API key salah), pesannya **tetap
   tersimpan** di database — kamu masih bisa baca semua pesan masuk lewat
   `/admin/messages`, jadi tidak ada pesan yang benar-benar hilang.

---

## 4. Database Schema Dijelaskan

Semua model (istilah Prisma untuk "tabel") ada di
[`prisma/schema.prisma`](prisma/schema.prisma). Tidak ada satu model pun yang
punya relasi eksplisit ke model lain (tidak ada foreign key) — semuanya
berdiri sendiri-sendiri, jadi kamu bisa baca satu per satu tanpa harus lompat
ke tabel lain.

### `User` — Akun Admin

Menyimpan akun admin untuk login ke dashboard. Cuma dipakai satu akun (bukan
sistem multi-user).

| Field | Isi |
|---|---|
| `id` | ID unik otomatis (dibuat Prisma) |
| `email` | Email untuk login |
| `passwordHash` | Password yang **sudah di-hash** (bukan password asli — lihat bagian 5) |
| `createdAt` | Kapan akun ini dibuat |

### `Achievement` — Prestasi/Penghargaan

> Catatan: model ini masih ada di database untuk keperluan admin, tapi
> **sudah tidak ditampilkan di halaman publik** — lihat bagian 7 "Perlu
> Perhatian".

| Field | Isi |
|---|---|
| `title` | Nama pencapaian, misalnya "1st Place, National" |
| `level` | Tingkat: `NATIONAL`, `PROVINCIAL`, atau `CITY` (pilihan tetap, bukan teks bebas) |
| `competition` | Nama kompetisinya |
| `year` | Tahun dicapai |
| `order` | Angka urutan tampil (makin kecil, makin duluan) |

### `Project` — Portofolio Karya

Project-project yang ditampilkan di section "Featured Projects".

| Field | Isi |
|---|---|
| `title` | Nama project |
| `slug` | Versi URL-friendly dari judul (huruf kecil + tanda hubung), **harus unik** |
| `descriptionEn` / `descriptionId` | Deskripsi dalam dua bahasa |
| `imageUrl` | Link gambar preview (boleh kosong → tampil placeholder) |
| `tags` | Daftar teknologi yang dipakai, disimpan sebagai array teks |
| `demoUrl` / `repoUrl` | Link demo langsung / kode sumber (boleh kosong) |
| `featured` | Kalau `true`, dapat badge "Featured" di kartunya |
| `order` | Urutan tampil |
| `createdAt` / `updatedAt` | Dicatat otomatis oleh Prisma |

### `Skill` — Daftar Keahlian

| Field | Isi |
|---|---|
| `name` | Nama skill, misalnya "Docker" |
| `category` | Kategori pengelompokan, misalnya "DevOps & Infrastructure" |
| `level` | `BASIC` / `INTERMEDIATE` / `ADVANCED` — kolom ini masih ada tapi **tidak ditampilkan** di halaman publik (skill tampil sebagai chip/badge polos tanpa indikator level) |
| `order` | Urutan tampil dalam satu kategori |

### `Experience` — Pengalaman/Perjalanan

| Field | Isi |
|---|---|
| `title` | Judul pengalaman |
| `organization` | Nama organisasi/kompetisi/institusi |
| `descriptionEn` / `descriptionId` | Deskripsi dua bahasa |
| `date` | Teks bebas untuk rentang tanggal, misalnya "Feb 2026 — Present" (bukan tipe tanggal asli, jadi fleksibel formatnya) |
| `order` | Urutan tampil |

### `BlogPost` — Artikel Blog

Model ini paling kompleks karena mendukung dua jenis artikel sekaligus.

| Field | Isi |
|---|---|
| `title` | Judul artikel |
| `slug` | Untuk URL `/blog/slug-ini`, harus unik |
| `sourceType` | `ORIGINAL` (tulisan sendiri) atau `EXTERNAL` (link ke artikel di situs lain) |
| `content` | Isi artikel dalam Markdown — **boleh kosong** kalau `sourceType` EXTERNAL |
| `externalUrl` | Link ke artikel aslinya — **wajib diisi** kalau `sourceType` EXTERNAL |
| `excerpt` | Ringkasan singkat, tampil di kartu preview |
| `coverImage` | Gambar sampul (boleh kosong → placeholder) |
| `published` | Kalau `false`, artikel tersimpan sebagai draft dan **tidak muncul** di halaman publik |
| `publishedAt` | Tanggal publikasi yang ditampilkan |
| `tags` | Daftar tag |
| `createdAt` / `updatedAt` | Otomatis dicatat Prisma |

**Aturan khusus:** kalau `sourceType` = `ORIGINAL`, klik kartunya membuka
halaman detail di website sendiri (`/blog/slug`). Kalau `sourceType` =
`EXTERNAL`, klik kartunya langsung membuka `externalUrl` di tab baru.

### `Message` — Pesan dari Contact Form

| Field | Isi |
|---|---|
| `name` / `email` / `message` | Isi form yang dikirim pengunjung |
| `read` | Sudah kamu baca di dashboard atau belum (default `false`) |
| `createdAt` | Waktu pesan masuk |

---

## 5. Fitur Autentikasi Dijelaskan

Sistem login di project ini pakai **NextAuth.js v5** dengan strategi
**Credentials** (email + password biasa, bukan login lewat Google/GitHub dll).

### Bagaimana password disimpan

Password **tidak pernah** disimpan sebagai teks asli di database. Saat akun
admin dibuat (lewat script `scripts/create-admin.ts`), password yang kamu
ketik langsung diubah jadi **hash** pakai `bcrypt` sebelum disimpan ke kolom
`passwordHash` di tabel `User`.

Hash itu satu arah — tidak bisa "dibalik" untuk tahu password aslinya. Cara
verifikasinya, saat kamu login, password yang kamu ketik di-hash lagi lalu
dibandingkan dengan hash yang tersimpan (`bcrypt.compare(...)` di
[`src/auth.ts`](src/auth.ts)). Kalau hasil hash-nya cocok, berarti passwordnya
benar — meski sistem sendiri tidak pernah "tahu" apa password aslimu.

### Bagaimana sistem tahu kamu sudah login (session)

Setelah login berhasil, NextAuth.js membuat **JWT** (*JSON Web Token* — semacam
"kartu identitas" digital terenkripsi) dan menyimpannya di **cookie** di
browser kamu. Konfigurasinya ada di [`src/auth.ts`](src/auth.ts):
`session: { strategy: "jwt" }`.

Setiap kali kamu buka halaman `/admin/*` atau memanggil API yang butuh login,
cookie ini otomatis ikut terkirim, dan sistem bisa membacanya untuk tahu
"oh, ini request dari admin yang sudah login" — tanpa kamu perlu login ulang
tiap pindah halaman. Cookie ini dienkripsi pakai `NEXTAUTH_SECRET` (dari
`.env.local`) — makanya secret ini **harus rahasia** dan **beda** antara
development dan production.

### Bagaimana `/admin` diproteksi

Ada dua lapis perlindungan:

1. **Middleware** ([`src/proxy.ts`](src/proxy.ts)) — kode ini jalan otomatis
   di **setiap** request sebelum mencapai halaman manapun. Untuk request ke
   `/admin/*` (kecuali `/admin/login` itu sendiri), dia cek `req.auth` — kalau
   kosong (belum login), pengunjung langsung di-**redirect** ke
   `/admin/login` sebelum sempat melihat isi halaman apa pun.
2. **`requireAdmin()`** ([`src/lib/auth-guard.ts`](src/lib/auth-guard.ts)) —
   lapis kedua khusus untuk API (`/api/*`). Setiap endpoint yang mengubah data
   (POST/PUT/DELETE) memanggil fungsi ini di awal; kalau tidak ada session
   valid, request ditolak dengan status **401 Unauthorized** — jadi meski
   seseorang entah bagaimana langsung memanggil API tanpa lewat halaman
   dashboard, tetap tidak bisa mengubah data tanpa login.

Endpoint `GET` (baca data) untuk achievements/projects/skills/experience/blog
**sengaja tidak diproteksi** — karena data itu memang untuk ditampilkan ke
publik. Yang diproteksi hanya operasi tulis (create/update/delete).

---

## 6. Daftar Semua API Endpoint

Semua endpoint di bawah ini ada di `src/app/api/`. "Protected" artinya wajib
login admin (lewat `requireAdmin()`), "Publik" artinya bisa diakses siapa
saja.

| Method | Path | Fungsi | Akses |
|---|---|---|---|
| GET | `/api/achievements` | Ambil semua data achievement | Publik |
| POST | `/api/achievements` | Tambah achievement baru | 🔒 Protected |
| GET | `/api/achievements/[id]` | Ambil satu achievement by ID | Publik |
| PUT | `/api/achievements/[id]` | Update satu achievement | 🔒 Protected |
| DELETE | `/api/achievements/[id]` | Hapus satu achievement | 🔒 Protected |
| GET | `/api/projects` | Ambil semua data project | Publik |
| POST | `/api/projects` | Tambah project baru | 🔒 Protected |
| GET | `/api/projects/[slug]` | Ambil satu project by slug | Publik |
| PUT | `/api/projects/[slug]` | Update satu project | 🔒 Protected |
| DELETE | `/api/projects/[slug]` | Hapus satu project | 🔒 Protected |
| GET | `/api/skills` | Ambil semua data skill | Publik |
| POST | `/api/skills` | Tambah skill baru | 🔒 Protected |
| GET | `/api/skills/[id]` | Ambil satu skill by ID | Publik |
| PUT | `/api/skills/[id]` | Update satu skill | 🔒 Protected |
| DELETE | `/api/skills/[id]` | Hapus satu skill | 🔒 Protected |
| GET | `/api/experience` | Ambil semua data experience | Publik |
| POST | `/api/experience` | Tambah experience baru | 🔒 Protected |
| GET | `/api/experience/[id]` | Ambil satu experience by ID | Publik |
| PUT | `/api/experience/[id]` | Update satu experience | 🔒 Protected |
| DELETE | `/api/experience/[id]` | Hapus satu experience | 🔒 Protected |
| GET | `/api/blog` | Ambil semua post blog (termasuk draft) | Publik* |
| POST | `/api/blog` | Tambah post blog baru | 🔒 Protected |
| GET | `/api/blog/[slug]` | Ambil satu post by slug | Publik |
| PUT | `/api/blog/[slug]` | Update satu post | 🔒 Protected |
| DELETE | `/api/blog/[slug]` | Hapus satu post | 🔒 Protected |
| POST | `/api/contact` | Kirim pesan dari contact form + trigger email notifikasi | Publik |
| * / GET/POST | `/api/auth/[...nextauth]` | Endpoint login/logout/session, dikelola otomatis oleh NextAuth.js (bukan kode yang kamu tulis manual) | — |

\* `GET /api/blog` sebenarnya tidak dibatasi login di kodenya, tapi tidak
dipakai halaman publik mana pun (halaman publik query langsung lewat Prisma
di Server Component, bukan lewat endpoint ini) — endpoint ini murni sisa dari
pola "REST API lengkap" yang konsisten untuk semua model, dan bisa dipakai
kalau suatu saat kamu butuh akses programatik ke daftar post.

---

## 7. Fitur-Fitur yang Sudah Jadi (Checklist)

### Halaman Publik

- [x] Halaman utama satu-scroll: Hero, About, Projects, Skills, Experience, Blog, Contact
- [x] Navbar sticky dengan smooth-scroll ke tiap section + highlight menu aktif
- [x] Dark mode / light mode dengan warna tema khusus (biru muda ↔ biru tua)
- [x] Dua bahasa penuh: Inggris (default) dan Indonesia, lewat `/en` dan `/id`
- [x] Foto profil dengan mekanisme anti-cache (`?v=<waktu-modifikasi-file>`) — supaya kalau foto diganti, browser tidak menampilkan foto lama dari cache
- [x] Carousel (bisa digeser + tombol panah) untuk section Projects
- [x] Preview project bergaya "jendela browser mini" dengan gambar screenshot
- [x] Blog: mendukung artikel tulisan sendiri (halaman detail + Markdown) dan artikel eksternal (klik → buka link luar di tab baru)
- [x] Thumbnail cover image di kartu blog, dengan placeholder rapi kalau kosong
- [x] Contact form fungsional, tersimpan ke database + kirim email notifikasi
- [x] Animasi scroll-reveal, staggered animation, tombol "kembali ke atas", garis progress scroll
- [x] SEO dasar: metadata per halaman, Open Graph image otomatis, `sitemap.xml`, `robots.txt`

### Dashboard Admin (`/admin`)

- [x] Halaman overview dengan ringkasan jumlah data tiap kategori
- [x] CRUD (Create, Read, Update, Delete) lengkap untuk: Projects, Skills, Achievements, Experience, Blog Post
- [x] Kotak masuk pesan contact form, dengan status "sudah dibaca / belum" dan badge jumlah pesan belum dibaca di sidebar
- [x] Form blog dengan mode Write/Preview untuk Markdown, dan toggle Original/External
- [x] Pesan error yang jelas kalau input salah (bukan cuma "terjadi kesalahan"), termasuk kasus khusus sesi login kedaluwarsa

### Autentikasi

- [x] Login admin dengan email + password (satu akun)
- [x] Password di-hash pakai bcrypt, tidak pernah disimpan mentah
- [x] Session berbasis JWT tersimpan di cookie
- [x] Halaman `/admin/*` dan endpoint API yang mengubah data terproteksi dari akses tanpa login

### Database

- [x] 7 model: User, Achievement, Project, Skill, Experience, BlogPost, Message
- [x] Migrasi database tercatat rapi di `prisma/migrations/`
- [x] Script seed data awal (`prisma/seed.ts`) dan script sinkronisasi skill terpisah (`scripts/sync-skills.ts`) yang tidak menghapus data lain

### Lain-lain

- [x] Vercel Analytics terpasang (aktif otomatis begitu di-deploy ke Vercel)
- [x] Koneksi database dibuat tahan terhadap Neon yang "tidur" karena idle (lihat catatan di `src/lib/prisma.ts`)

### ⚠️ Perlu Perhatian

- **Model `Achievement` sudah tidak tampil di halaman publik.** Section
  "Achievements" sudah dihapus dari halaman utama — datanya digabung secara
  konsep ke section Experience (kamu menulis manual info prestasi sebagai
  entri Experience). Tabel `Achievement` dan dashboard CRUD-nya
  (`/admin/achievements`) **masih ada dan masih berfungsi**, tapi sekarang
  jadi "yatim" — tidak dipakai/ditampilkan di mana pun di sisi publik. Kalau
  memang sudah tidak dipakai lagi, ini kandidat untuk dihapus total di masa
  depan (model, API, dan halaman adminnya).
- **Skill tag `Kulkul` (project asli kamu) belum ada tags-nya** — sengaja
  dikosongkan waktu deskripsinya diperbarui karena tag lama (Terraform/AWS,
  sisa dari data project lain) jelas salah untuk project manajemen
  ekstrakurikuler. Isi manual lewat `/admin/projects`.
- **`GET /api/blog` publik tanpa filter `published`** — endpoint ini
  mengembalikan **semua** post termasuk draft kalau dipanggil langsung. Ini
  tidak masalah untuk sekarang karena tidak ada halaman publik yang
  memanggilnya, tapi kalau nanti endpoint ini dipakai untuk sesuatu yang
  publik (misal integrasi eksternal), perlu ditambah filter
  `where: { published: true }` seperti yang sudah dilakukan di query Server
  Component-nya.
- **Link sosial media masih placeholder.** Lihat
  [`src/lib/site-config.ts`](src/lib/site-config.ts) — field `github` dan
  `linkedin` sudah diisi URL asli, tapi selalu cek file ini kalau ada
  perubahan akun.
- **Endpoint `/api/blog` (GET semua) dan `DELETE`/`PUT` di semua model** tidak
  punya rate-limiting atau proteksi tambahan selain cek login — untuk
  portofolio pribadi skala kecil ini wajar dan tidak mendesak, tapi baik
  untuk diketahui.

---

## 8. Cara Menjalankan Project dari Awal

Panduan ini untuk situasi: kamu buka lagi project ini di komputer baru, atau
sudah lama tidak disentuh.

### Langkah 1 — Install semua dependency

```bash
npm install
```

Ini membaca `package.json` dan men-download semua library yang dibutuhkan ke
folder `node_modules/`. Perintah ini juga otomatis menjalankan
`prisma generate` (lihat `"postinstall"` di `package.json`) — proses yang
membuat kode TypeScript hasil generate dari `schema.prisma`, supaya Prisma
tahu bentuk tabel-tabel di database dan bisa memberi autocomplete + type
checking saat kamu menulis query.

### Langkah 2 — Siapkan file `.env.local`

Kalau belum ada, salin dari contoh:

```bash
cp .env.example .env.local
```

Lalu isi nilainya di `.env.local`:

| Variabel | Isi dengan |
|---|---|
| `DATABASE_URL` | Connection string database PostgreSQL (dari Neon — pakai yang endpoint **pooled**, biasanya ada `-pooler` di hostname-nya, supaya koneksi lebih tahan banting) |
| `RESEND_API_KEY` | API key dari resend.com (untuk email notifikasi contact form) |
| `CONTACT_EMAIL` | Email tujuan notifikasi contact form |
| `NEXTAUTH_SECRET` | String acak untuk enkripsi session — generate dengan `npx auth secret` |
| `NEXTAUTH_URL` | `http://localhost:3000` untuk development lokal |
| `NEXT_PUBLIC_SITE_URL` | Boleh sama dengan `NEXTAUTH_URL` untuk lokal |

`.env.local` **tidak pernah di-commit ke git** (sudah ada di `.gitignore`) —
jadi file ini harus kamu isi ulang setiap kali kerja di komputer baru.

### Langkah 3 — Pastikan struktur database sudah sesuai

Kalau database-nya sudah pernah dipakai sebelumnya (kasus kamu, karena Neon-nya
sama), biasanya tidak perlu apa-apa lagi. Untuk mengecek apakah ada migrasi
yang belum diterapkan:

```bash
npx prisma migrate status
```

Kalau ada migrasi baru yang belum jalan, terapkan dengan:

```bash
npx prisma migrate deploy
```

Kalau ini **database baru yang masih kosong sama sekali**, jalankan migrasi
dari awal sekaligus isi data contoh:

```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### Langkah 4 — Buat akun admin (kalau belum ada)

```bash
ADMIN_EMAIL="emailmu@example.com" ADMIN_PASSWORD="passwordkuat" npx tsx scripts/create-admin.ts
```

Kalau akunnya sudah ada (misalnya kamu sudah pernah membuatnya), langkah ini
bisa dilewati.

### Langkah 5 — Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:3000` di browser — otomatis redirect ke
`http://localhost:3000/en`. Dashboard admin ada di
`http://localhost:3000/admin/login`.

### Kalau nanti mau deploy ke Vercel

Checklist environment variable dan langkah deploy lengkap sudah ada di file
terpisah: [`DEPLOY.md`](DEPLOY.md).

---

## Kalau Suatu Saat Ada Error "Server has closed the connection" / P1017

Ini bukan bug di kode — Neon (versi gratis) "menidurkan" database kalau tidak
dipakai beberapa menit, dan koneksi lama yang tersimpan jadi tidak valid lagi.
Perbaikannya:

1. Pastikan `DATABASE_URL` di `.env.local` pakai endpoint **pooled** (ada
   `-pooler` di hostname-nya).
2. Restart `npm run dev` (matikan dengan `Ctrl+C`, jalankan lagi) — koneksi
   database dibuat sekali saat server pertama kali jalan, jadi perubahan
   `.env.local` baru kepakai setelah restart.
