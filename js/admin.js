// ============================================================
// ADMIN.JS - LOGIKA DASHBOARD PUSAT KENDALI DIGITAL SIGNAGE
// ============================================================

// Referensi DOM Section
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginAlert = document.getElementById('login-alert');
const btnLogout = document.getElementById('btn-logout');
const userEmailLabel = document.getElementById('user-email-label');
const connBadge = document.getElementById('conn-badge');
const slideCountBadge = document.getElementById('slide-count-badge');
const toastContainer = document.getElementById('toast-container');

// Form Tambah Konten
const contentForm = document.getElementById('content-form');
const inputTitle = document.getElementById('input-title');
const inputType = document.getElementById('input-type');
const inputDuration = document.getElementById('input-duration');
const inputStartDate = document.getElementById('input-start-date');
const inputEndDate = document.getElementById('input-end-date');
const inputPinNow = document.getElementById('input-pin-now');
const btnSubmitSlide = document.getElementById('btn-submit-slide');

// Wrapper Upload Gambar & Excel
const wrapperFileImage = document.getElementById('wrapper-file-image');
const inputFileImage = document.getElementById('input-file-image');
const imagePreviewBox = document.getElementById('image-preview-box');
const imagePreviewThumb = document.getElementById('image-preview-thumb');
const imagePreviewInfo = document.getElementById('image-preview-info');
const dropzoneImage = document.getElementById('dropzone-image');

// Wrapper Upload Video
const wrapperFileVideo = document.getElementById('wrapper-file-video');
const inputFileVideo = document.getElementById('input-file-video');
const videoPreviewBox = document.getElementById('video-preview-box');
const videoPreviewInfo = document.getElementById('video-preview-info');
const videoPreviewPlayer = document.getElementById('video-preview-player');
const dropzoneVideo = document.getElementById('dropzone-video');

// Wrapper Upload Link Media / YouTube
const wrapperFileLink = document.getElementById('wrapper-file-link');
const inputMediaUrl = document.getElementById('input-media-url');
const btnTestLink = document.getElementById('btn-test-link');
const linkPreviewBox = document.getElementById('link-preview-box');
const linkPreviewTypeBadge = document.getElementById('link-preview-type-badge');
const linkPreviewStage = document.getElementById('link-preview-stage');

const wrapperFileExcel = document.getElementById('wrapper-file-excel');
const inputFileExcel = document.getElementById('input-file-excel');
const excelSummaryBox = document.getElementById('excel-summary-box');
const excelSummaryStats = document.getElementById('excel-summary-stats');
const excelSummaryPages = document.getElementById('excel-summary-pages');
const excelTablePreview = document.getElementById('excel-table-preview');
const dropzoneExcel = document.getElementById('dropzone-excel');

// Running Text Form
const tickerForm = document.getElementById('ticker-form');
const inputOfficeName = document.getElementById('input-office-name');
const inputRunningText = document.getElementById('input-running-text');
const btnSaveTicker = document.getElementById('btn-save-ticker');

// Pengaturan Musik Latar Lobi (BGM)
const bgmToggleSwitch = document.getElementById('bgm-toggle-switch');
const formBgm = document.getElementById('form-bgm');
const btnBgmSourceFile = document.getElementById('btn-bgm-source-file');
const btnBgmSourceLink = document.getElementById('btn-bgm-source-link');
const wrapperBgmFile = document.getElementById('wrapper-bgm-file');
const inputBgmFile = document.getElementById('input-bgm-file');
const bgmCurrentFileBadge = document.getElementById('bgm-current-file-badge');
const bgmCurrentFileLabel = document.getElementById('bgm-current-file-label');
const wrapperBgmLink = document.getElementById('wrapper-bgm-link');
const inputBgmUrl = document.getElementById('input-bgm-url');
const btnTestBgmLink = document.getElementById('btn-test-bgm-link');
const inputBgmTitle = document.getElementById('input-bgm-title');
const inputBgmVolume = document.getElementById('input-bgm-volume');
const bgmVolumeVal = document.getElementById('bgm-volume-val');
const bgmAdminPreviewBox = document.getElementById('bgm-admin-preview-box');
const bgmAdminAudio = document.getElementById('bgm-admin-audio');
const btnStopPreviewBgm = document.getElementById('btn-stop-preview-bgm');
const btnSaveBgm = document.getElementById('btn-save-bgm');
let currentBgmSourceType = 'file';
let existingBgmUrl = '';

// Banner Pinned Live
const pinAlertBanner = document.getElementById('pin-alert-banner');
const pinAlertText = document.getElementById('pin-alert-text');
const btnUnpinBanner = document.getElementById('btn-unpin-banner');

// Slides List & Quick Excel Update
const slidesList = document.getElementById('slides-list');
const quickExcelInput = document.getElementById('quick-excel-input');
let currentSlideFilter = 'all';
let slideIdToUpdateExcel = null;
let parsedExcelBuffer = null;

// Modal Edit Slide
const modalEditSlide = document.getElementById('modal-edit-slide');
const btnCloseEditModal = document.getElementById('btn-close-edit-modal');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const formEditSlide = document.getElementById('form-edit-slide');
const editSlideId = document.getElementById('edit-slide-id');
const editInputTitle = document.getElementById('edit-input-title');
const editInputDuration = document.getElementById('edit-input-duration');
const editInputPin = document.getElementById('edit-input-pin');
const editInputStartDate = document.getElementById('edit-input-start-date');
const editInputEndDate = document.getElementById('edit-input-end-date');
const editWrapperImage = document.getElementById('edit-wrapper-image');
const editInputFileImage = document.getElementById('edit-input-file-image');
const editImageCurrentThumb = document.getElementById('edit-image-current-thumb');

// Edit Modal Video Elements
const editWrapperVideo = document.getElementById('edit-wrapper-video');
const editVideoCurrentPlayer = document.getElementById('edit-video-current-player');
const editInputFileVideo = document.getElementById('edit-input-file-video');

// Edit Modal Link Elements
const editWrapperLink = document.getElementById('edit-wrapper-link');
const editInputMediaUrl = document.getElementById('edit-input-media-url');
const btnEditTestLink = document.getElementById('btn-edit-test-link');
const editLinkPreviewBox = document.getElementById('edit-link-preview-box');
const editWrapperExcel = document.getElementById('edit-wrapper-excel');
const editInputFileExcel = document.getElementById('edit-input-file-excel');
const editExcelInfoStats = document.getElementById('edit-excel-info-stats');
const btnSaveEdit = document.getElementById('btn-save-edit');

// Excel Background Elements (Upload Form)
const inputExcelBgFile = document.getElementById('input-excel-bg-file');
const inputExcelBgUrl = document.getElementById('input-excel-bg-url');
const excelBgPreviewBox = document.getElementById('excel-bg-preview-box');
const excelBgPreviewThumb = document.getElementById('excel-bg-preview-thumb');
const btnClearExcelBg = document.getElementById('btn-clear-excel-bg');

// Excel Background Elements (Edit Modal)
const editInputExcelBgFile = document.getElementById('edit-input-excel-bg-file');
const editInputExcelBgUrl = document.getElementById('edit-input-excel-bg-url');
const editExcelBgPreviewBox = document.getElementById('edit-excel-bg-preview-box');
const editExcelBgPreviewThumb = document.getElementById('edit-excel-bg-preview-thumb');
const btnEditClearExcelBg = document.getElementById('btn-edit-clear-excel-bg');

// Live Excel Editor Elements (Modal Edit)
const editExcelLiveBadge = document.getElementById('edit-excel-live-badge');
const editExcelTable = document.getElementById('edit-excel-table');
const editExcelThead = document.getElementById('edit-excel-thead');
const editExcelTbody = document.getElementById('edit-excel-tbody');
const btnEditAddRow = document.getElementById('btn-edit-add-row');
const btnEditAddCol = document.getElementById('btn-edit-add-col');
const btnEditResetTable = document.getElementById('btn-edit-reset-table');

let editLiveExcelState = { headers: [], rows: [] };
let originalEditExcelState = null;

// BroadcastChannel Sinkronisasi Real-Time Instan Antar-Tab (TV & Admin)
const syncChannel = (typeof BroadcastChannel !== 'undefined') 
  ? new BroadcastChannel('tv_signage_channel') 
  : null;

function notifyTvUpdate(type = 'slides') {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type, timestamp: Date.now() });
    } catch (e) {}
  }
}

// Preview Modal & Setup Modal
const modalPreview = document.getElementById('modal-preview');
const btnClosePreview = document.getElementById('btn-close-preview');
const btnPreviewModalTrigger = document.getElementById('btn-preview-modal-trigger');
const previewTvTitle = document.getElementById('preview-tv-title');
const previewTvStage = document.getElementById('preview-tv-stage');
const previewTvTicker = document.getElementById('preview-tv-ticker');

const modalSupabase = document.getElementById('modal-supabase');
const btnOpenSupabaseSetup = document.getElementById('btn-open-supabase-setup');
const btnSettingsModal = document.getElementById('btn-settings-modal');
const btnCloseSupabaseModal = document.getElementById('btn-close-supabase-modal');
const formSupabaseConfig = document.getElementById('form-supabase-config');
const cfgSupabaseUrl = document.getElementById('cfg-supabase-url');
const cfgSupabaseKey = document.getElementById('cfg-supabase-key');
const btnResetDemo = document.getElementById('btn-reset-demo');

// Modal Helper (Mencegah bug modal tembus klik di PC)
function openModal(el) {
  if (!el) return;
  el.style.display = 'flex';
  el.classList.remove('hidden');
}

function closeModal(el) {
  if (!el) return;
  el.style.display = 'none';
  el.classList.add('hidden');
}

// Pastikan semua modal tertutup rapat saat inisialisasi awal
[modalPreview, modalSupabase, modalEditSlide].forEach(closeModal);

// State User
let currentUser = null;
let isDemoSession = false;
let currentSlidesData = [];

