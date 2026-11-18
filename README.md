# 📺 Web-Based Digital Signage TV Lobi Kantor

Sistem aplikasi papan informasi digital (*Digital Signage*) berbasis web untuk memanfaatkan TV lobi kantor secara maksimal. Sistem ini memungkinkan banyak admin kantor mengunggah konten (poster gambar maupun data tabel Excel/agenda) dari mana saja, sementara TV lobi menampilkan informasi secara otomatis dalam tampilan layar penuh (*Full-Screen Single View*) dengan pembaruan *real-time*.

---

## ✨ Fitur Utama Sistem

1. **Full-Screen Single View (Tampilan Satu Layar Penuh)**
   - Desain minimalis berjarak pandang jauh (2–4 meter) dengan kontras tinggi (Dark Theme `#090D16`).
   - Mencegah layar terbagi-bagi (*split-screen*) yang sempit dan sulit dibaca oleh tamu.

2. **Dukungan Multi-Admin Jarak Jauh**
   - Para staf/admin dapat masuk dari laptop maupun HP di jaringan mana pun untuk mengunggah informasi tanpa saling menimpa tampilan secara acak.

3. **Dukungan Dua Jenis Konten:**
   - **Poster / Gambar (JPG, PNG, WEBP)**:
     - Dilengkapi *Smart Framing* otomatis: gambar vertikal/persegi akan ditampilkan tajam di tengah (`object-contain`) dengan latar belakang pantulan blur halus (`blur-3xl opacity-30`) sehingga tidak ada ruang hitam kaku di sisi TV.
   - **Data Spreadsheet Excel (.XLSX, .XLS, .CSV)**:
     - Dibaca langsung di browser admin menggunakan **SheetJS** tanpa butuh backend compiler.
     - Otomatis dibagi menjadi beberapa halaman di layar TV (**maksimal 8 baris per layar**) dengan ukuran font besar (24px–28px) yang mudah dibaca.
     - Deteksi badge status otomatis (*Selesai*, *Berlangsung*, *Menunggu*, dll.).

4. **Dua Mode Tayang:**
   - **Mode Normal (Auto-Slideshow)**: TV memutar semua slide aktif secara bergantian sesuai durasi yang diatur, dilengkapi *progress bar* hitung mundur di bagian bawah.
   - **Mode Pin Live (Prioritas / Tamu VIP)**: Mengunci layar TV hanya pada 1 slide tertentu secara instan (misal: ucapan selamat datang tamu penting atau pengumuman darurat). Dilengkapi trigger database otomatis agar hanya 1 slide yang di-pin pada satu waktu.

5. **Running Text / Marquee Ticker**
   - Menampilkan teks berjalan yang halus di bagian paling bawah layar TV untuk pengumuman kantor atau informasi Wi-Fi tamu, yang dapat diperbarui sewaktu-waktu dari dashboard admin.

6. **Offline Resilient (Tahan Gangguan Internet)**
   - Jika koneksi Wi-Fi kantor terputus sementara, layar TV tetap memutar slide dari cache memori lokal (*localStorage*) tanpa memunculkan pesan error yang mengganggu pemandangan tamu di lobi.

7. **Zero-Build Architecture (Tanpa NPM / Vite / Webpack)**
   - Murni menggunakan HTML5, Tailwind CSS (CDN), Vanilla JavaScript, Supabase JS v2, dan SheetJS.
   - Langsung jalan di server lokal (Laragon / XAMPP) maupun di-host gratis di **GitHub Pages** / **Vercel** cukup dengan *push* file.

8. **Pintasan Teknisi Tersembunyi di Layar TV:**
   - **Klik Layar** atau tekan **`F`**: Masuk / keluar mode layar penuh (*Full-Screen*).
   - **Panah Kanan (`→`) / Kiri (`←`)**: Ganti slide secara manual untuk uji coba teknisi.
   - **Spasi / `P`**: Jeda (*pause*) atau lanjutkan putaran otomatis.
   - **`R`**: Muat ulang (*force refresh*) data dan tayangan.

---

## 📁 Struktur File Proyek

```plaintext
c:/laragon/www/TV/
├── index.html          # Layar TV Lobi (Full-Screen Kiosk Player)
├── admin.html          # Dashboard Multi-Admin (Mobile-First)
├── schema.sql          # Skema database, trigger, RLS, & storage Supabase
├── README.md           # Panduan lengkap penggunaan dan instalasi
├── js/
│   ├── config.js       # Konfigurasi Supabase & fallback mode demo
│   ├── tv.js           # Logika player TV, rotasi slide, pagination Excel, & realtime sync
│   └── admin.js        # Logika login, upload gambar, parse SheetJS, Pin Live, & preview
└── sample/
    ├── jadwal_rapat_hari_ini.xlsx   # Contoh file Excel siap uji
    ├── jadwal_rapat_hari_ini.csv    # Contoh file CSV jadwal rapat
    └── informasi_layanan_kantor.csv # Contoh file CSV layanan loket
```

---

## 🚀 Panduan Uji Coba Cepat (Mode Demo / Lokal)

Aplikasi ini sudah dilengkapi **Mode Demo Cerdas**. Anda bisa langsung mencobanya di browser tanpa perlu mengatur akun Supabase terlebih dahulu!

