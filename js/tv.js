// ============================================================
// TV.JS - LOGIKA PLAYER DIGITAL SIGNAGE LAYAR TV LOBI
// ============================================================

// Referensi Elemen DOM
const stage = document.getElementById('tv-stage');
const titleEl = document.getElementById('slide-title');
const metaEl = document.getElementById('slide-meta');
const badgeEl = document.getElementById('live-badge');
const progressBar = document.getElementById('progress-bar');
const clockEl = document.getElementById('clock');
const dateLabelEl = document.getElementById('date-label');
const networkDot = document.getElementById('network-dot');
const networkLabel = document.getElementById('network-label');
const tickerBadgeText = document.getElementById('ticker-badge-text');
const marqueeText = document.getElementById('marquee-text');
const quickHint = document.getElementById('quick-hint');
const pauseIndicator = document.getElementById('pause-indicator');

// State Aplikasi
let allSlides = [];
let currentSlideIndex = 0;
let currentExcelPage = 0;
let slideTimer = null;
let progressInterval = null;
let isPaused = false;
let remainingSeconds = 0;
const ROWS_PER_PAGE = 8; // Jumlah baris Excel maksimal per layar

// ------------------------------------------------------------
// Helper Sanitasi HTML (Cegah XSS & Karakter Rusak)
// ------------------------------------------------------------
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ------------------------------------------------------------
// 1. UPDATE JAM & TANGGAL REAL-TIME
// ------------------------------------------------------------
function updateDateTime() {
  const now = new Date();
  
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\./g, ':');
  }

  if (dateLabelEl) {
    dateLabelEl.textContent = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ------------------------------------------------------------
// 2. KONTROL STATUS JARINGAN (ONLINE / OFFLINE)
// ------------------------------------------------------------
function updateNetworkStatus(status, text) {
  if (!networkDot || !networkLabel) return;
  
  if (status === 'online') {
    networkDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse';
    networkLabel.textContent = text || 'ONLINE';
    networkLabel.className = 'hidden md:inline font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-bold';
  } else if (status === 'demo') {
    networkDot.className = 'w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50';
    networkLabel.textContent = text || 'DEMO';
    networkLabel.className = 'hidden md:inline font-mono text-[11px] uppercase tracking-wider text-sky-400 font-bold';
  } else if (status === 'cached') {
    networkDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50';
    networkLabel.textContent = text || 'CACHE';
    networkLabel.className = 'hidden md:inline font-mono text-[11px] uppercase tracking-wider text-amber-400 font-bold';
  } else {
    networkDot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50';
    networkLabel.textContent = text || 'OFFLINE';
    networkLabel.className = 'hidden md:inline font-mono text-[11px] uppercase tracking-wider text-rose-400 font-bold';
  }
}

// ------------------------------------------------------------
// 3. AMBIL PENGATURAN GLOBAL (RUNNING TEXT / MARQUEE)
// ------------------------------------------------------------
async function fetchSettings() {
  try {
    if (isSupabaseConfigured() && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (!error && data) {
        applySettings(data);
        localStorage.setItem('cached_tv_settings', JSON.stringify(data));
        return;
      }
    }
  } catch (err) {
    console.warn('Gagal mengambil settings dari Supabase, menggunakan cache/lokal:', err);
  }

  const cachedSettings = localStorage.getItem('cached_tv_settings') || localStorage.getItem('TV_SIGNAGE_LOCAL_SETTINGS');
  if (cachedSettings) {
    try {
      applySettings(JSON.parse(cachedSettings));
    } catch (e) {
      console.error(e);
    }
  }
}

function applySettings(settings) {
  if (!settings) return;
  if (settings.office_name && tickerBadgeText) {
    tickerBadgeText.textContent = settings.office_name;
  }
  if (settings.running_text && marqueeText) {
    marqueeText.textContent = settings.running_text;
    
    const textLen = settings.running_text.length;
    const duration = Math.max(18, Math.min(60, Math.floor(textLen * 0.28)));
    marqueeText.style.animationDuration = `${duration}s`;
  }
}

// ------------------------------------------------------------
// 4. AMBIL DAFTAR SLIDE (SUPABASE ATAU FALLBACK CACHE)
// ------------------------------------------------------------
async function fetchSlides() {
  const today = new Date().toISOString().split('T')[0];

  if (isSupabaseConfigured() && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('slides')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: true });

      if (!error && data) {
        allSlides = data;
        localStorage.setItem('cached_tv_slides', JSON.stringify(data));
        updateNetworkStatus('online', 'LIVE');
        evaluatePlayback(true);
        return;
      } else {
        console.warn('Supabase fetch error:', error);
      }
    } catch (err) {
      console.warn('Gagal koneksi Supabase:', err);
    }
  }

  // Jika Supabase belum diatur atau koneksi gagal: Cek LocalStorage Cache / Demo
  const cached = localStorage.getItem('cached_tv_slides') || localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      allSlides = parsed.filter(s => {
        if (!s.is_active) return false;
        if (s.start_date && s.start_date > today) return false;
        if (s.end_date && s.end_date < today) return false;
        return true;
      });

      if (isSupabaseConfigured()) {
        updateNetworkStatus('cached', 'OFFLINE CACHE');
      } else {
        updateNetworkStatus('demo', 'DEMO MODE');
      }
      evaluatePlayback(true);
    } catch (e) {
      console.error('Error parse cache:', e);
      updateNetworkStatus('offline', 'ERROR');
    }
  } else {
    updateNetworkStatus('offline', 'NO DATA');
    evaluatePlayback(true);
  }
}