// ------------------------------------------------------------
// Helper Sanitasi HTML (Cegah XSS)
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
// Modern Toast Notification System
// ------------------------------------------------------------
function showToast(message, type = 'success') {
  if (!toastContainer) {
    alert(message);
    return;
  }

  const toast = document.createElement('div');
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const bgStyles = {
    success: 'bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-500/10',
    error: 'bg-rose-950/95 text-white border-rose-500/40 shadow-rose-500/10',
    info: 'bg-slate-900/95 text-white border-blue-500/40 shadow-blue-500/10',
    warning: 'bg-amber-950/95 text-white border-amber-500/40 shadow-amber-500/10'
  };

  toast.className = `p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-3 text-xs font-semibold pointer-events-auto toast-animate-in ${bgStyles[type] || bgStyles.info}`;
  toast.innerHTML = `
    <span class="text-base">${icons[type] || 'ℹ️'}</span>
    <span class="flex-1 leading-snug">${escapeHtml(message)}</span>
    <button class="text-slate-400 hover:text-white p-1 font-bold text-sm">✕</button>
  `;

  const closeBtn = toast.querySelector('button');
  const dismiss = () => {
    toast.classList.remove('toast-animate-in');
    toast.classList.add('toast-animate-out');
    setTimeout(() => toast.remove(), 250);
  };

  closeBtn.addEventListener('click', dismiss);
  setTimeout(dismiss, 4000);

  toastContainer.appendChild(toast);
}

// Format Tanggal Default Hari ini dan +30 Hari
const todayStr = new Date().toISOString().split('T')[0];
const nextMonthStr = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
if (inputStartDate) inputStartDate.value = todayStr;
if (inputEndDate) inputEndDate.value = nextMonthStr;

// ------------------------------------------------------------
// 1. AUTENTIKASI ADMIN & CEK SESI
// ------------------------------------------------------------
async function checkAuth() {
  const demoUser = sessionStorage.getItem('TV_SIGNAGE_DEMO_USER');
  if (demoUser) {
    currentUser = { email: demoUser };
    isDemoSession = true;
    showDashboard();
    return;
  }

  if (isSupabaseConfigured() && supabaseClient) {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
        isDemoSession = false;
        showDashboard();
        return;
      }
    } catch (e) {
      console.warn('Cek sesi Supabase gagal:', e);
    }
  }

  showLogin();
}

function showLogin() {
  loginSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
}

function showDashboard() {
  loginSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');

  userEmailLabel.textContent = currentUser ? currentUser.email : 'admin@kantor.com';

  if (isDemoSession || !isSupabaseConfigured()) {
    connBadge.textContent = 'DEMO / LOCAL';
    connBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 text-sky-700';
  } else {
    connBadge.textContent = 'SUPABASE LIVE';
    connBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700';
  }

  loadSettings();
  loadAdminSlides();
  setupRealtimeAdmin();
}

// Handler Submit Form Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const submitBtn = document.getElementById('login-submit-btn');

  loginAlert.classList.add('hidden');

  if (isSupabaseConfigured() && supabaseClient) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Menghubungkan...</span>`;
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      currentUser = data.user;
      isDemoSession = false;
      showToast('Berhasil masuk ke panel kontrol!', 'success');
      showDashboard();
    } catch (err) {
      loginAlert.textContent = 'Gagal masuk: ' + (err.message || 'Email atau password salah');
      loginAlert.className = 'mb-4 p-3.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200';
      loginAlert.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Masuk ke Dashboard</span>`;
    }
  } else {
    currentUser = { email: email || 'admin-local@kantor.com' };
    sessionStorage.setItem('TV_SIGNAGE_DEMO_USER', currentUser.email);
    isDemoSession = true;
    showToast('Masuk dalam Mode Demo (Penyimpanan Lokal)', 'info');
    showDashboard();
  }
});

// Logout
if (btnLogout) {
  btnLogout.addEventListener('click', async () => {
    if (confirm('Keluar dari panel admin TV?')) {
      try {
        sessionStorage.removeItem('TV_SIGNAGE_DEMO_USER');
        sessionStorage.clear();

        // Bersihkan token autentikasi Supabase dari storage agar tidak auto-login kembali
        try {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (k && (k.startsWith('sb-') || k.includes('supabase.auth.token'))) {
              localStorage.removeItem(k);
            }
          }
        } catch (storageErr) {}

        if (isSupabaseConfigured() && supabaseClient) {
          await supabaseClient.auth.signOut().catch(err => {
            console.warn('Supabase signOut error, tetap melanjutkan proses logout:', err);
          });
        }
      } catch (e) {
        console.warn('Logout catch error:', e);
      } finally {
        currentUser = null;
        isDemoSession = false;
        showLogin();

        // Bersihkan isian kata sandi di form login
        const passInput = document.getElementById('login-password');
        if (passInput) passInput.value = '';

        showToast('Berhasil keluar dari sesi admin', 'info');
      }
    }
  });
}

// ------------------------------------------------------------
// 2. PARSER & INPUT DINAMIS FORM KONTEN (GAMBAR vs EXCEL vs LINK)
// ------------------------------------------------------------
function updateTypeVisibility() {
  const type = inputType.value;
  if (wrapperFileImage) wrapperFileImage.classList.toggle('hidden', type !== 'image');
  if (wrapperFileVideo) wrapperFileVideo.classList.toggle('hidden', type !== 'video');
  if (wrapperFileLink) wrapperFileLink.classList.toggle('hidden', type !== 'link');
  if (wrapperFileExcel) wrapperFileExcel.classList.toggle('hidden', type !== 'excel');
}
inputType.addEventListener('change', updateTypeVisibility);

// Helper Pratinjau Tautan Link Media
function renderLinkPreview(url, stageEl, badgeEl, targetDurationInput = null) {
  if (!url || !stageEl) return;
  const media = (typeof parseMediaUrl === 'function') ? parseMediaUrl(url) : null;
  if (!media) {
    stageEl.innerHTML = `<p class="text-rose-400 text-xs p-4 text-center">Format URL tidak valid atau tidak dikenali</p>`;
    if (badgeEl) badgeEl.textContent = 'Tidak Valid';
    return;
  }

  if (badgeEl) {
    badgeEl.textContent = media.titleHint || media.type.toUpperCase();
  }

  if (media.type === 'youtube') {
    stageEl.innerHTML = `
      <iframe src="${media.embedUrl}" class="w-full h-full border-0 pointer-events-auto" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
  } else if (media.type === 'instagram') {
    stageEl.innerHTML = `
      <iframe src="${media.embedUrl}" class="w-full h-full border-0 bg-white" frameborder="0" scrolling="no" allowtransparency="true" allow="autoplay; encrypted-media"></iframe>
    `;
  } else if (media.type === 'tiktok') {
    stageEl.innerHTML = `
      <iframe src="${media.embedUrl}" class="w-full h-full border-0 bg-black" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
    `;
  } else if (media.type === 'video') {
    stageEl.innerHTML = `
      <video src="${encodeURI(media.embedUrl)}" class="w-full h-full object-contain" controls autoplay muted loop playsinline></video>
    `;
    const vid = stageEl.querySelector('video');
    if (vid) {
      vid.onloadedmetadata = () => {
        const sec = Math.round(vid.duration);
        const durationField = targetDurationInput || inputDuration;
        if (sec > 0 && durationField) {
          durationField.value = sec;
          showToast(`Durasi video terdeteksi otomatis: ${sec} detik (akan diputar full di TV)`, 'info');
        }
      };
    }
  } else if (media.type === 'image') {
    stageEl.innerHTML = `
      <img src="${encodeURI(media.embedUrl)}" class="w-full h-full object-contain" onerror="this.src='https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=1200&q=80'" />
    `;
  } else {
    stageEl.innerHTML = `
      <iframe src="${media.embedUrl}" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
  }
}

if (btnTestLink) {
  btnTestLink.addEventListener('click', () => {
    const url = inputMediaUrl ? inputMediaUrl.value.trim() : '';
    if (!url) {
      showToast('Masukkan tautan URL media terlebih dahulu', 'warning');
      return;
    }
    if (linkPreviewBox) linkPreviewBox.classList.remove('hidden');
    renderLinkPreview(url, linkPreviewStage, linkPreviewTypeBadge, inputDuration);
    showToast('Pratinjau tautan media berhasil dimuat', 'info');
  });
}

if (inputMediaUrl) {
  inputMediaUrl.addEventListener('change', () => {
    const url = inputMediaUrl.value.trim();
    if (url) {
      if (linkPreviewBox) linkPreviewBox.classList.remove('hidden');
      renderLinkPreview(url, linkPreviewStage, linkPreviewTypeBadge, inputDuration);
    }
  });
}

// Drag and drop helper
function setupDragAndDrop(dropzone, inputElement) {
  if (!dropzone || !inputElement) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dropzone-active');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dropzone-active');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      inputElement.files = files;
      inputElement.dispatchEvent(new Event('change'));
    }
  });
}
setupDragAndDrop(dropzoneImage, inputFileImage);
setupDragAndDrop(dropzoneVideo, inputFileVideo);
setupDragAndDrop(dropzoneExcel, inputFileExcel);

// Preview Video & Auto-detect Durasi
if (inputFileVideo) {
  inputFileVideo.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      if (videoPreviewBox) videoPreviewBox.classList.add('hidden');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showToast('Perhatian: Ukuran file video lebih dari 50MB. Disarankan mengompres video agar pemutaran di TV lancar.', 'warning');
    }

    const videoBlobUrl = URL.createObjectURL(file);
    if (videoPreviewPlayer) {
      videoPreviewPlayer.src = videoBlobUrl;
      videoPreviewPlayer.onloadedmetadata = () => {
        const seconds = Math.round(videoPreviewPlayer.duration);
        if (seconds > 0 && inputDuration) {
          inputDuration.value = Math.min(180, Math.max(5, seconds));
          showToast(`Durasi video terdeteksi otomatis: ${seconds} detik`, 'info');
        }
      };
    }
    if (videoPreviewInfo) {
      videoPreviewInfo.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
    }
    if (videoPreviewBox) videoPreviewBox.classList.remove('hidden');
  });
}