1. Pastikan Laragon / Apache Anda aktif.
2. Buka layar TV di browser:
   👉 **`http://localhost/TV/index.html`**
   - Layar akan langsung menampilkan contoh poster sambutan dan tabel jadwal kegiatan dengan rotasi otomatis dan jam digital real-time.
   - Klik layar atau tekan `F` untuk mencoba tampilan layar penuh (*Full-Screen*).
3. Buka panel admin di tab baru atau dari HP Anda:
   👉 **`http://localhost/TV/admin.html`**
   - Klik tombol hijau: **"⚡ Masuk Mode Demo Cepat (Tanpa Supabase)"**.
   - Anda akan langsung masuk ke Dashboard Admin.
   - Coba unggah file contoh dari folder `sample/jadwal_rapat_hari_ini.xlsx` atau `sample/jadwal_rapat_hari_ini.csv`.
   - Coba tekan tombol **"Pin Live"** atau ubah teks pada **"Teks Berjalan (Marquee)"** — perhatikan perubahan langsung terjadi di tab `index.html`!

---

## ☁️ Panduan Menghubungkan ke Supabase (Untuk Produksi & Multi-Admin Jarak Jauh)

Agar aplikasi dapat diakses secara live oleh seluruh admin dari kantor, rumah, maupun luar jaringan, hubungkan ke database gratis **Supabase**:

### Langkah 1: Buat Proyek di Supabase
1. Buka [https://supabase.com](https://supabase.com) dan buat akun (gratis).
2. Buat proyek baru (*New Project*), beri nama misalnya `tv-lobi-kantor`.

### Langkah 2: Jalankan Skrip SQL
1. Masuk ke menu **SQL Editor** di dashboard Supabase Anda.
2. Buka file `schema.sql` di proyek ini, salin seluruh kodenya, lalu tempelkan di SQL Editor Supabase.
3. Klik tombol **Run**. Skrip ini otomatis:
   - Membuat tabel `slides` dan `settings`.
   - Mengaktifkan Supabase Realtime (WebSocket).
   - Menyiapkan Storage Bucket `tv-media` untuk poster.
   - Mengatur hak akses keamanan Row Level Security (RLS).
   - Memasukkan data awal contoh.

### Langkah 3: Daftarkan Akun Admin
1. Masuk ke menu **Authentication** > **Users** di dashboard Supabase.
2. Klik **Add User** > **Create User**.
3. Masukkan email kantor admin (misal: `admin@kantor.com`) dan kata sandi. Matikan opsi *Auto Confirm User* jika tidak ingin verifikasi email (langsung aktif).

### Langkah 4: Hubungkan Kredensial ke Aplikasi
Ada 2 cara mudah:
- **Cara A (Melalui Panel Admin)**:
  Buka `http://localhost/TV/admin.html`, klik tombol **"⚙️ Atur Kredensial Supabase"** atau tombol **"Koneksi"** di pojok kanan atas, lalu masukkan:
  - **Project URL** (dari menu *Project Settings* > *API* di Supabase).
  - **Anon Public Key** (dari menu *Project Settings* > *API* di Supabase).
  - Klik **Simpan & Hubungkan**.
- **Cara B (Langsung di file `js/config.js`)**:
  Buka file `js/config.js` dan isi variabel:
  ```javascript
  const DEFAULT_SUPABASE_URL = 'https://projekanda.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1Ni...';
  ```

---

## 🌐 Panduan Hosting Gratis di GitHub Pages

Karena proyek ini tidak membutuhkan proses build (*Zero Build*), Anda bisa meng-host-nya langsung di GitHub Pages secara 100% gratis selamanya:

1. Buat repository baru di GitHub (misal: `tv-lobi`).
2. Masukkan seluruh file proyek ini (`index.html`, `admin.html`, `schema.sql`, folder `js/`, dll.) ke repository tersebut:
   ```bash
   git init
   git add .
   git commit -m "Inisialisasi sistem TV Lobi Digital Signage"
   git branch -M main
   git remote add origin https://github.com/USERNAME/tv-lobi.git
   git push -u origin main
   ```
3. Buka tab **Settings** di repository GitHub Anda > pilih menu **Pages** (di sidebar kiri).
4. Di bagian **Build and deployment** > **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu 1–2 menit, GitHub Pages akan memberikan alamat live gratis:
   - Layar TV Lobi: `https://USERNAME.github.io/tv-lobi/index.html`
   - Panel Admin: `https://USERNAME.github.io/tv-lobi/admin.html`

Semua admin dapat mengelola TV lobi langsung dari URL tersebut kapan saja dan dari mana saja!

---

## 🖥️ Panduan Memasang di Smart TV Lobi (Kiosk Mode)

1. Hubungkan Smart TV atau Android TV Box kantor ke Wi-Fi.
2. Buka aplikasi browser bawaan TV (disarankan menggunakan browser modern seperti Google Chrome, Firefox, atau aplikasi khusus seperti *Fully Kiosk Browser* di Android TV).
3. Buka URL Layar TV:
   - Lokal: `http://IP_KOMPUTER_KANTOR/TV/index.html`
   - Atau URL GitHub Pages: `https://USERNAME.github.io/tv-lobi/index.html`
4. Tekan tombol layar penuh (*Full-Screen* / F11).
5. Layar TV akan otomatis berjalan terus menerus tanpa memerlukan remote atau interaksi pengguna lagi.
