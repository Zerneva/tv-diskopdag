-- ============================================================
-- SKEMA DATABASE SUPABASE: DIGITAL SIGNAGE TV LOBI KANTOR
-- ============================================================

-- 1. Buat tabel utama untuk menyimpan slide (Gambar, Video, & Data Excel)
CREATE TABLE IF NOT EXISTS public.slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'image', 'video', 'excel'
  image_url TEXT, -- Menyimpan URL gambar atau video
  excel_data JSONB, -- Format: { "headers": ["No", "Nama", "Divisi", "Status"], "rows": [["1", "Budi", "IT", "Hadir"], ...] }
  duration INTEGER NOT NULL DEFAULT 15, -- Durasi tayang dalam detik (5 - 180 detik)
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  author_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pastikan jika ada constraint lama 'slides_type_check', dihapus agar menerima type 'video'
ALTER TABLE public.slides DROP CONSTRAINT IF EXISTS slides_type_check;

-- 2. Buat tabel pengaturan global (Running Text & Pengaturan Layar)
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  office_name TEXT DEFAULT 'KANTOR UTAMA',
  running_text TEXT DEFAULT 'Selamat datang di Kantor Kami. Harap melapor ke meja resepsionis untuk registrasi tamu dan pengambilan kartu akses.',
  ticker_speed INTEGER DEFAULT 25, -- detik durasi animasi marquee
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Masukkan pengaturan default jika belum ada
INSERT INTO public.settings (id, office_name, running_text, ticker_speed)
VALUES ('global', 'KANTOR UTAMA', 'Selamat datang di Kantor Kami. Harap melapor ke meja resepsionis untuk registrasi tamu dan pengambilan kartu akses.', 25)
ON CONFLICT (id) DO NOTHING;

-- 3. Trigger otomatis: Jika 1 slide di-Pin Live, slide lain otomatis Unpin
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

DROP TRIGGER IF EXISTS trigger_single_pin ON public.slides;
CREATE TRIGGER trigger_single_pin
BEFORE INSERT OR UPDATE ON public.slides
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_pin();

-- 4. Aktifkan Supabase Realtime pada tabel slides & settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.slides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;

-- 4b. Berikan Izin Akses Tabel (GRANT) ke role anon & authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.slides TO anon, authenticated;
GRANT ALL ON TABLE public.settings TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

-- Izin akses storage bucket
GRANT ALL ON TABLE storage.objects TO anon, authenticated;
GRANT ALL ON TABLE storage.buckets TO anon, authenticated;

-- 5. Atur Row Level Security (RLS) pada tabel slides
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Publik dapat melihat slide" ON public.slides;
CREATE POLICY "Publik dapat melihat slide"
ON public.slides FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admin dapat mengelola slide" ON public.slides;
CREATE POLICY "Admin dapat mengelola slide"
ON public.slides FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Atur Row Level Security (RLS) pada tabel settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Publik dapat melihat settings" ON public.settings;
CREATE POLICY "Publik dapat melihat settings"
ON public.settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admin dapat mengubah settings" ON public.settings;
CREATE POLICY "Admin dapat mengubah settings"
ON public.settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Buat Storage Bucket untuk menyimpan file gambar poster/foto
INSERT INTO storage.buckets (id, name, public)
VALUES ('tv-media', 'tv-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Publik dapat melihat gambar" ON storage.objects;
CREATE POLICY "Publik dapat melihat gambar"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'tv-media');

DROP POLICY IF EXISTS "Admin dapat upload gambar" ON storage.objects;
CREATE POLICY "Admin dapat upload gambar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tv-media');

DROP POLICY IF EXISTS "Admin dapat hapus gambar" ON storage.objects;
CREATE POLICY "Admin dapat hapus gambar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tv-media');

DROP POLICY IF EXISTS "Admin dapat update gambar" ON storage.objects;
CREATE POLICY "Admin dapat update gambar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'tv-media');

-- 8. Data Contoh Awal (Opsional - Agar TV langsung ada konten setelah migrasi)
INSERT INTO public.slides (title, type, image_url, duration, is_active, is_pinned, start_date, end_date, author_email)
VALUES (
  'Selamat Datang Para Tamu dan Mitra Kerja',
  'image',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
  15,
  true,
  false,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  'admin@kantor.com'
) ON CONFLICT DO NOTHING;

INSERT INTO public.slides (title, type, excel_data, duration, is_active, is_pinned, start_date, end_date, author_email)
VALUES (
  'Jadwal Penggunaan Ruang Rapat Hari Ini',
  'excel',
  '{
    "headers": ["Waktu", "Ruang Rapat", "Agenda Kegiatan", "Penanggung Jawab", "Status"],
    "rows": [
      ["08:30 - 10:00", "Ruang VIP Cendrawasih", "Rapat Koordinasi Mingguan", "Bpk. Rahmat (HRD)", "Selesai"],
      ["10:15 - 12:00", "Ruang Sakura 01", "Presentasi Produk Baru", "Ibu Sari (Marketing)", "Berlangsung"],
      ["13:00 - 14:30", "Aula Serbaguna", "Sosialisasi SOP Operasional 2026", "Bpk. Doni (Ops)", "Menunggu"],
      ["14:45 - 16:00", "Ruang VIP Cendrawasih", "Kunjungan Studi Banding Dinas", "Ibu Dian (Humas)", "Menunggu"],
      ["16:15 - 17:30", "Ruang Rapat IT Lab", "Sprint Review & Evaluasi Sistem", "Tim Pengembang", "Menunggu"]
    ]
  }'::jsonb,
  20,
  true,
  false,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  'admin@kantor.com'
) ON CONFLICT DO NOTHING;