// Preview Thumbnail Gambar
inputFileImage.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) {
    imagePreviewBox.classList.add('hidden');
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreviewThumb.src = event.target.result;
    imagePreviewInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
    imagePreviewBox.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

// Parser File Excel dengan SheetJS
inputFileExcel.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) {
    excelSummaryBox.classList.add('hidden');
    parsedExcelBuffer = null;
    return;
  }

  try {
    const parsedData = await parseExcelFile(file);
    parsedExcelBuffer = parsedData;

    const rowCount = parsedData.rows.length;
    const colCount = parsedData.headers.length;
    const totalPages = Math.max(1, Math.ceil(rowCount / 8));

    excelSummaryStats.textContent = `Terbaca: ${colCount} Kolom, ${rowCount} Baris Data`;
    excelSummaryPages.textContent = `${totalPages} Halaman di TV (8 baris/layar)`;

    // Cuplikan Tabel (Maksimal 3 baris pertama)
    let sampleHtml = `<table class="w-full text-left border-collapse">`;
    sampleHtml += `<thead><tr class="bg-emerald-100/80 border-b border-emerald-200">`;
    parsedData.headers.forEach(h => {
      sampleHtml += `<th class="p-2 font-bold text-emerald-950">${escapeHtml(h)}</th>`;
    });
    sampleHtml += `</tr></thead><tbody>`;

    const sampleRows = parsedData.rows.slice(0, 3);
    sampleRows.forEach(row => {
      sampleHtml += `<tr class="border-b border-emerald-100">`;
      parsedData.headers.forEach((_, cIdx) => {
        sampleHtml += `<td class="p-2 text-slate-700">${row[cIdx] !== undefined ? escapeHtml(row[cIdx]) : '-'}</td>`;
      });
      sampleHtml += `</tr>`;
    });
    sampleHtml += `</tbody></table>`;

    excelTablePreview.innerHTML = sampleHtml;
    excelSummaryBox.classList.remove('hidden');
    showToast(`File Excel berhasil dibaca (${rowCount} baris)`, 'success');
  } catch (err) {
    showToast('Gagal membaca file Excel: ' + err.message, 'error');
    inputFileExcel.value = '';
    excelSummaryBox.classList.add('hidden');
    parsedExcelBuffer = null;
  }
});

// Helper Fungsi Baca Excel (.xlsx / .csv)
function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!jsonData || jsonData.length === 0) {
          throw new Error('File Excel kosong');
        }

        const headers = jsonData[0].map(h => (h !== undefined && h !== null) ? String(h).trim() : '');
        const rows = jsonData.slice(1).filter(r => r.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== ''));

        resolve({ headers, rows });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// ------------------------------------------------------------
// HANDLER BACKGROUND EXCEL (FORM TAMBAH & MODAL EDIT)
// ------------------------------------------------------------
// Preset Background (Form Tambah)
document.querySelectorAll('.btn-excel-bg-preset').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    if (inputExcelBgUrl) inputExcelBgUrl.value = url;
    if (excelBgPreviewThumb) excelBgPreviewThumb.src = url;
    if (excelBgPreviewBox) excelBgPreviewBox.classList.remove('hidden');
    if (inputExcelBgFile) inputExcelBgFile.value = '';
    showToast('Background preset dipilih', 'info');
  });
});

if (btnClearExcelBg) {
  btnClearExcelBg.addEventListener('click', () => {
    if (inputExcelBgUrl) inputExcelBgUrl.value = '';
    if (inputExcelBgFile) inputExcelBgFile.value = '';
    if (excelBgPreviewBox) excelBgPreviewBox.classList.add('hidden');
    showToast('Background tabel dihapus', 'info');
  });
}

if (inputExcelBgFile) {
  inputExcelBgFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (excelBgPreviewThumb) excelBgPreviewThumb.src = event.target.result;
      if (excelBgPreviewBox) excelBgPreviewBox.classList.remove('hidden');
      if (inputExcelBgUrl) inputExcelBgUrl.value = '';
    };
    reader.readAsDataURL(file);
  });
}

// Preset Background (Modal Edit)
document.querySelectorAll('.btn-edit-excel-bg-preset').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    if (editInputExcelBgUrl) editInputExcelBgUrl.value = url;
    if (editExcelBgPreviewThumb) editExcelBgPreviewThumb.src = url;
    if (editExcelBgPreviewBox) editExcelBgPreviewBox.classList.remove('hidden');
    if (editInputExcelBgFile) editInputExcelBgFile.value = '';
    showToast('Background preset dipilih', 'info');
  });
});

if (btnEditClearExcelBg) {
  btnEditClearExcelBg.addEventListener('click', () => {
    if (editInputExcelBgUrl) editInputExcelBgUrl.value = '';
    if (editInputExcelBgFile) editInputExcelBgFile.value = '';
    if (editExcelBgPreviewBox) editExcelBgPreviewBox.classList.add('hidden');
    showToast('Background tabel dihapus', 'info');
  });
}

if (editInputExcelBgFile) {
  editInputExcelBgFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (editExcelBgPreviewThumb) editExcelBgPreviewThumb.src = event.target.result;
      if (editExcelBgPreviewBox) editExcelBgPreviewBox.classList.remove('hidden');
      if (editInputExcelBgUrl) editInputExcelBgUrl.value = '';
    };
    reader.readAsDataURL(file);
  });
}

// ------------------------------------------------------------
// LOGIKA LIVE SPREADSHEET EDITOR (MODAL EDIT EXCEL)
// ------------------------------------------------------------
function renderLiveExcelEditor() {
  if (!editExcelThead || !editExcelTbody) return;

  const { headers = [], rows = [] } = editLiveExcelState;

  // Render Header Tabel (Thead)
  let theadHtml = '<tr><th class="p-2 w-10 text-center text-slate-400 font-mono text-[11px] bg-slate-100 border-r border-slate-200">#</th>';
  headers.forEach((h, colIdx) => {
    theadHtml += `
      <th class="p-1.5 border-r border-slate-200 bg-slate-100 min-w-[140px]">
        <div class="flex items-center gap-1">
          <input 
            type="text" 
            class="edit-col-header w-full px-2 py-1 bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded text-xs font-bold text-slate-800 outline-none shadow-xs transition" 
            value="${escapeHtml(h)}" 
            data-col="${colIdx}" 
            placeholder="Header ${colIdx + 1}"
          />
          <button 
            type="button" 
            class="btn-del-col text-slate-400 hover:text-rose-600 p-1 text-xs font-bold transition rounded hover:bg-rose-50" 
            data-col="${colIdx}" 
            title="Hapus Kolom Ini"
          >✕</button>
        </div>
      </th>
    `;
  });
  theadHtml += '<th class="p-2 w-12 text-center text-slate-400 text-xs bg-slate-100">Aksi</th></tr>';
  editExcelThead.innerHTML = theadHtml;

  // Render Baris Data (Tbody)
  if (rows.length === 0) {
    editExcelTbody.innerHTML = `
      <tr>
        <td colspan="${headers.length + 2}" class="p-6 text-center text-slate-400 text-xs italic">
          Belum ada data baris. Klik tombol <b>"➕ Tambah Baris"</b> di atas untuk menambahkan baris baru.
        </td>
      </tr>
    `;
  } else {
    let tbodyHtml = '';
    rows.forEach((row, rowIdx) => {
      tbodyHtml += `
        <tr class="hover:bg-emerald-50/30 transition">
          <td class="p-2 text-center text-slate-400 font-mono text-[11px] bg-slate-50/70 border-r border-slate-100 select-none">
            ${rowIdx + 1}
          </td>
      `;

      headers.forEach((_, colIdx) => {
        const val = (row[colIdx] !== undefined && row[colIdx] !== null) ? String(row[colIdx]) : '';
        tbodyHtml += `
          <td class="p-1 border-r border-slate-100">
            <input 
              type="text" 
              class="edit-cell-input w-full px-2.5 py-1.5 bg-slate-50/60 hover:bg-white focus:bg-white border border-transparent hover:border-slate-200 focus:border-emerald-500 rounded text-xs text-slate-800 font-medium outline-none transition" 
              value="${escapeHtml(val)}" 
              data-row="${rowIdx}" 
              data-col="${colIdx}" 
            />
          </td>
        `;
      });

      tbodyHtml += `
          <td class="p-1 text-center">
            <button 
              type="button" 
              class="btn-del-row text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition font-bold text-xs" 
              data-row="${rowIdx}" 
              title="Hapus baris ${rowIdx + 1}"
            >🗑️</button>
          </td>
        </tr>
      `;
    });
    editExcelTbody.innerHTML = tbodyHtml;
  }

  // Update Badges & Stats
  if (editExcelLiveBadge) {
    editExcelLiveBadge.textContent = `${rows.length} Baris, ${headers.length} Kolom`;
  }
  if (editExcelInfoStats) {
    editExcelInfoStats.textContent = `Terbaca: ${headers.length} Kolom, ${rows.length} Baris`;
  }
}

// Event input edit header
if (editExcelThead) {
  editExcelThead.addEventListener('input', (e) => {
    if (e.target.classList.contains('edit-col-header')) {
      const colIdx = parseInt(e.target.dataset.col, 10);
      if (editLiveExcelState.headers && editLiveExcelState.headers[colIdx] !== undefined) {
        editLiveExcelState.headers[colIdx] = e.target.value;
      }
    }
  });

  editExcelThead.addEventListener('click', (e) => {
    const delColBtn = e.target.closest('.btn-del-col');
    if (delColBtn) {
      const colIdx = parseInt(delColBtn.dataset.col, 10);
      if (editLiveExcelState.headers.length <= 1) {
        showToast('Tabel minimal harus memiliki 1 kolom!', 'warning');
        return;
      }
      const colName = editLiveExcelState.headers[colIdx] || `Kolom ${colIdx + 1}`;
      if (confirm(`Hapus kolom "${colName}" beserta seluruh isinya?`)) {
        editLiveExcelState.headers.splice(colIdx, 1);
        if (editLiveExcelState.rows) {
          editLiveExcelState.rows.forEach(r => {
            if (Array.isArray(r)) r.splice(colIdx, 1);
          });
        }
        renderLiveExcelEditor();
      }
    }
  });
}

