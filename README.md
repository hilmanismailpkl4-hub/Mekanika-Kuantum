# Quantum Lab: Dari Planck ke Chip (From Planck to Chips)

Aplikasi game petualangan edukasi fisika kuantum dan desain chip semikonduktor bilingual (**Indonesia / English**) bergaya retro-futuristik piksel siber untuk mahasiswa fisika dan teknik elektro.

---

## Arsitektur & Struktur Proyek

Proyek ini telah selesai dibangun dan terorganisasi rapi ke dalam dua modul utama:

```text
Mekanika Kuantum/
├── README.md                      # Dokumentasi komprehensif sistem
├── backend/                       # REST API Server, Model & Dataset
│   ├── README.md                  # Dokumentasi endpoint API
│   ├── models.py                  # Model dataclass & loader kurikulum
│   ├── server.py                  # HTTP REST API Server
│   └── data/
│       └── kuantum.json           # Dataset 13 bab, konsep, & skema desain
└── frontend/                      # Aplikasi Web Interaktif (React, TypeScript, Tailwind)
    ├── index.html                 # Shell HTML aplikasi (dark mode default)
    ├── package.json               # Dependensi modern
    ├── tsconfig.json              # Konfigurasi TypeScript & path alias (@/*)
    ├── vite.config.ts             # Konfigurasi bundler Vite
    ├── vercel.json                # Konfigurasi rewrite SPA deploy Vercel
    ├── public/
    │   └── photon.svg             # Sprite piksel foton
    └── src/
        ├── app-state.ts           # State Zustand (linear progression, XP, lencana, journal)
        ├── curriculum.ts          # Konten 13 bab bilingual, 65 soal kuis & penjelasan
        ├── simulation-engine.tsx  # Engine kanvas simulasi 60 FPS & formula interaktif
        ├── sound.ts               # Synthesizer efek suara 8-bit prosedural Web Audio API
        ├── ui-components.tsx      # Komponen UI piksel terpadu (Atom, Button, Panel, Tex, Dialog)
        ├── layout.tsx             # Tata letak responsif, GameHUD, BottomNav
        ├── pages.tsx              # Layar: Home, AdventureMap, ChapterView, Quiz, Journal, Settings
        ├── translations.ts        # Kamus bilingual dinamis (ID & EN)
        ├── App.tsx                # Rute SPA React Router
        ├── main.tsx               # Entry point React DOM
        └── kuantum.css            # Desain token piksel siber & styling Tailwind
```

---

## Fitur Utama yang Telah Diimplementasikan

### 1. Fondasi Desain & Sistem Bilingual (Stage 1)
- **Tema Retro-Piksel Modern**: Dark-mode bawaan (*obsidian, quantum cyan, semiconductor amber, deep violet*). Tipografi proporsional menggunakan *Space Grotesk*, *JetBrains Mono*, dan *Press Start 2P*.
- **Bilingual Real-Time (ID / EN)**: Seluruh teks UI, narasi, konsep, tombol, kuis, dan penjelasan diterjemahkan seketika tanpa memuat ulang halaman (*instant toggle*).
- **Responsif Penuh**: Mendukung layar ponsel (*mobile-first*), tablet, dan monitor desktop dengan navigasi bawah (*Bottom Nav*) otomatis di perangkat seluler.
- **Zustand Persistence**: Status penyimpanan tersimpan otomatis di `localStorage` (*XP, bab terbuka, lencana, buku lab*).

### 2. Mesin Simulasi Interaktif & Pembalik Tanda (+ / −) (Stage 2)
- **Kanvas Simulasi 60 FPS**: Berjalan mulus di elemen HTML5 Canvas dengan resolusi tinggi (*DPI scaling*) dan grafis piksel tajam.
- **Sistem Formula Dinamis KaTeX**: Formula matematika diperbarui secara *live* saat slider parameter digeser atau operator dibalik.
- **Simulasi Rujukan (Penerowongan Kuantum & Pembalik Tanda)**:
  - Mengubah operator tanda dari `+` ke `−` membalik vektor kecepatan elektron ($v = \pm \sqrt{2E/m}$) dan arah rambatan gelombang dari maju (*incident*) menjadi berbalik arah (*reflected*).
  - Dilengkapi banner penjelasan in-game yang menerangkan alasan fisis pembalikan arah momentum.
- **Mode Eksperimen Bebas (Sandbox)**: Pemain dapat beralih antara *Guided Lesson* dan *Free Sandbox* dengan slider parameter dinamis, tombol Play/Pause, dan Reset.
- **Panel Bertingkat "Tanya Mengapa" (Ask Why)**:
  1. *Tingkat 1*: Intuisi sehari-hari
  2. *Tingkat 2*: Mekanisme fisika kuantum
  3. *Tingkat 3*: Realitas industri semikonduktor & chip

