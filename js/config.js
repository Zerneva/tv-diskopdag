// ============================================================
// KONFIGURASI SUPABASE & KONEKSI APLIKASI TV LOBI
// ============================================================

// Anda dapat mengisi kredensial langsung di bawah ini,
// atau mengisinya lewat menu "Pengaturan Supabase" di dalam panel admin.
const DEFAULT_SUPABASE_URL = 'https://scofhdbblrryetxtscul.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_PwYbbCGzeRRdO9DcgHKgTw_kliYAJUe';

// Helper sanitasi URL Supabase: Otomatis memperbaiki jika user menyalin link dashboard
function formatSupabaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();

  // Jika user menyalin link dashboard: https://supabase.com/dashboard/project/scofhdbblirryetxtscul/...
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Hapus trailing slash atau sub-path ekstra seperti /auth/v1 atau /rest/v1
  url = url.replace(/\/+$/, '');
  url = url.replace(/\/(auth|rest)\/v\d+.*$/, '');

  // Pastikan memiliki awalan https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  return url;
}

// Cek apakah ada kredensial tersimpan di browser (localStorage)
const storedUrl = localStorage.getItem('TV_SIGNAGE_SUPABASE_URL');
const storedKey = localStorage.getItem('TV_SIGNAGE_SUPABASE_KEY');

const SUPABASE_URL = (storedUrl && storedUrl.trim() !== '') 
  ? formatSupabaseUrl(storedUrl) 
  : formatSupabaseUrl(DEFAULT_SUPABASE_URL);

const SUPABASE_ANON_KEY = (storedKey && storedKey.trim() !== '') ? storedKey.trim() : DEFAULT_SUPABASE_ANON_KEY.trim();

// Cek apakah kredensial sudah diatur dengan benar
const isSupabaseConfigured = () => {
  return (
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_URL.includes('.supabase.co') &&
    !SUPABASE_URL.includes('GANTI-DENGAN') &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_ANON_KEY.includes('GANTI-DENGAN')
  );
};

// Inisialisasi Supabase Client jika kredensial tersedia
let supabaseClient = null;
if (isSupabaseConfigured() && window.supabase) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  } catch (e) {
    console.error('Gagal inisialisasi Supabase Client:', e);
  }
}

// Data Dummy / Mock Otomatis untuk Mode Demo (jika Supabase belum dihubungkan)
const DEMO_INITIAL_SLIDES = [
  {
    id: 'demo-slide-1',
    title: 'Selamat Datang di Kantor Kami',
    type: 'image',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    duration: 15,
    is_active: true,
    is_pinned: false,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    author_email: 'demo@kantor.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-slide-2',
    title: 'Jadwal Agenda Ruang Rapat Hari Ini',
    type: 'excel',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    excel_data: {
      headers: ['Waktu', 'Ruang Rapat', 'Agenda Kegiatan', 'Penanggung Jawab', 'Status'],
      rows: [
        ['08:30 - 10:00', 'Ruang VIP Cendrawasih', 'Rapat Koordinasi Mingguan', 'Bpk. Rahmat (HRD)', 'Selesai'],
        ['10:15 - 12:00', 'Ruang Sakura 01', 'Presentasi Produk Baru', 'Ibu Sari (Marketing)', 'Berlangsung'],
        ['13:00 - 14:30', 'Aula Serbaguna', 'Sosialisasi SOP Operasional 2026', 'Bpk. Doni (Ops)', 'Menunggu'],
        ['14:45 - 16:00', 'Ruang VIP Cendrawasih', 'Kunjungan Tamu Dinas Provinsi', 'Ibu Dian (Humas)', 'Menunggu'],
        ['16:15 - 17:30', 'Ruang IT Lab', 'Sprint Review & Evaluasi Sistem', 'Tim Pengembang', 'Menunggu']
      ]
    },
    duration: 20,
    is_active: true,
    is_pinned: false,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    author_email: 'demo@kantor.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_INITIAL_SETTINGS = {
  id: 'global',
  office_name: 'KANTOR PUSAT',
  running_text: 'Selamat datang di Kantor Kami • Harap melakukan registrasi buku tamu di meja resepsionis • Jaga kenyamanan bersama • Wi-Fi Tamu: Office-Guest (Password: SelamatDatang2026)',
  ticker_speed: 25
};

// Inisialisasi mock storage jika belum ada
if (!localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES')) {
  localStorage.setItem('TV_SIGNAGE_LOCAL_SLIDES', JSON.stringify(DEMO_INITIAL_SLIDES));
}
if (!localStorage.getItem('TV_SIGNAGE_LOCAL_SETTINGS')) {
  localStorage.setItem('TV_SIGNAGE_LOCAL_SETTINGS', JSON.stringify(DEMO_INITIAL_SETTINGS));
}

// Simpan konfigurasi baru
function saveSupabaseConfig(url, key) {
  if (url && key) {
    const cleanUrl = formatSupabaseUrl(url);
    localStorage.setItem('TV_SIGNAGE_SUPABASE_URL', cleanUrl);
    localStorage.setItem('TV_SIGNAGE_SUPABASE_KEY', key.trim());
    window.location.reload();
  }
}

// Reset kembali ke Demo Mode
function resetToDemoMode() {
  localStorage.removeItem('TV_SIGNAGE_SUPABASE_URL');
  localStorage.removeItem('TV_SIGNAGE_SUPABASE_KEY');
  window.location.reload();
}

// ============================================================
// PARSER TAUTAN MEDIA ONLINE (YOUTUBE, GOOGLE DRIVE, VIDEO, FOTO, WEB)
// ============================================================
function parseMediaUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let url = rawUrl.trim();
  if (!url) return null;

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  // 1. YouTube (Watch, Share youtu.be, Shorts, Embed)
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      originalUrl: url,
      videoId: videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      titleHint: 'YouTube Video'
    };
  }

  // 2. Google Drive Share Image
  const gdriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    const gId = gdriveMatch[1];
    const directUrl = `https://lh3.googleusercontent.com/d/${gId}`;
    return {
      type: 'image',
      originalUrl: url,
      embedUrl: directUrl,
      thumbnailUrl: directUrl,
      titleHint: 'Google Drive Image'
    };
  }

  // 3. Direct Video File (.mp4, .webm, .ogg, .mov, .m4v)
  const cleanPath = url.split('?')[0].toLowerCase();
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)$/i.test(cleanPath)) {
    return {
      type: 'video',
      originalUrl: url,
      embedUrl: url,
      thumbnailUrl: '',
      titleHint: 'Video Online (' + cleanPath.split('.').pop().toUpperCase() + ')'
    };
  }

  // 4. Direct Image File (.jpg, .jpeg, .png, .webp, .gif, .svg, .avif) atau CDN gambar
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(cleanPath) || url.includes('images.unsplash.com') || url.includes('i.imgur.com')) {
    return {
      type: 'image',
      originalUrl: url,
      embedUrl: url,
      thumbnailUrl: url,
      titleHint: 'Gambar Online'
    };
  }

  // 5. Default Fallback: Webpage / Iframe Kiosk
  return {
    type: 'web',
    originalUrl: url,
    embedUrl: url,
    thumbnailUrl: '',
    titleHint: 'Halaman Web / Dasbor Kiosk'
  };
}