// Event input edit sel tabel
if (editExcelTbody) {
  editExcelTbody.addEventListener('input', (e) => {
    if (e.target.classList.contains('edit-cell-input')) {
      const rowIdx = parseInt(e.target.dataset.row, 10);
      const colIdx = parseInt(e.target.dataset.col, 10);
      if (!editLiveExcelState.rows[rowIdx]) {
        editLiveExcelState.rows[rowIdx] = new Array(editLiveExcelState.headers.length).fill('');
      }
      editLiveExcelState.rows[rowIdx][colIdx] = e.target.value;
    }
  });

  editExcelTbody.addEventListener('click', (e) => {
    const delRowBtn = e.target.closest('.btn-del-row');
    if (delRowBtn) {
      const rowIdx = parseInt(delRowBtn.dataset.row, 10);
      editLiveExcelState.rows.splice(rowIdx, 1);
      renderLiveExcelEditor();
    }
  });
}

// Tambah Baris Baru
if (btnEditAddRow) {
  btnEditAddRow.addEventListener('click', () => {
    if (!editLiveExcelState.headers || editLiveExcelState.headers.length === 0) {
      editLiveExcelState.headers = ['Kolom 1', 'Kolom 2', 'Kolom 3'];
    }
    const newRow = new Array(editLiveExcelState.headers.length).fill('');
    if (!editLiveExcelState.rows) editLiveExcelState.rows = [];
    editLiveExcelState.rows.push(newRow);
    renderLiveExcelEditor();
    
    // Auto-scroll ke baris paling bawah dan fokuskan sel pertama
    setTimeout(() => {
      const tableContainer = editExcelTable ? editExcelTable.parentElement : null;
      if (tableContainer) tableContainer.scrollTop = tableContainer.scrollHeight;
      const lastRowInputs = editExcelTbody.querySelectorAll(`input[data-row="${editLiveExcelState.rows.length - 1}"]`);
      if (lastRowInputs.length > 0) lastRowInputs[0].focus();
    }, 50);
  });
}

// Tambah Kolom Baru
if (btnEditAddCol) {
  btnEditAddCol.addEventListener('click', () => {
    const newColNum = (editLiveExcelState.headers?.length || 0) + 1;
    const colName = prompt('Masukkan nama kolom baru:', `Kolom ${newColNum}`);
    if (colName !== null && colName.trim() !== '') {
      if (!editLiveExcelState.headers) editLiveExcelState.headers = [];
      editLiveExcelState.headers.push(colName.trim());
      if (editLiveExcelState.rows) {
        editLiveExcelState.rows.forEach(r => {
          if (Array.isArray(r)) r.push('');
        });
      }
      renderLiveExcelEditor();
      showToast(`Kolom "${colName.trim()}" berhasil ditambahkan`, 'info');
    }
  });
}

// Reset Tabel ke Asli
if (btnEditResetTable) {
  btnEditResetTable.addEventListener('click', () => {
    if (confirm('Kembalikan isi tabel ke data sebelum diedit?')) {
      editLiveExcelState = JSON.parse(JSON.stringify(originalEditExcelState || { headers: [], rows: [] }));
      renderLiveExcelEditor();
      showToast('Isi tabel dikembalikan ke versi awal', 'info');
    }
  });
}

// Ganti file via input file di modal edit (otomatis render ke live editor)
if (editInputFileExcel) {
  editInputFileExcel.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const parsed = await parseExcelFile(file);
      editLiveExcelState = parsed;
      renderLiveExcelEditor();
      showToast(`File dibaca: ${parsed.headers.length} Kolom, ${parsed.rows.length} Baris. Anda dapat langsung mengeditnya sebelum disimpan!`, 'success');
    } catch (err) {
      showToast(`Gagal membaca file Excel: ${err.message}`, 'error');
    }
  });
}

// Bersihkan duplikat cache lama secara otomatis saat buka admin untuk melegakan kuota 5MB browser
try {
  if (localStorage.getItem('cached_tv_slides') && localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES')) {
    localStorage.removeItem('cached_tv_slides');
  }
} catch (e) {}

// Kompresi Gambar Otomatis untuk Mode Demo (mencegah kuota localStorage 5MB jebol)
function compressImageToDataUrl(file, maxWidth = 1920, maxHeight = 1080, quality = 0.75) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Kompresi ke JPEG (mengurangi ukuran gambar drastis dari 5MB ke ~150KB tanpa penurunan kualitas visual di TV)
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

function compressDataUrlString(dataUrl, maxWidth = 1280, maxHeight = 720, quality = 0.6) {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length < 250000) {
      return resolve(dataUrl);
    }
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// Penyimpanan Aman dengan penanganan otomatis jika kuota localStorage penuh
async function saveLocalSlidesSafely(slides) {
  localStorage.removeItem('cached_tv_slides');

  try {
    localStorage.setItem('TV_SIGNAGE_LOCAL_SLIDES', JSON.stringify(slides));
    return true;
  } catch (err) {
    console.warn('LocalStorage penuh, menjalankan auto-compress darurat...', err);
    
    // Auto-compress seluruh slide gambar yang besar
    const compressedSlides = [];
    for (const slide of slides) {
      if (slide.type === 'image' && slide.image_url && slide.image_url.startsWith('data:image/')) {
        const compressedUrl = await compressDataUrlString(slide.image_url, 1280, 720, 0.55);
        compressedSlides.push({ ...slide, image_url: compressedUrl });
      } else {
        compressedSlides.push(slide);
      }
    }

    try {
      localStorage.setItem('TV_SIGNAGE_LOCAL_SLIDES', JSON.stringify(compressedSlides));
      showToast('Gambar otomatis dioptimasi agar pas di memori lokal browser', 'info');
      return true;
    } catch (finalErr) {
      throw new Error("Kapasitas penyimpanan lokal browser (5MB) sudah penuh. Hapus 1-2 slide foto lama, atau hubungkan ke Supabase (gratis) untuk kapasitas penyimpanan foto tanpa batas.");
    }
  }
}