### 3. Kurikulum Lengkap 13 Bab (Stage 3)
Seluruh 13 bab telah diisi materi mendalam dalam bahasa Indonesia dan Inggris:
1. **CH-01**: Radiasi Benda Hitam & Kuantisasi Planck ($E = nhf$)
2. **CH-02**: Efek Fotolistrik & Dualisme Foton Einstein ($K_{max} = hf - \Phi$)
3. **CH-03**: Model Atom Bohr & Kuantisasi Orbit ($L = n\hbar$)
4. **CH-04**: Gelombang Materi de Broglie & Kisi Kristal ($\lambda = h/p$)
5. **CH-05**: Persamaan Schrödinger & Fungsi Gelombang ($i\hbar \partial\psi/\partial t = \hat{H}\psi$)
6. **CH-06**: Penerowongan Kuantum & Kebocoran Gerbang ($T \approx e^{-2\kappa L}$)
7. **CH-07**: Teori Pita Energi & Celah Pita ($E_g = E_C - E_V$)
8. **CH-08**: Doping & Pembawa Muatan Tipe-P/N ($n \cdot p = n_i^2$)
9. **CH-09**: Sambungan P-N & Dioda Rekayasa ($I = I_s(e^{qV/kT} - 1)$)
10. **CH-10**: Transistor MOSFET & Inversi Gerbang ($I_D \propto (V_{GS} - V_{th})^2$)
11. **CH-11**: Fotolitografi EUV & Fabrikasi Wafer Nanometer ($CD = k_1 \lambda / NA$)
12. **CH-12**: Gerbang Logika CMOS & Sirkuit Terpadu ($P_{dyn} = \alpha C_L V_{DD}^2 f$)
13. **CH-13**: Capstone: Desain Chip & Batas Kuantum 2 nm ($\tau \propto C_L V_{DD} / I_{on}$)

Setiap bab memiliki:
- Narasi pendek peneliti di lab piksel (2–3 kalimat)
- Konsep inti visual (dipahami dalam $\le$ 1 menit)
- Simulasi interaktif dengan parameter yang dapat diedit
- Studi kasus industri nyata (*Side Quest*): sensor CMOS, QLED, mikroskop TEM, chip GaN/SiC, ASML High-NA EUV, hingga superchip AI Nvidia Blackwell
- Tepat 5 soal kuis tingkat universitas (total **65 soal**) dengan **umpan balik eksplanatori lengkap** per jawaban salah
- Catatan jurnal riset yang terbuka otomatis setelah bab diselesaikan

### 4. Gamifikasi, Capstone Sandbox & Polish (Stage 4)
- **Progresi Linear Kuantum**: Bab terkunci secara berurutan; menyelesaikan bab $N$ membuka bab $N+1$.
- **Sistem XP & Lencana Pencapaian**: +50 XP per penyelesaian bab, +20 XP per jawaban kuis benar, dengan 7 lencana tonggak sejarah (*First Quantum, Wave Master, Tunneling Pioneer, Silicon Alchemist, Transistor Architect, Lithography Master, Chip Titan*).
- **Sandbox Khusus Bab 10 (MOSFET Design)**: Mengubah ketebalan oksida $t_{ox}$, tegangan gerbang $V_{GS}$, dan doping $N_A$ secara *live* memperlihatkan pembentukan kanal inversi, pergeseran $V_{th}$, dan rasio arus $I_{on}/I_{off}$.
- **Capstone Mini-Game Bab 13 (Chip Builder)**: Merakit blok ALU 64-bit, Register, SRAM L1, dan NPU Core di atas interkoneksi silikon untuk mengoptimalkan rasio PPA (*Power, Performance, Area*).
- **Efek Suara 8-Bit Prosedural (Web Audio API)**: Suara klik, transisi, dengung salah, chord benar, kenaikan level, dan fanfare kemenangan yang disintesis secara matematis tanpa aset audio eksternal (mode senyap/mute secara bawaan).
- **Buku Lab & Ekspor Jurnal**: Menampilkan catatan penemuan dan formula, lengkap dengan tombol **Ekspor Jurnal (.txt)** untuk mengunduh salinan catatan laboratorium.

---

## Panduan Menjalankan Proyek

### 1. Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
# Buka http://localhost:5173 di browser
```

### 2. Menjalankan Backend API
```bash
cd backend
python server.py
# Server berjalan di http://localhost:8000
# Endpoint: /api/health, /api/chapters, /api/quiz/<id>, /api/progress
```

### 3. Deploy ke Vercel
Direktori `frontend/` telah dilengkapi dengan `vercel.json` sehingga dapat langsung dideploy ke Vercel dengan satu perintah:
```bash
cd frontend
vercel
```