// ------------------------------------------------------------
// 5. EVALUASI MODE TAYANG (PIN LIVE vs AUTO-PLAYLIST)
// ------------------------------------------------------------
function evaluatePlayback(forceReset = false) {
  if (!allSlides || allSlides.length === 0) {
    clearTimers();
    if (titleEl) titleEl.textContent = 'Belum Ada Informasi Tayang Hari Ini';
    if (metaEl) metaEl.textContent = 'Standby';
    if (badgeEl) {
      badgeEl.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span>STANDBY</span>`;
      badgeEl.className = 'px-4 py-1.5 rounded-full text-xs font-extrabold uppercase bg-slate-800/80 text-slate-400 border border-slate-700/60 shadow-sm';
    }
    stage.innerHTML = `
      <div class="text-center text-slate-400 flex flex-col items-center gap-4 max-w-lg p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-md slide-enter">
        <div class="w-20 h-20 rounded-2xl bg-slate-800/70 flex items-center justify-center text-slate-500 mb-1 border border-slate-700/40">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <p class="text-2xl font-black text-slate-200 tracking-tight">Belum Ada Informasi Aktif</p>
        <p class="text-sm text-slate-400 leading-relaxed">Admin dapat mengunggah poster gambar atau tabel Excel jadwal kegiatan melalui Panel Admin.</p>
        <a href="admin.html" class="mt-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold tracking-wide uppercase rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <span>Buka Panel Admin</span>
          <span>↗</span>
        </a>
      </div>
    `;
    if (progressBar) progressBar.style.width = '0%';
    return;
  }

  // Cek apakah ada slide yang sedang di-PIN LIVE
  const pinnedSlide = allSlides.find(s => s.is_pinned === true);

  if (pinnedSlide) {
    if (badgeEl) {
      badgeEl.innerHTML = `
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>
        <span>📌 PINNED LIVE</span>
      `;
      badgeEl.className = 'px-4 py-1.5 rounded-full text-xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/20 ring-pulse backdrop-blur-sm';
    }
    renderSlide(pinnedSlide, true);
    return;
  }

  // Mode Normal Playlist Otomatis
  if (badgeEl) {
    badgeEl.innerHTML = `
      <span class="relative flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
      </span>
      <span>LIVE PLAYLIST</span>
    `;
    badgeEl.className = 'px-4 py-1.5 rounded-full text-xs font-extrabold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-sm backdrop-blur-sm';
  }

  if (currentSlideIndex >= allSlides.length) {
    currentSlideIndex = 0;
  }

  if (forceReset || !slideTimer) {
    renderSlide(allSlides[currentSlideIndex], false);
  }
}

// Helper Pemutaran Video Full & Otomatisasi Durasi Tayang
function setupTvVideoPlayer(videoEl, fallbackDuration, isPinnedMode, metaPrefix, updatedTime) {
  if (!videoEl) return;

  let timerStarted = false;
  let targetDuration = fallbackDuration || 20;

  const startSyncedCountdown = (seconds) => {
    if (timerStarted) return;
    timerStarted = true;
    targetDuration = seconds;
    if (metaEl) {
      metaEl.textContent = `${metaPrefix} • Durasi ${seconds}s (Putar Full) • Update ${updatedTime}`;
    }
    if (!isPinnedMode) {
      startCountdown(seconds, () => {
        // Jika countdown selesai tapi video masih memutar dan belum selesai, jangan potong paksa
        if (videoEl && !videoEl.paused && !videoEl.ended && (videoEl.duration - videoEl.currentTime > 1.2)) {
          return;
        }
        currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
        currentExcelPage = 0;
        evaluatePlayback(true);
      });
    } else {
      if (progressBar) progressBar.style.width = '100%';
    }
  };

  const onMetaLoaded = () => {
    const rawDur = Math.ceil(videoEl.duration);
    if (rawDur && isFinite(rawDur) && rawDur > 0) {
      startSyncedCountdown(rawDur);
    }
  };

  videoEl.addEventListener('loadedmetadata', onMetaLoaded);
  videoEl.addEventListener('durationchange', onMetaLoaded);

  // Saat video selesai diputar sampai akhir -> langsung loncat ke slide berikutnya!
  videoEl.addEventListener('ended', () => {
    if (!isPinnedMode && allSlides.length > 1) {
      clearCountdown();
      currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
      currentExcelPage = 0;
      evaluatePlayback(true);
    }
  });

  videoEl.play().catch(e => console.warn('Autoplay video notice:', e));

  // Fallback pengaman jika metadata terlambat termuat
  setTimeout(() => {
    if (!timerStarted) {
      const dur = (videoEl.duration && isFinite(videoEl.duration) && videoEl.duration > 0)
        ? Math.ceil(videoEl.duration)
        : targetDuration;
      startSyncedCountdown(dur);
    }
  }, 1200);
}

// Listener Pesan YouTube PostMessage (Mendeteksi otomatis video selesai berakhir)
window.addEventListener('message', (e) => {
  try {
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    if (data && data.event === 'onStateChange' && data.info === 0) {
      // YouTube selesai (State 0 = Ended) -> ganti slide otomatis
      if (allSlides && allSlides.length > 1) {
        clearCountdown();
        currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
        currentExcelPage = 0;
        evaluatePlayback(true);
      }
    }
  } catch (err) {}
});

// ------------------------------------------------------------
// 6. RENDER KONTEN SLIDE (GAMBAR ATAU TABEL EXCEL)
// ------------------------------------------------------------
function renderSlide(slide, isPinnedMode) {
  clearTimers();
  if (!slide) return;

  if (titleEl) titleEl.textContent = slide.title || 'Informasi Kantor';

  const updatedTime = slide.updated_at 
    ? new Date(slide.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : 'Baru saja';

  // --- KASUS A: SLIDE GAMBAR ---
  if (slide.type === 'image') {
    if (metaEl) {
      metaEl.textContent = `Slide ${currentSlideIndex + 1} dari ${allSlides.length} • Update ${updatedTime}`;
    }

    const safeImageUrl = slide.image_url ? encodeURI(slide.image_url) : '';
    const safeTitle = escapeHtml(slide.title);

    stage.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center slide-enter overflow-hidden">
        <!-- Latar Belakang Blur Cerdas (Mencegah black bar) -->
        <img 
          src="${safeImageUrl}" 
          alt="" 
          aria-hidden="true"
          class="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none select-none filter contrast-125 brightness-90"
          onerror="this.style.display='none'"
        />
        <!-- Vignette & Dark Overlay untuk Kontras Ekstra -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none"></div>
        <!-- Gambar Utama Tajam -->
        <div class="relative z-10 p-4 max-w-full max-h-full flex items-center justify-center">
          <img 
            src="${safeImageUrl}" 
            alt="${safeTitle}" 
            class="max-w-[94vw] max-h-[77vh] object-contain rounded-2xl shadow-2xl shadow-black/60 border border-slate-700/60 ring-1 ring-white/10"
            onerror="this.src='https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=1200&q=80'"
          />
        </div>
      </div>
    `;

    if (!isPinnedMode) {
      startCountdown(slide.duration || 15, () => {
        currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
        currentExcelPage = 0;
        evaluatePlayback(true);
      });
    } else {
      if (progressBar) progressBar.style.width = '100%';
    }
  } 
  // --- KASUS C: SLIDE VIDEO INFORMASI / IKLAN ---
  else if (slide.type === 'video') {
    const safeVideoUrl = slide.image_url ? encodeURI(slide.image_url) : '';

    stage.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
        <!-- Ambient Blur Video Background -->
        <video 
          src="${safeVideoUrl}" 
          class="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none"
          autoplay muted loop playsinline
          onerror="this.style.display='none'"
        ></video>
        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none"></div>
        <!-- Video Player Utama -->
        <div class="relative z-10 p-4 max-w-full max-h-full flex items-center justify-center">
          <video 
            id="tv-main-video"
            src="${safeVideoUrl}" 
            class="max-w-[94vw] max-h-[77vh] object-contain rounded-2xl shadow-2xl shadow-black/60 border border-slate-700/60 ring-1 ring-white/10"
            autoplay muted playsinline
          ></video>
        </div>
      </div>
    `;

    const videoEl = document.getElementById('tv-main-video');
    setupTvVideoPlayer(videoEl, slide.duration, isPinnedMode, 'Video', updatedTime);
  }
  // --- KASUS D: SLIDE TAUTAN LINK MEDIA (YOUTUBE / INSTAGRAM / TIKTOK / VIDEO / FOTO / WEB) ---
  else if (slide.type === 'link') {
    const media = (typeof parseMediaUrl === 'function') 
      ? parseMediaUrl(slide.image_url) 
      : { type: 'web', embedUrl: slide.image_url };

    const typeLabel = media?.type === 'youtube' 
      ? 'YouTube' 
      : (media?.type === 'instagram' 
          ? 'Instagram' 
          : (media?.type === 'tiktok' 
              ? 'TikTok' 
              : (media?.type === 'video' ? 'Video Online' : (media?.type === 'image' ? 'Foto Online' : 'Tautan Web'))));

    if (metaEl) {
      metaEl.textContent = `${typeLabel} • Slide ${currentSlideIndex + 1} dari ${allSlides.length} • Update ${updatedTime}`;
    }

    if (!media) {
      stage.innerHTML = `
        <div class="p-8 text-center text-rose-400 bg-slate-900/60 rounded-2xl border border-rose-800">
          <p class="text-xl font-bold">Tautan link media tidak valid</p>
        </div>
      `;
    } else if (media.type === 'youtube') {
      stage.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
          <iframe 
            src="${media.embedUrl}" 
            class="w-full h-full border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
          ></iframe>
        </div>
      `;
      if (!isPinnedMode) {
        startCountdown(slide.duration || 30, () => {
          currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
          currentExcelPage = 0;
          evaluatePlayback(true);
        });
      } else {
        if (progressBar) progressBar.style.width = '100%';
      }
    } else if (media.type === 'instagram') {
      stage.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 p-2 sm:p-4">
          <!-- Background Glow Halus -->
          <div class="absolute inset-0 bg-gradient-to-tr from-amber-600/15 via-rose-600/15 to-purple-600/15 blur-3xl pointer-events-none"></div>
          <iframe 
            src="${media.embedUrl}" 
            class="relative z-10 w-full max-w-[460px] h-[88vh] rounded-2xl shadow-2xl border border-slate-700/80 bg-white"
            frameborder="0" 
            scrolling="no" 
            allowtransparency="true"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>
      `;
      if (!isPinnedMode) {
        startCountdown(slide.duration || 25, () => {
          currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
          currentExcelPage = 0;
          evaluatePlayback(true);
        });
      } else {
        if (progressBar) progressBar.style.width = '100%';
      }
    } else if (media.type === 'tiktok') {
      stage.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 p-2 sm:p-4">
          <iframe 
            src="${media.embedUrl}" 
            class="relative z-10 w-full max-w-[400px] h-[88vh] rounded-2xl shadow-2xl border border-slate-700/80 bg-black"
            frameborder="0" 
            allowfullscreen
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>
      `;
      if (!isPinnedMode) {
        startCountdown(slide.duration || 25, () => {
          currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
          currentExcelPage = 0;
          evaluatePlayback(true);
        });
      } else {
        if (progressBar) progressBar.style.width = '100%';
      }
    } else if (media.type === 'video') {
      const safeVideoUrl = encodeURI(media.embedUrl);
      stage.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
          <!-- Ambient Blur Video Background -->
          <video 
            src="${safeVideoUrl}" 
            class="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none"
            autoplay muted loop playsinline
            onerror="this.style.display='none'"
          ></video>
          <!-- Dark Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none"></div>
          <!-- Video Player Utama -->
          <div class="relative z-10 p-4 max-w-full max-h-full flex items-center justify-center">
            <video 
              id="tv-link-video"
              src="${safeVideoUrl}" 
              class="max-w-[94vw] max-h-[77vh] object-contain rounded-2xl shadow-2xl shadow-black/60 border border-slate-700/60 ring-1 ring-white/10"
              autoplay muted playsinline
            ></video>
          </div>
        </div>
      `;
      const videoEl = document.getElementById('tv-link-video');
      setupTvVideoPlayer(videoEl, slide.duration, isPinnedMode, 'Video Online', updatedTime);
    } else if (media.type === 'image') {
      const safeImageUrl = encodeURI(media.embedUrl);
      const safeTitle = escapeHtml(slide.title);
      stage.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center slide-enter overflow-hidden">
          <img 
            src="${safeImageUrl}" 
            alt="" 
            aria-hidden="true"
            class="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none select-none filter contrast-125 brightness-90"
            onerror="this.style.display='none'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none"></div>
          <div class="relative z-10 p-4 max-w-full max-h-full flex items-center justify-center">
            <img 
              src="${safeImageUrl}" 
              alt="${safeTitle}" 
              class="max-w-[94vw] max-h-[77vh] object-contain rounded-2xl shadow-2xl shadow-black/60 border border-slate-700/60 ring-1 ring-white/10"
              onerror="this.src='https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=1200&q=80'"
            />
          </div>
        </div>
      `;
      if (!isPinnedMode) {
        startCountdown(slide.duration || 15, () => {
          currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
          currentExcelPage = 0;
          evaluatePlayback(true);
        });
      } else {
        if (progressBar) progressBar.style.width = '100%';
      }
    } else {
      // media.type === 'web'
      stage.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
          <iframe 
            src="${media.embedUrl}" 
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `;
      if (!isPinnedMode) {
        startCountdown(slide.duration || 20, () => {
          currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
          currentExcelPage = 0;
          evaluatePlayback(true);
        });
      } else {
        if (progressBar) progressBar.style.width = '100%';
      }
    }

    if (!isPinnedMode) {
      startCountdown(slide.duration || 20, () => {
        currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
        currentExcelPage = 0;
        evaluatePlayback(true);
      });
    } else {
      if (progressBar) progressBar.style.width = '100%';
    }
  }
  // --- KASUS B: SLIDE DATA TABEL EXCEL ---
  else if (slide.type === 'excel' && slide.excel_data) {
    const { headers = [], rows = [] } = slide.excel_data;
    const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));

    if (currentExcelPage >= totalPages) {
      currentExcelPage = 0;
    }

    const startIdx = currentExcelPage * ROWS_PER_PAGE;
    const pageRows = rows.slice(startIdx, startIdx + ROWS_PER_PAGE);

    if (metaEl) {
      metaEl.textContent = `Hal ${currentExcelPage + 1}/${totalPages} (${rows.length} Data) • Update ${updatedTime}`;
    }

    // Header Kolom Tabel dengan Sanitasi & Efek Kaca
    const theadHtml = `
      <th class="w-16 px-4 py-4 text-center text-base lg:text-lg font-black uppercase tracking-wider text-blue-300 bg-slate-950/80 border-b-2 border-blue-400/50">
        No
      </th>
      ${headers.map(h => `
        <th class="px-6 py-4 text-left text-base lg:text-lg font-black uppercase tracking-wider text-blue-200 bg-slate-950/80 border-b-2 border-blue-400/50">
          ${escapeHtml(h)}
        </th>
      `).join('')}
    `;

    // Baris Isi Tabel dengan nomor urut, auto-badge status, dan kaca transparan halus
    const tbodyHtml = pageRows.map((row, idx) => {
      const isEven = idx % 2 === 0;
      const rowBg = isEven ? 'bg-slate-950/55 hover:bg-slate-900/70' : 'bg-slate-900/40 hover:bg-slate-900/65';
      const rowNumber = startIdx + idx + 1;
      const animationDelay = (idx * 0.04).toFixed(2);
      
      const cells = headers.map((_, colIdx) => {
        const rawVal = row[colIdx] !== undefined && row[colIdx] !== null && String(row[colIdx]).trim() !== '' 
          ? String(row[colIdx]) 
          : '-';
        
        const isStatusCol = headers[colIdx] && headers[colIdx].toLowerCase().includes('status');
        let cellFormatted = escapeHtml(rawVal);
        
        if (isStatusCol) {
          const lowerVal = rawVal.toLowerCase();
          if (lowerVal.includes('selesai') || lowerVal.includes('hadir') || lowerVal.includes('aktif') || lowerVal.includes('sukses')) {
            cellFormatted = `<span class="inline-flex items-center px-3.5 py-1 text-base lg:text-lg font-extrabold rounded-xl bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-sm"><span class="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>${escapeHtml(rawVal)}</span>`;
          } else if (lowerVal.includes('berlangsung') || lowerVal.includes('proses') || lowerVal.includes('jalan')) {
            cellFormatted = `<span class="inline-flex items-center px-3.5 py-1 text-base lg:text-lg font-extrabold rounded-xl bg-blue-500/25 text-blue-200 border border-blue-400/40 shadow-sm animate-pulse"><span class="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-ping"></span>${escapeHtml(rawVal)}</span>`;
          } else if (lowerVal.includes('menunggu') || lowerVal.includes('tunda') || lowerVal.includes('jadwal')) {
            cellFormatted = `<span class="inline-flex items-center px-3.5 py-1 text-base lg:text-lg font-extrabold rounded-xl bg-amber-500/25 text-amber-200 border border-amber-400/40 shadow-sm"><span class="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>${escapeHtml(rawVal)}</span>`;
          } else if (lowerVal.includes('batal') || lowerVal.includes('tidak') || lowerVal.includes('kosong')) {
            cellFormatted = `<span class="inline-flex items-center px-3.5 py-1 text-base lg:text-lg font-extrabold rounded-xl bg-rose-500/25 text-rose-200 border border-rose-400/40 shadow-sm"><span class="w-2 h-2 rounded-full bg-rose-400 mr-2"></span>${escapeHtml(rawVal)}</span>`;
          }
        }

        return `
          <td class="px-6 py-4 text-xl lg:text-2xl font-bold text-white border-b border-slate-700/50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            ${cellFormatted}
          </td>
        `;
      }).join('');

      return `
        <tr class="${rowBg} transition-colors table-row-enter" style="animation-delay: ${animationDelay}s">
          <td class="w-16 px-4 py-4 text-center text-lg lg:text-xl font-mono font-bold text-blue-200 border-b border-slate-700/50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            ${rowNumber}
          </td>
          ${cells}
        </tr>
      `;
    }).join('');

    const hasCustomBg = !!(slide.image_url && typeof slide.image_url === 'string' && slide.image_url.trim() !== '');
    const safeBgUrl = hasCustomBg ? encodeURI(slide.image_url) : '';

    stage.innerHTML = `
      <div class="relative w-full h-full p-6 lg:p-10 flex flex-col justify-center slide-enter overflow-hidden">
        ${hasCustomBg ? `
          <!-- Gambar Latar Belakang Tabel (Terang, Jelas, & Kontras) -->
          <img 
            src="${safeBgUrl}" 
            alt="" 
            aria-hidden="true" 
            class="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] contrast-105 saturate-110 pointer-events-none select-none"
            onerror="this.style.display='none'"
          />
          <!-- Lapisan Halus agar Teks Tetap Nyaman Dibaca -->
          <div class="absolute inset-0 bg-slate-950/25 backdrop-blur-[1px] pointer-events-none"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/40 pointer-events-none"></div>
        ` : `
          <!-- Background Ambient Dark Mesh (Jika tanpa gambar) -->
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-slate-950/90 to-black pointer-events-none"></div>
        `}
        <!-- Frosted Glass Table Card (Semi-transparan elegan) -->
        <div class="relative z-10 w-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-slate-950/60 backdrop-blur-md">
          <table class="w-full border-collapse">
            <thead>
              <tr>${theadHtml}</tr>
            </thead>
            <tbody>
              ${tbodyHtml || '<tr><td colspan="15" class="p-8 text-center text-slate-500 text-xl">Tidak ada baris data</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const pageDuration = slide.duration || 15;
    startCountdown(pageDuration, () => {
      if (currentExcelPage + 1 < totalPages) {
        currentExcelPage++;
        renderSlide(slide, isPinnedMode);
      } else {
        currentExcelPage = 0;
        if (!isPinnedMode) {
          currentSlideIndex = (currentSlideIndex + 1) % allSlides.length;
          evaluatePlayback(true);
        } else {
          renderSlide(slide, true);
        }
      }
    });
  }
}

// ------------------------------------------------------------
// 7. PROGRESS BAR & TIMER HITUNG MUNDUR
// ------------------------------------------------------------
function startCountdown(seconds, onComplete) {
  clearTimers();
  if (isPaused) return;

  const durationMs = seconds * 1000;
  const startTime = Date.now();
  remainingSeconds = seconds;

  progressInterval = setInterval(() => {
    if (isPaused) return;
    const elapsed = Date.now() - startTime;
    const pct = Math.min(100, (elapsed / durationMs) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
  }, 80);

  slideTimer = setTimeout(() => {
    clearTimers();
    if (!isPaused) {
      onComplete();
    }
  }, durationMs);
}

function clearTimers() {
  if (slideTimer) clearTimeout(slideTimer);
  if (progressInterval) clearInterval(progressInterval);
  slideTimer = null;
  progressInterval = null;
}

// ------------------------------------------------------------
// 8. SUBSCRIPTION REAL-TIME (SUPABASE & BROWSER EVENT)
// ------------------------------------------------------------
function setupRealtimeListeners() {
  if (isSupabaseConfigured() && supabaseClient) {
    try {
      supabaseClient
        .channel('tv-lobby-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'slides' }, (payload) => {
          console.log('Realtime slides update:', payload);
          fetchSlides();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
          console.log('Realtime settings update:', payload);
          fetchSettings();
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            updateNetworkStatus('online', 'LIVE');
          }
        });
    } catch (err) {
      console.warn('Realtime channel error:', err);
    }
  }

  // BroadcastChannel untuk sinkronisasi seketika antar-tab tanpa delay bahkan di file:///
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const tvSyncChannel = new BroadcastChannel('tv_signage_channel');
      tvSyncChannel.onmessage = (event) => {
        if (event.data?.type === 'slides') {
          fetchSlides();
        } else if (event.data?.type === 'settings') {
          fetchSettings();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel tidak didukung:', e);
    }
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'TV_SIGNAGE_LOCAL_SLIDES' || e.key === 'cached_tv_slides') {
      fetchSlides();
    }
    if (e.key === 'TV_SIGNAGE_LOCAL_SETTINGS' || e.key === 'cached_tv_settings') {
      fetchSettings();
    }
  });

  window.addEventListener('online', () => {
    updateNetworkStatus('online', 'ONLINE');
    fetchSlides();
    fetchSettings();
  });
  window.addEventListener('offline', () => {
    updateNetworkStatus('cached', 'OFFLINE CACHE');
  });
}

// ------------------------------------------------------------
// 9. PINTASAN KEYBOARD & KONTROL TEKNISI TERSEMBUNYI
// ------------------------------------------------------------
function setupTechnicianControls() {
  document.body.addEventListener('click', () => {
    toggleFullScreen();
  });

  let cursorTimer = null;
  window.addEventListener('mousemove', () => {
    document.body.classList.add('show-cursor');
    if (cursorTimer) clearTimeout(cursorTimer);
    cursorTimer = setTimeout(() => {
      document.body.classList.remove('show-cursor');
    }, 2500);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
      toggleFullScreen();
    }
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      clearTimers();
      currentSlideIndex = (currentSlideIndex + 1) % Math.max(1, allSlides.length);
      currentExcelPage = 0;
      evaluatePlayback(true);
    }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      clearTimers();
      currentSlideIndex = (currentSlideIndex - 1 + allSlides.length) % Math.max(1, allSlides.length);
      currentExcelPage = 0;
      evaluatePlayback(true);
    }
    else if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      isPaused = !isPaused;
      if (isPaused) {
        clearTimers();
        if (metaEl) metaEl.textContent += ' [JEDA]';
        if (pauseIndicator) pauseIndicator.classList.remove('hidden');
      } else {
        if (pauseIndicator) pauseIndicator.classList.add('hidden');
        evaluatePlayback(true);
      }
    }
    else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      fetchSlides();
      fetchSettings();
    }
  });

  if (quickHint) {
    setTimeout(() => {
      quickHint.style.opacity = '0';
      setTimeout(() => quickHint.remove(), 1000);
    }, 6000);
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
}

// ------------------------------------------------------------
// 10. INISIALISASI SAAT HALAMAN DIBUKA
// ------------------------------------------------------------
fetchSettings();
fetchSlides();
setupRealtimeListeners();
setupTechnicianControls();