// ------------------------------------------------------------
// 3. SUBMIT FORM UNGGAH KONTEN BARU
// ------------------------------------------------------------
contentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = inputTitle.value.trim();
  const type = inputType.value;
  const duration = parseInt(inputDuration.value, 10) || 15;
  const start_date = inputStartDate.value;
  const end_date = inputEndDate.value;
  const is_pinned = inputPinNow.checked;

  if (!title) {
    showToast('Judul informasi wajib diisi!', 'warning');
    return;
  }

  btnSubmitSlide.disabled = true;
  btnSubmitSlide.innerHTML = `
    <svg class="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    <span>Menyimpan ke Layar TV...</span>
  `;

  try {
    let image_url = null;
    let excel_data = null;

    if (type === 'image') {
      const file = inputFileImage.files[0];
      if (!file) throw new Error('Silakan pilih file gambar poster');

      if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadErr } = await supabaseClient.storage
          .from('tv-media')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabaseClient.storage
          .from('tv-media')
          .getPublicUrl(fileName);
        image_url = publicUrlData.publicUrl;
      } else {
        image_url = await compressImageToDataUrl(file);
      }
    } else if (type === 'video') {
      const file = inputFileVideo ? inputFileVideo.files[0] : null;
      if (!file) throw new Error('Silakan pilih file video MP4/WEBM terlebih dahulu');

      if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
        const fileExt = file.name.split('.').pop();
        const fileName = `vid-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadErr } = await supabaseClient.storage
          .from('tv-media')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabaseClient.storage
          .from('tv-media')
          .getPublicUrl(fileName);
        image_url = publicUrlData.publicUrl;
      } else {
        throw new Error('Upload video membutuhkan koneksi Supabase Live karena kapasitas memori browser lokal tidak mencukupi untuk video.');
      }
    } else if (type === 'link') {
      const rawLink = inputMediaUrl ? inputMediaUrl.value.trim() : '';
      if (!rawLink) throw new Error('Silakan masukkan tautan link media (YouTube, video/foto online, atau web)');
      image_url = rawLink;
    } else {
      if (!parsedExcelBuffer) {
        const file = inputFileExcel.files[0];
        if (!file) throw new Error('Silakan pilih file Excel (.xlsx / .csv)');
        parsedExcelBuffer = await parseExcelFile(file);
      }
      excel_data = parsedExcelBuffer;

      // Cek background image untuk slide Excel
      const excelBgFile = inputExcelBgFile ? inputExcelBgFile.files[0] : null;
      if (excelBgFile) {
        if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
          const fileExt = excelBgFile.name.split('.').pop();
          const fileName = `bg-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const { error: uploadErr } = await supabaseClient.storage
            .from('tv-media')
            .upload(fileName, excelBgFile, { cacheControl: '3600', upsert: false });
          if (!uploadErr) {
            const { data: publicUrlData } = supabaseClient.storage
              .from('tv-media')
              .getPublicUrl(fileName);
            image_url = publicUrlData.publicUrl;
          }
        } else {
          image_url = await compressImageToDataUrl(excelBgFile);
        }
      } else if (inputExcelBgUrl && inputExcelBgUrl.value) {
        image_url = inputExcelBgUrl.value;
      }
    }

    const newSlide = {
      id: 'slide-' + Date.now(),
      title,
      type,
      image_url,
      excel_data,
      duration,
      start_date,
      end_date,
      is_pinned,
      is_active: true,
      author_email: currentUser ? currentUser.email : 'admin@kantor.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
      delete newSlide.id;
      const { error: insertErr } = await supabaseClient
        .from('slides')
        .insert([newSlide]);

      if (insertErr) throw insertErr;
    } else {
      let localSlides = JSON.parse(localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES') || '[]');
      if (is_pinned) {
        localSlides = localSlides.map(s => ({ ...s, is_pinned: false }));
      }
      localSlides.unshift(newSlide);
      await saveLocalSlidesSafely(localSlides);
    }

    // Reset Form & Kembalikan Tampilan Default
    contentForm.reset();
    inputStartDate.value = todayStr;
    inputEndDate.value = nextMonthStr;
    inputDuration.value = 15;
    imagePreviewBox.classList.add('hidden');
    if (videoPreviewBox) videoPreviewBox.classList.add('hidden');
    if (videoPreviewPlayer) videoPreviewPlayer.src = '';
    if (inputFileVideo) inputFileVideo.value = '';
    if (linkPreviewBox) linkPreviewBox.classList.add('hidden');
    if (inputMediaUrl) inputMediaUrl.value = '';
    excelSummaryBox.classList.add('hidden');
    if (excelBgPreviewBox) excelBgPreviewBox.classList.add('hidden');
    if (inputExcelBgFile) inputExcelBgFile.value = '';
    if (inputExcelBgUrl) inputExcelBgUrl.value = '';
    parsedExcelBuffer = null;
    updateTypeVisibility();

    showToast('Konten berhasil ditayangkan ke layar TV!', 'success');
    notifyTvUpdate('slides');
    loadAdminSlides();
  } catch (err) {
    showToast('Gagal mengunggah: ' + err.message, 'error');
  } finally {
    btnSubmitSlide.disabled = false;
    btnSubmitSlide.innerHTML = `<span>Tayangkan ke TV</span>`;
  }
});

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// ------------------------------------------------------------
// 4. LOAD & RENDER DAFTAR SLIDE PLAYLIST
// ------------------------------------------------------------
async function loadAdminSlides() {
  slidesList.innerHTML = `<div class="p-8 text-center text-slate-400 text-sm">Memuat daftar tayangan...</div>`;

  let slides = [];

  if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
    try {
      const { data, error } = await supabaseClient
        .from('slides')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data) {
        slides = data;
      }
    } catch (e) {
      console.warn('Gagal load dari Supabase:', e);
    }
  }

  if (slides.length === 0 && (!isSupabaseConfigured() || isDemoSession)) {
    const local = localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES');
    if (local) {
      try { slides = JSON.parse(local); } catch (e) {}
    }
  }

  currentSlidesData = slides;

  if (slideCountBadge) {
    slideCountBadge.textContent = slides.length;
  }

  // Cek Banner Pin
  const pinnedSlide = slides.find(s => s.is_pinned === true);
  if (pinnedSlide) {
    pinAlertText.textContent = `Slide "${escapeHtml(pinnedSlide.title)}" sedang mengunci layar TV secara eksklusif (oleh: ${escapeHtml(pinnedSlide.author_email || 'Admin')}).`;
    pinAlertBanner.classList.remove('hidden');
    btnUnpinBanner.onclick = () => togglePin(pinnedSlide.id, false);
  } else {
    pinAlertBanner.classList.add('hidden');
  }

  // Terapkan Filter
  const filteredSlides = slides.filter(slide => {
    if (currentSlideFilter === 'all') return true;
    if (currentSlideFilter === 'active') return slide.is_active;
    if (currentSlideFilter === 'pinned') return slide.is_pinned;
    if (currentSlideFilter === 'excel') return slide.type === 'excel';
    if (currentSlideFilter === 'image') return slide.type === 'image';
    if (currentSlideFilter === 'video') return slide.type === 'video';
    if (currentSlideFilter === 'link') return slide.type === 'link';
    return true;
  });

  if (filteredSlides.length === 0) {
    slidesList.innerHTML = `
      <div class="p-10 text-center text-slate-400 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
        <p class="font-bold text-slate-600">Tidak ada slide dalam filter ini.</p>
        <p class="text-xs text-slate-400 mt-1">Gunakan formulir di atas untuk menambahkan konten baru ke TV.</p>
      </div>
    `;
    return;
  }

  slidesList.innerHTML = filteredSlides.map(slide => {
    const safeTitle = escapeHtml(slide.title);
    const safeAuthor = escapeHtml(slide.author_email || '-');
    const safeImageUrl = slide.image_url ? encodeURI(slide.image_url) : '';

    let typeBadge = '';
    if (slide.type === 'excel') {
      typeBadge = `<span class="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1">📊 EXCEL (${slide.excel_data?.rows?.length || 0} baris)</span>`;
    } else if (slide.type === 'video') {
      typeBadge = `<span class="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 rounded-lg flex items-center gap-1">🎬 VIDEO</span>`;
    } else if (slide.type === 'link') {
      const media = (typeof parseMediaUrl === 'function') ? parseMediaUrl(slide.image_url) : null;
      const subLabel = media?.type === 'youtube' ? 'YOUTUBE' : (media?.type === 'video' ? 'VIDEO LINK' : (media?.type === 'image' ? 'FOTO LINK' : 'LINK WEB'));
      typeBadge = `<span class="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 rounded-lg flex items-center gap-1">🔗 ${subLabel}</span>`;
    } else {
      typeBadge = `<span class="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 rounded-lg flex items-center gap-1">🖼️ GAMBAR</span>`;
    }

    let statusBadge = '';
    if (slide.is_pinned) {
      statusBadge = `<span class="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white rounded-md shadow-xs animate-pulse">PINNED LIVE 📌</span>`;
    } else if (slide.is_active) {
      statusBadge = `<span class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md">TAYANG</span>`;
    } else {
      statusBadge = `<span class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 rounded-md">NONAKTIF</span>`;
    }

    const pinBtn = slide.is_pinned
      ? `<button onclick="togglePin('${slide.id}', false)" class="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl transition shadow-xs flex items-center gap-1">📌 Lepas Pin</button>`
      : `<button onclick="togglePin('${slide.id}', true)" class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-amber-50 active:scale-95 text-slate-700 hover:text-amber-800 rounded-xl transition border border-slate-200">Pin Live</button>`;

    const updateExcelBtn = slide.type === 'excel'
      ? `<button onclick="triggerQuickExcelUpdate('${slide.id}')" title="Ganti data file Excel tanpa isi ulang form" class="px-3 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 rounded-xl transition border border-blue-200 flex items-center gap-1">↻ Update Excel</button>`
      : '';

    const activeBtn = slide.is_active
      ? `<button onclick="toggleActive('${slide.id}', false)" title="Jeda dari playlist" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>`
      : `<button onclick="toggleActive('${slide.id}', true)" title="Aktifkan ke playlist" class="p-2 text-emerald-600 hover:text-emerald-700 rounded-xl hover:bg-emerald-50 transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>`;

    const cardBorder = slide.is_pinned 
      ? 'border-amber-400 bg-amber-50/20 ring-2 ring-amber-400/20 shadow-md' 
      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm';

    let thumbContent = '';
    if (slide.type === 'image' && safeImageUrl) {
      thumbContent = `<img src="${safeImageUrl}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=1200&q=80'" />`;
    } else if (slide.type === 'video') {
      thumbContent = `<div class="w-full h-full bg-purple-950 flex items-center justify-center text-purple-300 font-bold text-lg">🎬</div>`;
    } else if (slide.type === 'link') {
      const media = (typeof parseMediaUrl === 'function') ? parseMediaUrl(slide.image_url) : null;
      if (media && media.thumbnailUrl) {
        thumbContent = `<img src="${encodeURI(media.thumbnailUrl)}" class="w-full h-full object-cover" onerror="this.outerHTML='<div class=\\'w-full h-full bg-sky-950 flex items-center justify-center text-sky-300 font-bold text-lg\\'>🔗</div>'" />`;
      } else if (media && media.type === 'video') {
        thumbContent = `<div class="w-full h-full bg-purple-950 flex items-center justify-center text-purple-300 font-bold text-lg">🎬</div>`;
      } else {
        thumbContent = `<div class="w-full h-full bg-sky-950 flex items-center justify-center text-sky-300 font-bold text-lg">🔗</div>`;
      }
    } else {
      thumbContent = `<span class="text-xl">📊</span>`;
    }

    return `
      <div class="p-4 sm:p-5 rounded-2xl border ${cardBorder} flex flex-wrap items-center justify-between gap-4 transition duration-200">
        <!-- Informasi Kiri -->
        <div class="flex items-start gap-4 min-w-[260px] flex-1">
          <!-- Thumbnail Kecil -->
          <div class="w-16 h-12 rounded-xl bg-slate-900 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
            ${thumbContent}
          </div>

          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              ${typeBadge}
              ${statusBadge}
            </div>
            <h3 class="font-bold text-slate-900 text-sm sm:text-base leading-snug">${safeTitle}</h3>
            <p class="text-xs text-slate-500">
              Durasi: <b>${slide.duration}s</b> • Tayang: ${escapeHtml(slide.start_date)} s/d ${escapeHtml(slide.end_date)} • Oleh: ${safeAuthor}
            </p>
          </div>
        </div>

        <!-- Tombol Aksi Kanan -->
        <div class="flex items-center gap-2 flex-wrap">
          ${updateExcelBtn}
          ${pinBtn}
          <button onclick="previewSpecificSlide('${slide.id}')" title="Preview tampilan di TV" class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition active:scale-95">
            👁️ Preview
          </button>
          <button onclick="openEditModal('${slide.id}')" title="Edit informasi tayangan" class="px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition flex items-center gap-1 active:scale-95 border border-blue-200">
            ✏️ Edit
          </button>
          ${activeBtn}
          <button onclick="deleteSlide('${slide.id}')" title="Hapus slide" class="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Filter Tab Click Handlers
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(b => {
      b.className = 'filter-tab px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900';
    });
    btn.className = 'filter-tab px-3 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs font-bold';
    currentSlideFilter = btn.dataset.filter;
    loadAdminSlides();
  });
});

// ------------------------------------------------------------
// 5. AKSI PIN LIVE, UPDATE EXCEL CEPAT, & HAPUS
// ------------------------------------------------------------
window.togglePin = async (id, pinState) => {
  if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
    try {
      await supabaseClient.from('slides').update({ is_pinned: pinState }).eq('id', id);
    } catch (e) {
      showToast('Gagal toggle pin: ' + e.message, 'error');
    }
  } else {
    let localSlides = JSON.parse(localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES') || '[]');
    localSlides = localSlides.map(s => {
      if (s.id === id) {
        return { ...s, is_pinned: pinState };
      } else {
        return pinState ? { ...s, is_pinned: false } : s;
      }
    });
    await saveLocalSlidesSafely(localSlides);
  }
  showToast(pinState ? 'Slide berhasil di-pin live di TV' : 'Pin dilepas, TV kembali ke mode rotasi', 'info');
  notifyTvUpdate('slides');
  loadAdminSlides();
};

window.toggleActive = async (id, activeState) => {
  if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
    try {
      await supabaseClient.from('slides').update({ is_active: activeState }).eq('id', id);
    } catch (e) {
      showToast('Gagal update status: ' + e.message, 'error');
    }
  } else {
    let localSlides = JSON.parse(localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES') || '[]');
    localSlides = localSlides.map(s => s.id === id ? { ...s, is_active: activeState } : s);
    await saveLocalSlidesSafely(localSlides);
  }
  showToast(activeState ? 'Slide diaktifkan ke playlist' : 'Slide dinonaktifkan dari playlist', 'info');
  notifyTvUpdate('slides');
  loadAdminSlides();
};

window.triggerQuickExcelUpdate = (id) => {
  slideIdToUpdateExcel = id;
  quickExcelInput.click();
};

quickExcelInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file || !slideIdToUpdateExcel) return;

  try {
    const newExcelData = await parseExcelFile(file);

    if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
      const { error } = await supabaseClient
        .from('slides')
        .update({
          excel_data: newExcelData,
          updated_at: new Date().toISOString()
        })
        .eq('id', slideIdToUpdateExcel);

      if (error) throw error;
    } else {
      let localSlides = JSON.parse(localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES') || '[]');
      localSlides = localSlides.map(s => {
        if (s.id === slideIdToUpdateExcel) {
          return { ...s, excel_data: newExcelData, updated_at: new Date().toISOString() };
        }
        return s;
      });
      await saveLocalSlidesSafely(localSlides);
    }

    showToast('Data Excel berhasil diperbarui live di TV!', 'success');
    notifyTvUpdate('slides');
    loadAdminSlides();
  } catch (err) {
    showToast('Gagal memperbarui Excel: ' + err.message, 'error');
  } finally {
    quickExcelInput.value = '';
    slideIdToUpdateExcel = null;
  }
});

window.deleteSlide = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus slide ini dari layar TV?')) return;

  if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
    try {
      const { error } = await supabaseClient.from('slides').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      showToast('Gagal menghapus: ' + e.message, 'error');
    }
  } else {
    let localSlides = JSON.parse(localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES') || '[]');
    localSlides = localSlides.filter(s => s.id !== id);
    await saveLocalSlidesSafely(localSlides);
  }
  showToast('Slide berhasil dihapus dari TV', 'info');
  notifyTvUpdate('slides');
  loadAdminSlides();
};

// ------------------------------------------------------------
// 6. RUNNING TEXT & PENGATURAN KANTOR
// ------------------------------------------------------------
async function loadSettings() {
  let settings = null;
  if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
    try {
      const { data, error } = await supabaseClient
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .single();
      if (!error && data) settings = data;
    } catch (e) {}
  }

  if (!settings) {
    const local = localStorage.getItem('TV_SIGNAGE_LOCAL_SETTINGS');
    if (local) {
      try { settings = JSON.parse(local); } catch (e) {}
    }
  }

  if (settings) {
    if (inputOfficeName) inputOfficeName.value = settings.office_name || 'KANTOR UTAMA';
    if (inputRunningText) inputRunningText.value = settings.running_text || '';
    if (previewTvTicker) previewTvTicker.textContent = settings.running_text || 'Selamat Datang di Kantor Kami...';

    // Isi Pengaturan Musik Latar (BGM)
    if (bgmToggleSwitch) bgmToggleSwitch.checked = !!settings.bgm_enabled;
    if (inputBgmTitle) inputBgmTitle.value = settings.bgm_title || '';
    if (inputBgmVolume) {
      const vol = settings.bgm_volume !== undefined ? settings.bgm_volume : 50;
      inputBgmVolume.value = vol;
      if (bgmVolumeVal) bgmVolumeVal.textContent = vol + '%';
    }
    existingBgmUrl = settings.bgm_url || '';

    if (settings.bgm_type === 'youtube' || settings.bgm_type === 'link') {
      switchBgmSource('link');
      if (inputBgmUrl) inputBgmUrl.value = settings.bgm_url || '';
    } else {
      switchBgmSource('file');
      if (settings.bgm_url && bgmCurrentFileBadge && bgmCurrentFileLabel) {
        bgmCurrentFileBadge.classList.remove('hidden');
        bgmCurrentFileLabel.textContent = settings.bgm_title || 'File audio terpasang';
      }
    }
  }
}

// Toggle Sumber BGM (File vs Link)
function switchBgmSource(type) {
  currentBgmSourceType = type;
  if (type === 'file') {
    if (btnBgmSourceFile) {
      btnBgmSourceFile.className = 'py-1.5 px-3 rounded-lg bg-white shadow-xs text-zinc-900 font-semibold transition text-center';
    }
    if (btnBgmSourceLink) {
      btnBgmSourceLink.className = 'py-1.5 px-3 rounded-lg text-zinc-600 hover:text-zinc-900 font-medium transition text-center';
    }
    if (wrapperBgmFile) wrapperBgmFile.classList.remove('hidden');
    if (wrapperBgmLink) wrapperBgmLink.classList.add('hidden');
  } else {
    if (btnBgmSourceFile) {
      btnBgmSourceFile.className = 'py-1.5 px-3 rounded-lg text-zinc-600 hover:text-zinc-900 font-medium transition text-center';
    }
    if (btnBgmSourceLink) {
      btnBgmSourceLink.className = 'py-1.5 px-3 rounded-lg bg-white shadow-xs text-zinc-900 font-semibold transition text-center';
    }
    if (wrapperBgmFile) wrapperBgmFile.classList.add('hidden');
    if (wrapperBgmLink) wrapperBgmLink.classList.remove('hidden');
  }
}

if (btnBgmSourceFile) btnBgmSourceFile.addEventListener('click', () => switchBgmSource('file'));
if (btnBgmSourceLink) btnBgmSourceLink.addEventListener('click', () => switchBgmSource('link'));

if (inputBgmVolume) {
  inputBgmVolume.addEventListener('input', () => {
    if (bgmVolumeVal) bgmVolumeVal.textContent = inputBgmVolume.value + '%';
    if (bgmAdminAudio) bgmAdminAudio.volume = parseInt(inputBgmVolume.value, 10) / 100;
  });
}

if (inputBgmFile) {
  inputBgmFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    if (bgmAdminAudio) {
      bgmAdminAudio.src = blobUrl;
      bgmAdminAudio.play().catch(() => {});
    }
    if (bgmAdminPreviewBox) bgmAdminPreviewBox.classList.remove('hidden');
    if (inputBgmTitle && !inputBgmTitle.value.trim()) {
      inputBgmTitle.value = file.name.replace(/\.[^/.]+$/, '');
    }
    if (bgmCurrentFileBadge && bgmCurrentFileLabel) {
      bgmCurrentFileBadge.classList.remove('hidden');
      bgmCurrentFileLabel.textContent = file.name;
    }
  });
}

if (btnStopPreviewBgm) {
  btnStopPreviewBgm.addEventListener('click', () => {
    if (bgmAdminAudio) bgmAdminAudio.pause();
    if (bgmAdminPreviewBox) bgmAdminPreviewBox.classList.add('hidden');
  });
}

if (btnTestBgmLink) {
  btnTestBgmLink.addEventListener('click', () => {
    const url = inputBgmUrl ? inputBgmUrl.value.trim() : '';
    if (!url) {
      showToast('Masukkan link audio atau YouTube terlebih dahulu', 'warning');
      return;
    }

    const media = (typeof parseMediaUrl === 'function') ? parseMediaUrl(url) : null;
    if (media && media.type === 'youtube') {
      showToast('Link YouTube terdeteksi! Musik akan diputar secara otomatis di TV lobi.', 'info');
      if (inputBgmTitle && !inputBgmTitle.value.trim()) {
        inputBgmTitle.value = 'BGM YouTube';
      }
    } else {
      if (bgmAdminAudio) {
        bgmAdminAudio.src = url;
        bgmAdminAudio.play().catch(() => {});
      }
      if (bgmAdminPreviewBox) bgmAdminPreviewBox.classList.remove('hidden');
      showToast('Mencoba memutar audio...', 'info');
    }
  });
}

if (formBgm) {
  formBgm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bgm_enabled = bgmToggleSwitch ? bgmToggleSwitch.checked : false;
    const bgm_type = currentBgmSourceType === 'link'
      ? (inputBgmUrl && inputBgmUrl.value.includes('youtu') ? 'youtube' : 'link')
      : 'file';
    const bgm_title = inputBgmTitle ? inputBgmTitle.value.trim() : '';
    const bgm_volume = inputBgmVolume ? parseInt(inputBgmVolume.value, 10) : 50;
    let bgm_url = existingBgmUrl;

    btnSaveBgm.disabled = true;
    btnSaveBgm.innerHTML = `<span>Menyimpan Musik...</span>`;

    try {
      if (currentBgmSourceType === 'file') {
        const file = inputBgmFile ? inputBgmFile.files[0] : null;
        if (file) {
          if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
            const ext = file.name.split('.').pop();
            const fileName = `bgm-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
            const { error: uploadErr } = await supabaseClient.storage
              .from('tv-media')
              .upload(fileName, file, { cacheControl: '3600', upsert: false });
            if (uploadErr) throw uploadErr;
            const { data: publicUrlData } = supabaseClient.storage
              .from('tv-media')
              .getPublicUrl(fileName);
            bgm_url = publicUrlData.publicUrl;
          } else {
            bgm_url = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (ev) => resolve(ev.target.result);
              reader.readAsDataURL(file);
            });
          }
        } else if (bgm_enabled && !bgm_url) {
          throw new Error('Silakan pilih file audio MP3 terlebih dahulu');
        }
      } else {
        const url = inputBgmUrl ? inputBgmUrl.value.trim() : '';
        if (bgm_enabled && !url) {
          throw new Error('Masukkan tautan URL audio atau YouTube');
        }
        bgm_url = url;
      }

      const settingsUpdate = {
        id: 'global',
        bgm_enabled,
        bgm_type,
        bgm_url,
        bgm_title: bgm_title || (bgm_type === 'youtube' ? 'Musik YouTube' : 'Musik Latar Lobi'),
        bgm_volume,
        updated_at: new Date().toISOString()
      };

      if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
        const { error } = await supabaseClient
          .from('settings')
          .upsert(settingsUpdate);
        if (error) throw error;
      } else {
        let currentSettings = JSON.parse(localStorage.getItem('TV_SIGNAGE_LOCAL_SETTINGS') || '{}');
        currentSettings = { ...currentSettings, ...settingsUpdate };
        localStorage.setItem('TV_SIGNAGE_LOCAL_SETTINGS', JSON.stringify(currentSettings));
        localStorage.setItem('cached_tv_settings', JSON.stringify(currentSettings));
      }

      existingBgmUrl = bgm_url;
      showToast(bgm_enabled ? 'Musik latar berhasil diaktifkan di layar TV!' : 'Pengaturan musik berhasil disimpan', 'success');
      notifyTvUpdate('settings');
    } catch (err) {
      showToast('Gagal menyimpan musik: ' + err.message, 'error');
    } finally {
      btnSaveBgm.disabled = false;
      btnSaveBgm.innerHTML = `<span>Simpan Pengaturan Musik</span>`;
    }
  });
}

tickerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const office_name = inputOfficeName.value.trim() || 'KANTOR UTAMA';
  const running_text = inputRunningText.value.trim();

  btnSaveTicker.disabled = true;
  btnSaveTicker.innerHTML = `<span>Menyimpan...</span>`;

  try {
    if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
      const { error } = await supabaseClient
        .from('settings')
        .upsert({
          id: 'global',
          office_name,
          running_text,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
    } else {
      const settings = {
        id: 'global',
        office_name,
        running_text,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('TV_SIGNAGE_LOCAL_SETTINGS', JSON.stringify(settings));
      localStorage.setItem('cached_tv_settings', JSON.stringify(settings));
    }

    if (previewTvTicker) previewTvTicker.textContent = running_text;
    showToast('Running text berhasil diperbarui secara live di TV!', 'success');
    notifyTvUpdate('settings');
  } catch (err) {
    showToast('Gagal menyimpan running text: ' + err.message, 'error');
  } finally {
    btnSaveTicker.disabled = false;
    btnSaveTicker.innerHTML = `<span>Perbarui Running Text</span>`;
  }
});

// ------------------------------------------------------------
// 7. MODAL LIVE PREVIEW TV
// ------------------------------------------------------------
btnPreviewModalTrigger.addEventListener('click', () => {
  const title = inputTitle.value.trim() || 'Judul Informasi Lobi';
  const type = inputType.value;

  previewTvTitle.textContent = title;
  previewTvTicker.textContent = inputRunningText.value || 'Selamat Datang di Kantor Kami...';

  if (type === 'image') {
    const file = inputFileImage.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        renderModalPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      renderModalPreviewImage('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80');
    }
  } else if (type === 'video') {
    const file = inputFileVideo ? inputFileVideo.files[0] : null;
    if (file) {
      renderModalPreviewVideo(URL.createObjectURL(file));
    } else {
      renderModalPreviewVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    }
  } else if (type === 'link') {
    const url = inputMediaUrl ? inputMediaUrl.value.trim() : '';
    renderModalPreviewLink(url);
  } else {
    const bgUrl = (inputExcelBgFile && inputExcelBgFile.files[0]) 
      ? excelBgPreviewThumb.src 
      : (inputExcelBgUrl ? inputExcelBgUrl.value : null);

    if (parsedExcelBuffer) {
      renderModalPreviewExcel(parsedExcelBuffer, bgUrl);
    } else {
      renderModalPreviewExcel({
        headers: ['Waktu', 'Ruang', 'Kegiatan', 'Status'],
        rows: [
          ['09:00', 'Ruang VIP', 'Rapat Koordinasi', 'Berlangsung'],
          ['11:00', 'Aula', 'Penerimaan Tamu Kunjungan', 'Menunggu']
        ]
      }, bgUrl);
    }
  }

  openModal(modalPreview);
});

