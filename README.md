<div align="center">

# 📺 TV Diskopdag — Real-Time Lobby Digital Signage

**Sistem Informasi Layar Lobi Berbasis Web yang Ringan, Real-Time, dan Multi-Admin**

[![Live TV](https://img.shields.io/badge/Live_TV-Buka_Layar-10B981?style=for-the-badge&logo=googlechrome&logoColor=white)](https://zerneva.github.io/tv-diskopdag/)
[![Admin Panel](https://img.shields.io/badge/Admin_Panel-Dashboard-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://zerneva.github.io/tv-diskopdag/admin.html)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![SheetJS](https://img.shields.io/badge/SheetJS-217346?style=flat-square&logo=microsoftexcel&logoColor=white)

</div>

---

## 📖 Tentang Proyek

**TV Diskopdag** adalah aplikasi *Web-Based Digital Signage* yang mengubah TV lobi kantor menjadi pusat informasi publik yang dinamis dan selalu terbarui. 

Dirancang dengan arsitektur **Zero-Build** (tanpa perlu server fisik atau proses *compile* yang rumit), aplikasi ini memungkinkan banyak admin mengunggah poster kegiatan maupun data tabel Excel (`.xlsx` / `.csv`) dari jarak jauh—baik lewat laptop maupun ponsel—dan menayangkannya secara **instan (0 detik)** ke layar TV di lobi kantor.

---

## ✨ Fitur Utama

### 🖥️ Layar TV Lobi (`index.html`)
* **Full-Screen Single View:** Tata letak layar penuh anti-silau (*Dark Mode*) yang dirancang agar mudah dibaca tamu dari jarak 3–4 meter.
* **Zero-Second Real-Time Sync:** Terhubung langsung ke *Supabase Realtime (WebSocket)*. Setiap penambahan konten atau perubahan data langsung tampil di TV tanpa *refresh* manual.
* **Smart Excel Auto-Pagination:** File Excel yang diunggah otomatis diubah menjadi tabel beresolusi tinggi dan dipecah per 8 baris secara bergantian agar ukuran huruf tetap besar dan terbaca jelas.
* **Smart Image Framing:** Poster vertikal (ukuran layar HP) otomatis ditampilkan utuh di tengah dengan efek *blur* latar belakang yang estetis tanpa ruang hitam kosong.
* **Offline Fallback (`localStorage`):** Jika koneksi internet kantor terputus sementara, TV tetap memutar *playlist* terakhir yang tersimpan di memori browser tanpa menampilkan layar error.

### 🎛️ Dashboard Multi-Admin (`admin.html`)
* **Pin Live Takeover (Mode Prioritas):** Kunci layar TV pada satu informasi penting (seperti penyambutan tamu VIP atau pemantauan data harian) hanya dengan satu klik.
* **Quick Update Excel:** Perbarui angka pada tabel Excel yang sedang tayang tanpa perlu membuat ulang slide atau mengatur ulang jadwal.
* **Auto-Scheduling:** Atur tanggal mulai dan tanggal berakhir tayang; konten kedaluwarsa otomatis turun dari layar tanpa perlu dihapus manual.
* **Multi-Admin & Keamanan RLS:** Mendukung banyak akun admin yang dapat mengakses dashboard dari jaringan mana pun secara aman.

---

## 🛠️ Arsitektur & Tech Stack

| Komponen | Teknologi | Peran dalam Sistem |
| :--- | :--- | :--- |
| **Frontend & Hosting** | HTML5, Tailwind CSS, Vanilla JS, **GitHub Pages** | Antarmuka layar TV dan dashboard admin (*zero-build*). |
| **Excel Parser** | **SheetJS (`xlsx`)** | Mengekstrak file `.xlsx`/`.csv` menjadi data JSON langsung di browser admin. |
| **Database & Realtime** | **Supabase (PostgreSQL + Realtime)** | Menyimpan metadata slide, data tabel (`JSONB`), dan menyiarkan perubahan secara instan. |
| **Media Storage & Auth** | **Supabase Storage & Auth** | Autentikasi multi-admin dan penyimpanan aset gambar/poster (`bucket: tv-media`). |

---

## 📂 Struktur Direktori

```text
tv-diskopdag/
├── index.html          # Halaman Layar TV Lobi (Full-Screen Display Player)
├── admin.html          # Halaman Dashboard Kontrol Multi-Admin
└── js/
    ├── config.js       # Konfigurasi URL & Anon Key Supabase
    ├── tv.js           # Mesin pemutar playlist, WebSocket sync, & pagination Excel
    └── admin.js        # Logika autentikasi, upload gambar, & parsing file Excel
```

---

## 🚀 Panduan Instalasi & Deployment

### 1. Setup Backend di Supabase
1. Buat proyek baru di [Supabase](https://supabase.com).
2. Buka menu **SQL Editor**, lalu jalankan skrip setup database berikut untuk membuat tabel `slides`, *trigger* `Pin Live`, kebijakan keamanan (RLS), dan *storage bucket* `tv-media`:

<details>
<summary>📜 <b>Klik untuk melihat Skrip SQL Setup Supabase</b></summary>

```sql
-- 1. Tabel utama slide (Gambar & Data Excel)
CREATE TABLE public.slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'excel')),
  image_url TEXT,
  excel_data JSONB,
  duration INTEGER NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  author_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trigger otomatis: Hanya 1 slide yang dapat di-Pin dalam satu waktu
CREATE OR REPLACE FUNCTION public.ensure_single_pin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_pinned = true THEN
    UPDATE public.slides
    SET is_pinned = false
    WHERE id <> NEW.id AND is_pinned = true;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_single_pin
BEFORE INSERT OR UPDATE ON public.slides
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_pin();

-- 3. Aktifkan Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.slides;

-- 4. Kebijakan Row Level Security (RLS)
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publik dapat melihat slide"
ON public.slides FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin dapat mengelola slide"
ON public.slides FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Storage Bucket untuk Gambar/Poster
INSERT INTO storage.buckets (id, name, public)
VALUES ('tv-media', 'tv-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Publik dapat melihat gambar"
ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'tv-media');

CREATE POLICY "Admin dapat upload gambar"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tv-media');

CREATE POLICY "Admin dapat hapus gambar"
ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tv-media');
```
</details>

3. Buka menu **Authentication → Users → Add User** untuk mendaftarkan akun email dan password para admin.

### 2. Konfigurasi Kredensial
Salin **Project URL** dan **Anon Public Key** dari menu **Project Settings → API** di Supabase, lalu masukkan ke dalam file `js/config.js`:

```javascript
const SUPABASE_URL = '[https://PROJECT-ID-ANDA.supabase.co](https://PROJECT-ID-ANDA.supabase.co)';
const SUPABASE_ANON_KEY = 'ANON-PUBLIC-KEY-ANDA';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 3. Publikasi di GitHub Pages
1. *Push* seluruh perubahan ke branch `main` repository ini.
2. Masuk ke **Settings → Pages** pada repository GitHub.
3. Pada bagian **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.

---


<div align="center">
  <sub>Dikembangkan untuk optimalisasi media informasi digital lobi kantor • Hosted on GitHub Pages</sub>
</div>