window.previewSpecificSlide = (id) => {
  const slide = currentSlidesData.find(s => s.id === id);
  if (!slide) return;

  previewTvTitle.textContent = slide.title;
  previewTvTicker.textContent = inputRunningText.value || 'Selamat Datang di Kantor Kami...';

  if (slide.type === 'image') {
    renderModalPreviewImage(slide.image_url);
  } else if (slide.type === 'video') {
    renderModalPreviewVideo(slide.image_url);
  } else if (slide.type === 'link') {
    renderModalPreviewLink(slide.image_url);
  } else if (slide.type === 'excel' && slide.excel_data) {
    renderModalPreviewExcel(slide.excel_data, slide.image_url);
  }

  openModal(modalPreview);
};

function renderModalPreviewLink(url) {
  const media = (typeof parseMediaUrl === 'function') ? parseMediaUrl(url) : null;
  if (!media) {
    previewTvStage.innerHTML = `
      <div class="p-8 text-center text-rose-400 bg-slate-900/80 rounded-2xl border border-rose-800">
        <p class="text-sm font-bold">Tautan link media kosong atau tidak valid</p>
      </div>
    `;
    return;
  }

  if (media.type === 'youtube') {
    previewTvStage.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
        <iframe src="${media.embedUrl}" class="w-full h-full border-0 pointer-events-auto" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
  } else if (media.type === 'instagram') {
    previewTvStage.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 p-2">
        <iframe src="${media.embedUrl}" class="w-full max-w-[420px] h-[86%] rounded-2xl border border-slate-700/80 bg-white shadow-2xl" frameborder="0" scrolling="no" allowtransparency="true" allow="autoplay; encrypted-media"></iframe>
      </div>
    `;
  } else if (media.type === 'tiktok') {
    previewTvStage.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 p-2">
        <iframe src="${media.embedUrl}" class="w-full max-w-[360px] h-[86%] rounded-2xl border border-slate-700/80 bg-black shadow-2xl" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
      </div>
    `;
  } else if (media.type === 'video') {
    renderModalPreviewVideo(media.embedUrl);
  } else if (media.type === 'image') {
    renderModalPreviewImage(media.embedUrl);
  } else {
    previewTvStage.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
        <iframe src="${media.embedUrl}" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
  }
}

function renderModalPreviewVideo(url) {
  const safeUrl = url ? encodeURI(url) : '';
  previewTvStage.innerHTML = `
    <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
      <video src="${safeUrl}" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none" autoplay muted loop playsinline></video>
      <video src="${safeUrl}" class="relative z-10 max-w-full max-h-[85%] object-contain rounded-lg shadow-xl" autoplay muted controls playsinline></video>
    </div>
  `;
}

function renderModalPreviewImage(url) {
  const safeUrl = url ? encodeURI(url) : '';
  previewTvStage.innerHTML = `
    <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
      <img src="${safeUrl}" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110" />
      <img src="${safeUrl}" class="relative z-10 max-w-full max-h-[85%] object-contain rounded-lg shadow-xl" />
    </div>
  `;
}

function renderModalPreviewExcel(excel, bgUrl = null) {
  const { headers = [], rows = [] } = excel;
  const thead = headers.map(h => `<th class="p-2 text-left font-bold text-blue-300 text-[10px] bg-slate-950/80 border-b border-blue-400/50">${escapeHtml(h)}</th>`).join('');
  const tbody = rows.slice(0, 5).map((row, idx) => {
    const bg = idx % 2 === 0 ? 'bg-slate-950/50' : 'bg-slate-900/40';
    const cells = headers.map((_, i) => `<td class="p-2 text-[10px] text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">${escapeHtml(row[i] || '-')}</td>`).join('');
    return `<tr class="${bg}">${cells}</tr>`;
  }).join('');

  const safeBg = bgUrl ? encodeURI(bgUrl) : '';

  previewTvStage.innerHTML = `
    <div class="relative w-full h-full p-4 flex flex-col justify-center overflow-hidden">
      ${bgUrl ? `<img src="${safeBg}" class="absolute inset-0 w-full h-full object-cover filter brightness-[0.88] scale-105 pointer-events-none" />` : ''}
      <div class="relative z-10 w-full overflow-hidden rounded-lg border border-white/20 bg-slate-950/60 backdrop-blur-sm shadow-xl">
        <table class="w-full border-collapse">
          <thead><tr>${thead}</tr></thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
    </div>
  `;
}

// Tutup preview via tombol & klik backdrop
btnClosePreview.addEventListener('click', () => {
  closeModal(modalPreview);
});
modalPreview.addEventListener('click', (e) => {
  if (e.target === modalPreview) {
    closeModal(modalPreview);
  }
});

// ------------------------------------------------------------
// 8. MODAL PENGATURAN KONEKSI SUPABASE
// ------------------------------------------------------------
function openSupabaseSetupModal() {
  cfgSupabaseUrl.value = localStorage.getItem('TV_SIGNAGE_SUPABASE_URL') || '';
  cfgSupabaseKey.value = localStorage.getItem('TV_SIGNAGE_SUPABASE_KEY') || '';
  openModal(modalSupabase);
}

if (btnOpenSupabaseSetup) btnOpenSupabaseSetup.addEventListener('click', openSupabaseSetupModal);
if (btnSettingsModal) btnSettingsModal.addEventListener('click', openSupabaseSetupModal);

btnCloseSupabaseModal.addEventListener('click', () => {
  closeModal(modalSupabase);
});
modalSupabase.addEventListener('click', (e) => {
  if (e.target === modalSupabase) {
    closeModal(modalSupabase);
  }
});

formSupabaseConfig.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = cfgSupabaseUrl.value.trim();
  const key = cfgSupabaseKey.value.trim();

  if (!url || !key) {
    showToast('Project URL dan Anon Key wajib diisi!', 'warning');
    return;
  }

  saveSupabaseConfig(url, key);
});

btnResetDemo.addEventListener('click', () => {
  if (confirm('Kembalikan ke Mode Demo tanpa Supabase?')) {
    resetToDemoMode();
  }
});

// ------------------------------------------------------------
// 9. MODAL EDIT SLIDE & FORM SUBMIT
// ------------------------------------------------------------
window.openEditModal = (id) => {
  const slide = currentSlidesData.find(s => s.id === id);
  if (!slide) return;

  editSlideId.value = slide.id;
  editInputTitle.value = slide.title || '';
  editInputDuration.value = slide.duration || 15;
  editInputStartDate.value = slide.start_date || todayStr;
  editInputEndDate.value = slide.end_date || nextMonthStr;
  editInputPin.checked = !!slide.is_pinned;

  const subtitle = document.getElementById('edit-slide-subtitle');
  editInputFileImage.value = '';
  if (editInputFileVideo) editInputFileVideo.value = '';
  editInputFileExcel.value = '';

  if (slide.type === 'image') {
    if (subtitle) subtitle.textContent = 'Slide Gambar / Poster';
    editWrapperImage.classList.remove('hidden');
    if (editWrapperVideo) editWrapperVideo.classList.add('hidden');
    if (editWrapperLink) editWrapperLink.classList.add('hidden');
    editWrapperExcel.classList.add('hidden');
    editImageCurrentThumb.src = slide.image_url || 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=1200&q=80';
  } else if (slide.type === 'video') {
    if (subtitle) subtitle.textContent = 'Slide Video Informasi / Iklan';
    editWrapperImage.classList.add('hidden');
    if (editWrapperVideo) editWrapperVideo.classList.remove('hidden');
    if (editWrapperLink) editWrapperLink.classList.add('hidden');
    editWrapperExcel.classList.add('hidden');
    if (editVideoCurrentPlayer) {
      editVideoCurrentPlayer.src = slide.image_url || '';
    }
  } else if (slide.type === 'link') {
    if (subtitle) subtitle.textContent = 'Slide Tautan Link Media (YouTube / Foto / Video Online)';
    editWrapperImage.classList.add('hidden');
    if (editWrapperVideo) editWrapperVideo.classList.add('hidden');
    if (editWrapperLink) editWrapperLink.classList.remove('hidden');
    editWrapperExcel.classList.add('hidden');
    if (editInputMediaUrl) {
      editInputMediaUrl.value = slide.image_url || '';
      renderLinkPreview(slide.image_url, editLinkPreviewBox, null, editInputDuration);
    }
  } else {
    if (subtitle) subtitle.textContent = `Slide Data Excel (${slide.excel_data?.rows?.length || 0} baris data)`;
    editWrapperImage.classList.add('hidden');
    if (editWrapperVideo) editWrapperVideo.classList.add('hidden');
    if (editWrapperLink) editWrapperLink.classList.add('hidden');
    editWrapperExcel.classList.remove('hidden');

    // Inisialisasi Data ke Live Spreadsheet Editor
    originalEditExcelState = slide.excel_data 
      ? JSON.parse(JSON.stringify(slide.excel_data)) 
      : { headers: ['No', 'Item / Kegiatan', 'Keterangan'], rows: [] };
    editLiveExcelState = JSON.parse(JSON.stringify(originalEditExcelState));
    renderLiveExcelEditor();

    // Set background info untuk Excel
    if (slide.image_url) {
      if (editInputExcelBgUrl) editInputExcelBgUrl.value = slide.image_url;
      if (editExcelBgPreviewThumb) editExcelBgPreviewThumb.src = slide.image_url;
      if (editExcelBgPreviewBox) editExcelBgPreviewBox.classList.remove('hidden');
    } else {
      if (editInputExcelBgUrl) editInputExcelBgUrl.value = '';
      if (editExcelBgPreviewBox) editExcelBgPreviewBox.classList.add('hidden');
    }
  }

  openModal(modalEditSlide);
};

if (btnCloseEditModal) {
  btnCloseEditModal.addEventListener('click', () => closeModal(modalEditSlide));
}
if (btnCancelEdit) {
  btnCancelEdit.addEventListener('click', () => closeModal(modalEditSlide));
}
if (modalEditSlide) {
  modalEditSlide.addEventListener('click', (e) => {
    if (e.target === modalEditSlide) closeModal(modalEditSlide);
  });
}

formEditSlide.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = editSlideId.value;
  const slide = currentSlidesData.find(s => s.id === id);
  if (!slide) return;

  const title = editInputTitle.value.trim();
  const duration = parseInt(editInputDuration.value, 10) || 15;
  const start_date = editInputStartDate.value;
  const end_date = editInputEndDate.value;
  const is_pinned = editInputPin.checked;

  if (!title) {
    showToast('Judul informasi wajib diisi!', 'warning');
    return;
  }

  btnSaveEdit.disabled = true;
  btnSaveEdit.innerHTML = `
    <svg class="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
    <span>Menyimpan...</span>
  `;

  try {
    let image_url = slide.image_url;
    let excel_data = slide.excel_data;

    // Jika user mengunggah gambar baru
    if (slide.type === 'image' && editInputFileImage.files[0]) {
      const file = editInputFileImage.files[0];
      if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadErr } = await supabaseClient.storage
          .from('tv-media')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabaseClient.storage
          .from('tv-media')
          .getPublicUrl(fileName);
        image_url = publicUrlData.publicUrl;
      } else {
        image_url = await compressImageToDataUrl(file);
      }
    }

    // Jika user mengunggah video baru
    if (slide.type === 'video' && editInputFileVideo && editInputFileVideo.files[0]) {
      const file = editInputFileVideo.files[0];
      if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
        const fileExt = file.name.split('.').pop();
        const fileName = `vid-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadErr } = await supabaseClient.storage
          .from('tv-media')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabaseClient.storage
          .from('tv-media')
          .getPublicUrl(fileName);
        image_url = publicUrlData.publicUrl;
      } else {
        throw new Error('Mengganti video memerlukan koneksi Supabase Live.');
      }
    }

    // Jika slide bertipe link
    if (slide.type === 'link') {
      const newUrl = editInputMediaUrl ? editInputMediaUrl.value.trim() : '';
      if (!newUrl) {
        showToast('Tautan link media tidak boleh kosong!', 'warning');
        btnSaveEdit.disabled = false;
        btnSaveEdit.innerHTML = '<span>💾 Simpan Perubahan</span>';
        return;
      }
      image_url = newUrl;
    }

    // Jika tipe excel, ambil data terbaru langsung dari elemen DOM Live Editor
    if (slide.type === 'excel') {
      const headerInputs = Array.from(editExcelThead ? editExcelThead.querySelectorAll('.edit-col-header') : []);
      const activeHeaders = headerInputs.length > 0
        ? headerInputs.map((inp, idx) => inp.value.trim() || `Kolom ${idx + 1}`)
        : (slide.excel_data?.headers || ['Kolom 1']);

      const rowElements = Array.from(editExcelTbody ? editExcelTbody.querySelectorAll('tr') : []);
      const activeRows = [];
      rowElements.forEach(tr => {
        const cellInputs = Array.from(tr.querySelectorAll('.edit-cell-input'));
        if (cellInputs.length > 0) {
          const rowVals = cellInputs.map(c => c.value);
          if (rowVals.some(v => v.trim() !== '')) {
            activeRows.push(rowVals);
          }
        }
      });

      if (activeRows.length === 0) {
        showToast('Data tabel Excel tidak boleh kosong! Tambahkan minimal 1 baris data.', 'warning');
        btnSaveEdit.disabled = false;
        btnSaveEdit.innerHTML = '<span>💾 Simpan Perubahan</span>';
        return;
      }

      excel_data = {
        headers: activeHeaders,
        rows: activeRows
      };

      // Cek apakah ada file background baru diunggah untuk excel
      const editBgFile = editInputExcelBgFile ? editInputExcelBgFile.files[0] : null;
      if (editBgFile) {
        if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
          const fileExt = editBgFile.name.split('.').pop();
          const fileName = `bg-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const { error: uploadErr } = await supabaseClient.storage
            .from('tv-media')
            .upload(fileName, editBgFile, { cacheControl: '3600', upsert: false });
          if (!uploadErr) {
            const { data: publicUrlData } = supabaseClient.storage
              .from('tv-media')
              .getPublicUrl(fileName);
            image_url = publicUrlData.publicUrl;
          }
        } else {
          image_url = await compressImageToDataUrl(editBgFile);
        }
      } else if (editInputExcelBgUrl) {
        image_url = editInputExcelBgUrl.value || null;
      }
    }

    const updatedFields = {
      title,
      duration,
      start_date,
      end_date,
      is_pinned,
      image_url,
      excel_data,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
      const { error } = await supabaseClient
        .from('slides')
        .update(updatedFields)
        .eq('id', id);

      if (error) throw error;
    } else {
      let localSlides = JSON.parse(localStorage.getItem('TV_SIGNAGE_LOCAL_SLIDES') || '[]');
      localSlides = localSlides.map(s => {
        if (s.id === id) {
          return { ...s, ...updatedFields };
        } else {
          return is_pinned ? { ...s, is_pinned: false } : s;
        }
      });
      await saveLocalSlidesSafely(localSlides);
    }

    closeModal(modalEditSlide);
    showToast('Perubahan slide berhasil disimpan dan langsung tayang!', 'success');
    notifyTvUpdate('slides');
    loadAdminSlides();
  } catch (err) {
    showToast('Gagal menyimpan perubahan: ' + err.message, 'error');
  } finally {
    btnSaveEdit.disabled = false;
    btnSaveEdit.innerHTML = `<span>💾 Simpan Perubahan</span>`;
  }
});

if (btnEditTestLink) {
  btnEditTestLink.addEventListener('click', () => {
    const url = editInputMediaUrl ? editInputMediaUrl.value.trim() : '';
    if (!url) {
      showToast('Masukkan link terlebih dahulu', 'warning');
      return;
    }
    renderLinkPreview(url, editLinkPreviewBox, null, editInputDuration);
    showToast('Pratinjau link diperbarui', 'info');
  });
}

if (editInputMediaUrl) {
  editInputMediaUrl.addEventListener('change', () => {
    const url = editInputMediaUrl.value.trim();
    if (url) renderLinkPreview(url, editLinkPreviewBox, null, editInputDuration);
  });
}

// ------------------------------------------------------------
// 10. LISTENER REALTIME ADMIN (SUPABASE & LOCAL STORAGE)
// ------------------------------------------------------------
function setupRealtimeAdmin() {
  if (isSupabaseConfigured() && supabaseClient && !isDemoSession) {
    try {
      supabaseClient
        .channel('admin-dashboard-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'slides' }, () => {
          loadAdminSlides();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
          loadSettings();
        })
        .subscribe();
    } catch (e) {}
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'TV_SIGNAGE_LOCAL_SLIDES') {
      loadAdminSlides();
    }
    if (e.key === 'TV_SIGNAGE_LOCAL_SETTINGS') {
      loadSettings();
    }
  });
}

// Inisialisasi awal
checkAuth();
