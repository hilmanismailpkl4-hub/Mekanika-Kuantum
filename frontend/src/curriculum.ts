import type { Bilingual, Era, JournalEntry } from "./app-state";

export interface LayeredExplanation {
    title: Bilingual;
    simple: Bilingual; // Layer 1: Everyday Intuition
    deep: Bilingual;   // Layer 2: Quantum Physical Mechanism
    chip: Bilingual;   // Layer 3: Modern Chip / Semiconductor Reality
}

export interface SideQuest {
    id: string;
    title: Bilingual;
    tag: Bilingual;
    description: Bilingual;
    realWorldTech: Bilingual;
}

export interface DetailedQuizQuestion {
    id: string;
    prompt: Bilingual;
    formula?: string;
    options: Bilingual[];
    answer: number;
    explanation: Bilingual; // In-depth feedback explaining why the answer is correct
}

export interface SimulationParam {
    id: string;
    label: Bilingual;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit?: string;
}

export interface SimulationConfig {
    type: string;
    hasSignFlip?: boolean;
    signLabel?: Bilingual;
    defaultSign?: number; // +1 or -1
    params: SimulationParam[];
    formulaTemplate: string;
    formulaBuilder: (params: Record<string, number>, sign: number) => string;
    signExplanation?: Bilingual;
}

export interface ChapterFull {
    id: number;
    code: string;
    era: Era;
    title: Bilingual;
    narrative: Bilingual;
    coreConcept: Bilingual;
    formula: string;
    simulation: SimulationConfig;
    askWhy: LayeredExplanation;
    sideQuest: SideQuest;
    quiz: DetailedQuizQuestion[];
    journalEntry: JournalEntry;
}

export const CURRICULUM: ChapterFull[] = [
    // -------------------------------------------------------------
    // CH-01: Planck's Constant & Energy Quantization
    // -------------------------------------------------------------
    {
        id: 1,
        code: "CH-01",
        era: "quantum_birth",
        title: {
            id: "Radiasi Benda Hitam & Kuantisasi Energi Planck",
            en: "Blackbody Radiation & Planck's Energy Quantization",
        },
        narrative: {
            id: "Dr. Kuantum menyalakan oven rongga di laboratorium. Fisika klasik memprediksi intensitas ultraviolet akan meledak tak hingga (Bencana Ultraviolet). Max Planck menyadari bahwa energi harus dipaketkan ke dalam kuantum diskret.",
            en: "Dr. Quantum turns on the blackbody furnace in the lab. Classical physics predicts ultraviolet intensity will explode to infinity (The Ultraviolet Catastrophe). Max Planck discovers that energy must be emitted in discrete packets.",
        },
        coreConcept: {
            id: "Energi tidak mengalir secara kontinu seperti air keran, melainkan dipancarkan dalam paket-paket tak terbagi bernama kuantum (E = hf).",
            en: "Energy does not flow continuously like water; it is radiated in indivisible packets called quanta (E = hf).",
        },
        formula: "E = n h f",
        simulation: {
            type: "planck",
            hasSignFlip: true,
            signLabel: { id: "Arah Radiasi (+ Emisi / − Absorpsi)", en: "Radiation Flow (+ Emission / − Absorption)" },
            defaultSign: 1,
            params: [
                { id: "temperature", label: { id: "Suhu (Kelvin)", en: "Temperature (K)" }, min: 1000, max: 8000, step: 250, defaultValue: 4500, unit: "K" },
                { id: "frequency", label: { id: "Frekuensi (x10¹⁴ Hz)", en: "Frequency (x10¹⁴ Hz)" }, min: 1, max: 20, step: 0.5, defaultValue: 6, unit: "THz" },
                { id: "quantum_n", label: { id: "Tingkat Kuantum n", en: "Quantum Mode n" }, min: 1, max: 5, step: 1, defaultValue: 1 },
            ],
            formulaTemplate: "E = n h f",
            formulaBuilder: (p, sign) => `${sign >= 0 ? "+" : "-"}${p.quantum_n || 1} \\cdot (6.626 \\times 10^{-34}) \\cdot (${p.frequency || 6} \\times 10^{14}) \\text{ J}`,
            signExplanation: {
                id: "Tanda positif (+) merepresentasikan emisi foton keluar dari dinding rongga hitam, sedangkan tanda negatif (−) merepresentasikan penyerapan energi foton kembali ke kisi material.",
                en: "Positive sign (+) represents photon emission outward from the blackbody wall, while negative sign (−) represents resonant absorption back into the material lattice.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Bencana Ultraviolet Terjadi?", en: "Why Did the Ultraviolet Catastrophe Happen?" },
            simple: {
                id: "Teori fisika klasik menganggap semua frekuensi gelombang mendapat jatah energi yang sama. Karena ada tak terhingga frekuensi tinggi (UV), oven seharusnya memancarkan radiasi tak terhingga dan meledak!",
                en: "Classical theory assumed every wave mode received equal thermal energy. Since infinitely many high frequencies exist, ovens should radiate infinite UV rays and vaporize instantly!",
            },
            deep: {
                id: "Berdasarkan teorema ekuipartisi Boltzmann, tiap moda berosilasi memiliki rata-rata energi kT. Planck menggantinya dengan distribusi statistik Bose-Einstein di mana probabilitas moda frekuensi tinggi mengecil secara eksponensial e^(-hf/kT).",
                en: "Boltzmann equipartition granted kT to every mode. Planck replaced this with quantized statistics where the excitation probability of high-frequency modes vanishes exponentially as e^(-hf/kT).",
            },
            chip: {
                id: "Kuantisasi radiasi ini adalah fondasi pengukuran suhu non-kontak pirometer termal dalam ruang proses pembuatan wafer silikon (Rapid Thermal Processing / RTP) pada suhu 1050°C.",
                en: "This thermal quantization enables precision pyrometers for non-contact temperature monitoring during 1050°C Rapid Thermal Annealing in silicon wafer fabrication.",
            },
        },
        sideQuest: {
            id: "sq-01",
            title: { id: "Sensor Pirometer Ruang Fabrikasi TSMC", en: "TSMC Fab Pyrometer Sensors" },
            tag: { id: "Termometri Fabrikasi", en: "Fab Thermometry" },
            description: {
                id: "Ruang pemrosesan wafer silikon membutuhkan akurasi suhu ±0.5°C agar lapisan gate oxide tidak rusak. Sensor mendeteksi spektrum Planck inframerah secara real-time.",
                en: "Silicon wafer processing chambers require ±0.5°C accuracy to prevent gate dielectric breakdown. Infrared sensors match Planck curves in real time.",
            },
            realWorldTech: { id: "Applied Materials Centura RTP Chamber", en: "Applied Materials Centura RTP Chamber" },
        },
        quiz: [
            {
                id: "q1_1",
                prompt: { id: "Berapa energi satu foton cahaya dengan frekuensi 5 × 10¹⁴ Hz (gunakan h ≈ 6.6 × 10⁻³⁴ J·s)?", en: "What is the energy of a single photon with frequency 5 × 10¹⁴ Hz (use h ≈ 6.6 × 10⁻³⁴ J·s)?" },
                formula: "E = h f",
                options: [
                    { id: "3.3 × 10⁻¹⁹ Joule", en: "3.3 × 10⁻¹⁹ Joules" },
                    { id: "1.3 × 10⁻⁴⁷ Joule", en: "1.3 × 10⁻⁴⁷ Joules" },
                    { id: "3.3 × 10⁻¹⁵ Joule", en: "3.3 × 10⁻¹⁵ Joules" },
                    { id: "6.6 × 10⁻²⁰ Joule", en: "6.6 × 10⁻²⁰ Joules" },
                ],
                answer: 0,
                explanation: {
                    id: "E = (6.6 × 10⁻³⁴) × (5 × 10¹⁴) = 33 × 10⁻²⁰ = 3.3 × 10⁻¹⁹ J. Jawaban lain keliru dalam perpangkatan eksponen.",
                    en: "E = (6.6 × 10⁻³⁴) × (5 × 10¹⁴) = 33 × 10⁻²⁰ = 3.3 × 10⁻¹⁹ J. Other options mismatch the exponential powers.",
                },
            },
            {
                id: "q1_2",
                prompt: { id: "Apa penyebab utama gagalnya hukum Rayleigh-Jeans klasik dalam menjelaskan radiasi benda hitam?", en: "What was the core flaw of the classical Rayleigh-Jeans law?" },
                options: [
                    { id: "Mengabaikan efek gravitasi bumi", en: "Ignoring Earth's gravity" },
                    { id: "Mengasumsikan energi dapat dipancarkan secara kontinu pada frekuensi tak terhingga", en: "Assuming continuous emission up to infinite frequencies" },
                    { id: "Menganggap kecepatan cahaya berubah-ubah", en: "Assuming light speed varies" },
                    { id: "Mengabaikan suhu lingkungan laboratorium", en: "Ignoring ambient temperature" },
                ],
                answer: 1,
                explanation: {
                    id: "Teori klasik mengasumsikan energi osilator kontinu, sehingga moda frekuensi tinggi tak terbatas menyerap seluruh energi (bencana UV).",
                    en: "Classical physics assumed continuous energy, leading infinite high-frequency modes to accumulate infinite energy.",
                },
            },
            {
                id: "q1_3",
                prompt: { id: "Jika frekuensi radiasi dilipatduakan, maka energi paket kuantum akan...", en: "If radiation frequency is doubled, the photon packet energy will..." },
                formula: "E = h f",
                options: [
                    { id: "Berkurang menjadi setengahnya", en: "Halve" },
                    { id: "Menjadi dua kali lipat", en: "Double" },
                    { id: "Menjadi empat kali lipat", en: "Quadruple" },
                    { id: "Tetap sama karena h adalah konstanta", en: "Remain unchanged since h is constant" },
                ],
                answer: 1,
                explanation: {
                    id: "Karena E berbanding lurus dengan frekuensi f (E ∝ f), menduplikasi frekuensi melipatduakan energi paket foton.",
                    en: "Since E is directly proportional to f (E ∝ f), doubling frequency exactly doubles packet energy.",
                },
            },
            {
                id: "q1_4",
                prompt: { id: "Puncak spektrum panjang gelombang radiasi benda hitam bergeser ke arah mana saat suhu dinaikkan?", en: "How does the blackbody emission peak wavelength shift when temperature rises?" },
                options: [
                    { id: "Ke panjang gelombang yang lebih pendek (Hukum Pergeseran Wien)", en: "To shorter wavelengths (Wien's Displacement Law)" },
                    { id: "Ke panjang gelombang yang lebih panjang", en: "To longer wavelengths" },
                    { id: "Tidak bergeser, hanya amplitudonya naik", en: "Does not shift, only amplitude increases" },
                    { id: "Menuju frekuensi nol", en: "Towards zero frequency" },
                ],
                answer: 0,
                explanation: {
                    id: "Berdasarkan Hukum Pergeseran Wien (λ_max · T = konstanta), kenaikan suhu menyebabkan puncak emisi bergeser ke λ yang lebih pendek (warna bergeser dari merah ke putih/kebiruan).",
                    en: "By Wien's Law (λ_max · T = b), increasing temperature inversely shifts peak wavelength toward shorter, higher-energy light.",
                },
            },
            {
                id: "q1_5",
                prompt: { id: "Satuan standar internasional (SI) untuk konstanta Planck h adalah...", en: "The SI standard unit for Planck's constant h is..." },
                options: [
                    { id: "Joule per detik (J/s)", en: "Joules per second (J/s)" },
                    { id: "Joule detik (J·s)", en: "Joule-seconds (J·s)" },
                    { id: "Newton meter (N·m)", en: "Newton-meters (N·m)" },
                    { id: "Watt detik (W·s)", en: "Watt-seconds (W·s)" },
                ],
                answer: 1,
                explanation: {
                    id: "E = h f => h = E/f => Joule / (1/detik) = Joule · detik (J·s). Dimensinya sama dengan momentum sudut.",
                    en: "E = h f => h = E/f => Joules / (1/s) = Joule-seconds (J·s), sharing units with angular momentum.",
                },
            },
        ],
        journalEntry: {
            id: "planck-quantum",
            chapterId: 1,
            title: { id: "Kuantisasi Energi & Hipotesis Planck", en: "Energy Quantization & Planck's Hypothesis" },
            note: {
                id: "Energi osilator atomik hanya dapat bernilai diskret E = nhf. Ini menyelesaikan anomali Bencana Ultraviolet dan meletakkan batu pertama mekanika kuantum.",
                en: "Atomic oscillator energy can only take discrete values E = nhf. This resolved the Ultraviolet Catastrophe and founded quantum mechanics.",
            },
            formula: "E = n h f",
            discoveredAt: "2026-01-10T09:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-02: Photoelectric Effect & Einstein's Photon
    // -------------------------------------------------------------
    {
        id: 2,
        code: "CH-02",
        era: "quantum_birth",
        title: {
            id: "Efek Fotolistrik & Foton Einstein",
            en: "Photoelectric Effect & Einstein's Photon",
        },
        narrative: {
            id: "Menyinari pelat natrium dengan lampu merah terang tidak melepaskan satu elektron pun. Namun, cahaya violet redup langsung memicu lonjakan elektron! Einstein membuktikan cahaya adalah partikel peluru (foton).",
            en: "Shining intense red light on sodium frees zero electrons. Yet dim violet light immediately triggers electron sparks! Einstein proves light behaves as localized bullet-like particles (photons).",
        },
        coreConcept: {
            id: "Elektron logam hanya terlepas jika SATU foton memiliki energi hf yang melebihi fungsi kerja Φ. Intensitas hanya menambah jumlah foton, bukan energi per foton.",
            en: "Metal electrons escape only if a SINGLE photon has energy hf greater than work function Φ. Intensity merely adds more photons, not more punch per photon.",
        },
        formula: "K_{max} = h f - \\Phi",
        simulation: {
            type: "photoelectric",
            hasSignFlip: true,
            signLabel: { id: "Polaritas Tegangan Penghambat (+ Percepat / − Hambat)", en: "Retarding Voltage Polarity (+ Accelerate / − Retard)" },
            defaultSign: 1,
            params: [
                { id: "frequency", label: { id: "Frekuensi Foton (THz)", en: "Photon Frequency (THz)" }, min: 400, max: 1200, step: 20, defaultValue: 750, unit: "THz" },
                { id: "work_function", label: { id: "Fungsi Kerja Logam Φ (eV)", en: "Work Function Φ (eV)" }, min: 1.8, max: 5.0, step: 0.1, defaultValue: 2.3, unit: "eV" },
                { id: "intensity", label: { id: "Intensitas Foton (Kepadatan)", en: "Photon Flux Density" }, min: 10, max: 100, step: 10, defaultValue: 50 },
            ],
            formulaTemplate: "K_{max} = h f - \\Phi",
            formulaBuilder: (p, sign) => `K_{max} = (${((p.frequency || 750) * 0.0041357).toFixed(2)} \\text{ eV}) - (${(p.work_function || 2.3).toFixed(1)} \\text{ eV}) \\quad [V_{bias} = ${sign >= 0 ? "+V" : "-V"}]`,
            signExplanation: {
                id: "Membalik tanda tegangan ke negatif (−) membalik medan listrik di antara pelat kolektor. Elektron sekarang harus melawan gaya tolak elektrostatik, sehingga hanya elektron tercepat yang mampu mencapai anoda (Tegangan Penghenti V_stop).",
                en: "Flipping polarity to negative (−) reverses the inter-electrode electric field. Photoelectrons now decelerate against electrostatic repulsion, measuring the exact Stopping Voltage V_stop.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Intensitas Cahaya Tidak Bisa Mengeluarkan Elektron?", en: "Why Can't Light Intensity Knock Electrons Out?" },
            simple: {
                id: "Bayangkan kamu melempar sejuta butir pasir ke jendela kaca; kaca tidak akan pecah. Tapi satu batu besar berkecepatan tinggi langsung memecahkannya. Foton berfrekuensi tinggi adalah batu besar tersebut!",
                en: "Throwing a million grains of sand at a glass window won't break it. But one heavy high-speed stone instantly shatters it. High-frequency photons are that heavy stone!",
            },
            deep: {
                id: "Interaksi elektron-foton adalah proses kuantum 1-lawan-1 terkuantisasi seketika (<10⁻¹⁵ s). Elektron menyerap satu foton utuh. Jika hf < Φ, energi itu segera terdisipasi menjadi getaran termal sebelum foton kedua sempat tiba.",
                en: "Photon-electron collision is an instantaneous 1-to-1 localized quantum event (<10⁻¹⁵ s). If hf < Φ, the energy disperses into lattice phonons before another photon can arrive.",
            },
            chip: {
                id: "Efek fotolistrik adalah prinsip dasar sensor piksel kamera smartphone (CMOS Image Sensor). Foton cahaya yang masuk diubah menjadi pasangan elektron-hole di dalam fotodioda silikon.",
                en: "The photoelectric mechanism drives modern smartphone CMOS Image Sensors. Photons entering each pixel photodiode generate electron-hole pairs collected as digital charge.",
            },
        },
        sideQuest: {
            id: "sq-02",
            title: { id: "Fotodioda Sensor Gambar CMOS Sony IMX", en: "Sony IMX CMOS Image Sensor Pixels" },
            tag: { id: "Sensor Kamera Optik", en: "Optical Sensing" },
            description: {
                id: "Kamera 200 MP memiliki ukuran piksel 0.6 µm. Efisiensi kuantum fotolistrik menentukan kepekaan kamera saat memotret dalam kondisi gelap gulita.",
                en: "Sub-micron 0.6 µm sensor pixels convert incident light into quantized charge packets with over 90% quantum efficiency.",
            },
            realWorldTech: { id: "Sony BSI CMOS Photodiode Array", en: "Sony BSI CMOS Photodiode Array" },
        },
        quiz: [
            {
                id: "q2_1",
                prompt: { id: "Jika frekuensi cahaya berada di bawah frekuensi ambang f₀ logam, berapakah jumlah elektron yang dilepaskan?", en: "If light frequency is strictly below threshold frequency f₀, how many photoelectrons escape?" },
                options: [
                    { id: "Nol elektron sama sekali, berapapun tingginya intensitas", en: "Zero electrons, regardless of light intensity" },
                    { id: "Sangat banyak jika intensitasnya dinaikkan", en: "A massive number if intensity is elevated" },
                    { id: "Hanya elektron dengan spin positif", en: "Only electrons with positive spin" },
                    { id: "Tergantung suhu ruangan laboratorium", en: "Dependent on ambient room temperature" },
                ],
                answer: 0,
                explanation: {
                    id: "Di bawah f₀, energi tiap foton hf < Φ sehingga elektron tidak punya cukup energi kinetik untuk lolos dari gaya ikat logam.",
                    en: "Below threshold frequency f₀, photon energy hf < Φ. No electron receives sufficient energy to overcome the surface barrier.",
                },
            },
            {
                id: "q2_2",
                prompt: { id: "Sebuah logam memiliki fungsi kerja Φ = 2.0 eV. Ditembak foton berenergi 3.5 eV. Berapa energi kinetik maksimum elektron?", en: "A metal has work function Φ = 2.0 eV and is struck by 3.5 eV photons. What is K_max?" },
                formula: "K_{max} = h f - \\Phi",
                options: [
                    { id: "1.5 eV", en: "1.5 eV" },
                    { id: "5.5 eV", en: "5.5 eV" },
                    { id: "0.7 eV", en: "0.7 eV" },
                    { id: "7.0 eV", en: "7.0 eV" },
                ],
                answer: 0,
                explanation: {
                    id: "K_max = hf - Φ = 3.5 eV - 2.0 eV = 1.5 eV.",
                    en: "K_max = hf - Φ = 3.5 eV - 2.0 eV = 1.5 eV.",
                },
            },
            {
                id: "q2_3",
                prompt: { id: "Apa dampak menaikkan intensitas cahaya yang frekuensinya sudah di atas frekuensi ambang?", en: "What happens when increasing light intensity above threshold frequency?" },
                options: [
                    { id: "Jumlah elektron yang lepas meningkat, tetapi energi kinetik maksimumnya tetap", en: "More electrons are ejected, but maximum kinetic energy remains constant" },
                    { id: "Kecepatan elektron bertambah cepat", en: "Electron velocity speeds up" },
                    { id: "Fungsi kerja logam mengecil", en: "Metal work function decreases" },
                    { id: "Elektron terhenti seketika", en: "Electrons halt immediately" },
                ],
                answer: 0,
                explanation: {
                    id: "Intensitas lebih tinggi berarti kuantitas foton per detik bertambah, sehingga lebih banyak elektron terlontar (arus foto naik), tetapi energi kinetik tiap elektron tetap.",
                    en: "Higher intensity means more photons per second, yielding more ejected photoelectrons (higher current) at identical K_max.",
                },
            },
            {
                id: "q2_4",
                prompt: { id: "Albert Einstein dianugerahi Hadiah Nobel Fisika tahun 1921 terutama atas kontribusinya pada...", en: "Albert Einstein won the 1921 Nobel Prize in Physics primarily for..." },
                options: [
                    { id: "Penjelasan teoretis efek fotolistrik", en: "Theoretical explanation of the photoelectric effect" },
                    { id: "Teori Relativitas Umum", en: "General Relativity" },
                    { id: "Penciptaan bom atom", en: "Invention of the atomic bomb" },
                    { id: "Penemuan gelombang gravitasi", en: "Discovery of gravitational waves" },
                ],
                answer: 0,
                explanation: {
                    id: "Einstein menerima Nobel 1921 secara spesifik untuk penjelasannya mengenai hukum efek fotolistrik dan hipotesis foton kuantum.",
                    en: "Einstein received the 1921 Nobel Prize specifically for his discovery of the law of the photoelectric effect.",
                },
            },
            {
                id: "q2_5",
                prompt: { id: "Berapakah tegangan penghenti (Stopping Potential) V_stop jika K_max = 2.4 eV?", en: "What is the stopping voltage V_stop if K_max = 2.4 eV?" },
                formula: "e V_{stop} = K_{max}",
                options: [
                    { id: "2.4 Volt", en: "2.4 Volts" },
                    { id: "4.8 Volt", en: "4.8 Volts" },
                    { id: "1.2 Volt", en: "1.2 Volts" },
                    { id: "0.24 Volt", en: "0.24 Volts" },
                ],
                answer: 0,
                explanation: {
                    id: "K_max = e · V_stop. Jika K_max = 2.4 eV, maka V_stop = 2.4 V.",
                    en: "K_max = e · V_stop. For K_max = 2.4 eV, the stopping voltage is directly 2.4 Volts.",
                },
            },
        ],
        journalEntry: {
            id: "photoelectric-einstein",
            chapterId: 2,
            title: { id: "Efek Fotolistrik & Dualisme Foton", en: "Photoelectric Effect & Photon Duality" },
            note: {
                id: "Cahaya mentransfer energi dalam paket partikel foton. Elektron hanya lepas bila hf > Φ, menjadi fondasi konversi foton-ke-elektron pada kamera modern.",
                en: "Light delivers energy in localized photon bullets. Photoelectrons escape only when hf > Φ, powering modern digital imaging sensors.",
            },
            formula: "K_{max} = h f - \\Phi",
            discoveredAt: "2026-01-11T10:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-03: Bohr Atom Model & Quantized Orbits
    // -------------------------------------------------------------
    {
        id: 3,
        code: "CH-03",
        era: "wave_matter",
        title: {
            id: "Model Atom Bohr & Kuantisasi Orbit",
            en: "Bohr Atom Model & Quantized Orbits",
        },
        narrative: {
            id: "Niels Bohr memecahkan teka-teki spektroskopi hidrogen. Mengapa gas hidrogen hanya memancarkan garis warna spesifik seperti kode batang kosmik? Jawabannya: elektron hanya diizinkan berada pada jari-jari orbit stasioner tertentu.",
            en: "Niels Bohr cracks the hydrogen spectral line enigma. Why does hydrogen gas emit razor-sharp spectral lines like a cosmic barcode? Answer: electrons are locked into discrete stationary orbital tracks.",
        },
        coreConcept: {
            id: "Momentum sudut elektron terkuantisasi (L = nħ). Elektron berpindah lintasan dengan melompat instan sambil memancarkan atau menyerap foton ΔE.",
            en: "Electron angular momentum is quantized in integer steps of ħ (L = nħ). State transitions happen via instantaneous quantum leaps emitting or absorbing ΔE photons.",
        },
        formula: "L = n\\hbar, \\quad E_n = -\\frac{13.6 \\text{ eV}}{n^2}",
        simulation: {
            type: "bohr",
            hasSignFlip: true,
            signLabel: { id: "Arah Transisi (+ Lompat Keluar / − Jatuh Memancarkan)", en: "Transition Direction (+ Excite / − Radiate)" },
            defaultSign: -1,
            params: [
                { id: "initial_n", label: { id: "Orbit Asal (n)", en: "Origin State (n)" }, min: 1, max: 6, step: 1, defaultValue: 3 },
                { id: "final_n", label: { id: "Orbit Tujuan (n)", en: "Target State (n)" }, min: 1, max: 6, step: 1, defaultValue: 2 },
            ],
            formulaTemplate: "\\Delta E = -13.6 \\left(\\frac{1}{n_f^2} - \\frac{1}{n_i^2}\\right) \\text{ eV}",
            formulaBuilder: (p, sign) => `\\Delta E = ${sign >= 0 ? "+" : "-"}|E_{${p.final_n || 2}} - E_{${p.initial_n || 3}}| = ${(Math.abs(13.6 * (1 / Math.pow(p.final_n || 2, 2) - 1 / Math.pow(p.initial_n || 3, 2)))).toFixed(2)} \\text{ eV}`,
            signExplanation: {
                id: "Tanda positif (+) mewakili penyerapan foton (eksitasi ke orbit lebih tinggi), sementara tanda negatif (−) mewakili de-eksitasi di mana elektron jatuh ke orbit lebih rendah sambil melepas foton cahaya.",
                en: "Positive sign (+) denotes photon absorption (excitation to higher shells), while negative sign (−) denotes spontaneous radiative relaxation emitting a photon.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Elektron Tidak Menabrak Inti Atom?", en: "Why Doesn't the Orbiting Electron Crash Into the Nucleus?" },
            simple: {
                id: "Menurut hukum fisika klasik, muatan yang berputar terus memancarkan gelombang radio dan akan kehilangan energi dalam 1 nanodetik. Bohr menyatakan orbit kuantum adalah lintasan 'stasioner' bebas radiasi.",
                en: "Under classical electrodynamics, accelerating charges radiate electromagnetic energy continuously and should crash into the nucleus in a nanosecond. Bohr postulated non-radiating stationary quantum tracks.",
            },
            deep: {
                id: "Panjang keliling orbit Bohr harus memuat tepat kelipatan bilangan bulat panjang gelombang de Broglie elektron (2πr = nλ). Hal ini menghasilkan gelombang tegak (standing wave) yang stabil tanpa kehilangan energi.",
                en: "The orbital circumference must exactly fit an integer number of electron de Broglie matter wavelengths (2πr = nλ), creating a stable self-reinforcing constructive standing wave.",
            },
            chip: {
                id: "Tingkat energi diskret inilah yang mendasari teknologi Quantum Dot Display (QLED) pada panel monitor kelas atas: ukuran kristal nano kuantum mengatur panjang gelombang foton warna RGB.",
                en: "These discrete atomic energy steps govern Quantum Dot Displays (QLED) in modern monitors: nano-crystal dimensions tune emission photons precisely for pure RGB subpixels.",
            },
        },
        sideQuest: {
            id: "sq-03",
            title: { id: "Nanokristal Layar Quantum Dot (QLED)", en: "QLED Quantum Dot Display Nanocrystals" },
            tag: { id: "Teknologi Layar Panel", en: "Display Technology" },
            description: {
                id: "Ukuran partikel semikonduktor 2 nm memancarkan cahaya biru, sedangkan 6 nm memancarkan merah murni melalui kuantisasi orbital 3D.",
                en: "2 nm semiconductor dots emit sharp blue light while 6 nm dots emit pure red light through quantum orbital confinement.",
            },
            realWorldTech: { id: "Samsung QD-OLED Subpixel Emitter", en: "Samsung QD-OLED Subpixel Emitter" },
        },
        quiz: [
            {
                id: "q3_1",
                prompt: { id: "Berapa energi elektron hidrogen pada keadaan dasar (ground state, n = 1)?", en: "What is the hydrogen electron energy in the ground state (n = 1)?" },
                formula: "E_n = -\\frac{13.6 \\text{ eV}}{n^2}",
                options: [
                    { id: "-13.6 eV", en: "-13.6 eV" },
                    { id: "0 eV", en: "0 eV" },
                    { id: "-3.4 eV", en: "-3.4 eV" },
                    { id: "+13.6 eV", en: "+13.6 eV" },
                ],
                answer: 0,
                explanation: {
                    id: "E₁ = -13.6 / (1²) = -13.6 eV. Tanda negatif menunjukkan keadaan terikat (bound state).",
                    en: "E₁ = -13.6 / (1²) = -13.6 eV. The negative sign denotes an electrostatically bound state.",
                },
            },
            {
                id: "q3_2",
                prompt: { id: "Transisi elektron hidrogen dari n = 3 ke n = 2 menghasilkan garis spektrum...", en: "A hydrogen electron transition from n = 3 down to n = 2 produces..." },
                options: [
                    { id: "Garis merah H-alpha deret Balmer (cahaya tampak)", en: "H-alpha red line of the Balmer series (visible light)" },
                    { id: "Garis ultraviolet deret Lyman", en: "Lyman series ultraviolet line" },
                    { id: "Sinar-X berdaya tembus tinggi", en: "High-penetration X-ray" },
                    { id: "Gelombang radio frekuensi rendah", en: "Low-frequency radio wave" },
                ],
                answer: 0,
                explanation: {
                    id: "Deret Balmer jatuh ke n = 2. Transisi 3 -> 2 melepaskan foton 1.89 eV yang setara dengan panjang gelombang 656 nm (cahaya merah).",
                    en: "Transitions terminating at n = 2 form the Balmer series. 3 -> 2 yields 1.89 eV corresponding to 656 nm red light.",
                },
            },
            {
                id: "q3_3",
                prompt: { id: "Besaran fisika apa yang dipostulatkan oleh Bohr bernilai kelipatan bulat dari ħ = h / 2π?", en: "Which physical quantity did Bohr postulate is an integer multiple of ħ = h / 2π?" },
                options: [
                    { id: "Momentum sudut orbital elektron", en: "Electron orbital angular momentum" },
                    { id: "Massa diam elektron", en: "Electron rest mass" },
                    { id: "Muatan listrik inti atom", en: "Nuclear electric charge" },
                    { id: "Suhu mutlak gas hidrogen", en: "Hydrogen absolute temperature" },
                ],
                answer: 0,
                explanation: {
                    id: "Postulat kedua Bohr menyatakan momentum sudut L = m · v · r = n · ħ di mana n = 1, 2, 3...",
                    en: "Bohr's quantization condition is L = m · v · r = n · ħ for positive integers n.",
                },
            },
            {
                id: "q3_4",
                prompt: { id: "Berapa energi foton yang diserap saat elektron hidrogen melompat dari n = 1 ke n = 2?", en: "How much photon energy is absorbed when hydrogen excites from n = 1 to n = 2?" },
                formula: "\\Delta E = -13.6 \\left(\\frac{1}{2^2} - \\frac{1}{1^2}\\right)",
                options: [
                    { id: "10.2 eV", en: "10.2 eV" },
                    { id: "3.4 eV", en: "3.4 eV" },
                    { id: "13.6 eV", en: "13.6 eV" },
                    { id: "1.5 eV", en: "1.5 eV" },
                ],
                answer: 0,
                explanation: {
                    id: "E₂ = -3.4 eV, E₁ = -13.6 eV. ΔE = E₂ - E₁ = -3.4 - (-13.6) = 10.2 eV.",
                    en: "E₂ = -3.4 eV, E₁ = -13.6 eV. ΔE = -3.4 - (-13.6) = 10.2 eV.",
                },
            },
            {
                id: "q3_5",
                prompt: { id: "Apa keterbatasan utama model atom Bohr yang kelak disempurnakan oleh mekanika gelombang Schrödinger?", en: "What was the main limitation of the Bohr model later resolved by Schrödinger?" },
                options: [
                    { id: "Hanya akurat untuk atom berelektron tunggal dan mengabaikan sifat gelombang 3D", en: "Accurate only for single-electron atoms and ignores 3D wave mechanics" },
                    { id: "Menyatakan bahwa elektron memiliki muatan positif", en: "Claimed electrons carried positive charge" },
                    { id: "Mengabaikan adanya proton di inti atom", en: "Ignored protons in the atomic nucleus" },
                    { id: "Gagal memprediksi massa hidrogen", en: "Failed to predict hydrogen mass" },
                ],
                answer: 0,
                explanation: {
                    id: "Model Bohr mengasumsikan lintasan lingkaran 2D klasik dan gagal memprediksi spektrum atom berelektron banyak (seperti Helium).",
                    en: "Bohr assumed circular 2D planetary orbits, breaking down for multi-electron atoms and ignoring 3D orbital geometries.",
                },
            },
        ],
        journalEntry: {
            id: "bohr-atom",
            chapterId: 3,
            title: { id: "Model Atom Bohr & Orbit Terkuantisasi", en: "Bohr Model & Quantized Orbits" },
            note: {
                id: "Momentum sudut terkuantisasi L = nħ membentuk orbit stasioner. Lompatan kuantum antar lintasan memancarkan foton spektral diskret.",
                en: "Quantized angular momentum L = nħ creates stable non-radiating orbits. Quantum leaps between levels produce discrete spectral emission.",
            },
            formula: "L = n\\hbar",
            discoveredAt: "2026-01-12T11:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-04: de Broglie Matter Waves & Quantum Bonds
    // -------------------------------------------------------------
    {
        id: 4,
        code: "CH-04",
        era: "wave_matter",
        title: {
            id: "Gelombang Materi de Broglie & Kisi Kristal",
            en: "de Broglie Matter Waves & Crystal Lattices",
        },
        narrative: {
            id: "Louis de Broglie mengajukan hipotesis radikal: jika cahaya yang bergelombang bisa menjadi partikel, maka partikel bermassa seperti elektron pasti memiliki panjang gelombang materi λ = h/p! Eksperimen difraksi Davisson-Germer membuktikannya.",
            en: "Louis de Broglie presents a radical hypothesis: if wave-like light acts as particles, then massive particles like electrons must possess matter wavelengths λ = h/p! The Davisson-Germer crystal diffraction experiment validates it.",
        },
        coreConcept: {
            id: "Setiap partikel yang bergerak memiliki panjang gelombang λ = h/p. Sifat gelombang elektron memungkinkan mikroskop elektron melihat struktur kisi atom silikon.",
            en: "Every moving particle has a matter wavelength λ = h/p. The electron's tiny wavelength enables electron microscopes to resolve sub-nanometer silicon lattices.",
        },
        formula: "\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2 m_e E}}",
        simulation: {
            type: "debroglie",
            hasSignFlip: true,
            signLabel: { id: "Arah Vektor Gelombang (+ Maju / − Balik)", en: "Wavevector Direction (+ Forward / − Reverse)" },
            defaultSign: 1,
            params: [
                { id: "voltage", label: { id: "Tegangan Akselerasi (Volt)", en: "Accelerating Voltage (V)" }, min: 10, max: 500, step: 10, defaultValue: 100, unit: "V" },
                { id: "slit_distance", label: { id: "Jarak Antar Celah / Kisi (nm)", en: "Lattice Spacing (nm)" }, min: 0.1, max: 1.0, step: 0.05, defaultValue: 0.25, unit: "nm" },
            ],
            formulaTemplate: "\\lambda = \\frac{h}{\\sqrt{2 m_e q V}}",
            formulaBuilder: (p, sign) => `\\lambda = ${(1.226 / Math.sqrt(p.voltage || 100)).toFixed(3)} \\text{ nm} \\quad [\\vec{k} = ${sign >= 0 ? "+k" : "-k"}]`,
            signExplanation: {
                id: "Membalik tanda vektor gelombang (+k menjadi -k) membalik arah rambatan fase gelombang elektron menuju sumber, mengilustrasikan interferensi pantulan balik kisi kristal (Bragg backscattering).",
                en: "Inverting wavevector sign (+k to -k) reverses spatial phase propagation, demonstrating coherent Bragg backscattering reflections off crystal planes.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Kita Tidak Melihat Benda Sehari-hari Bergelombang?", en: "Why Don't Everyday Macroscopic Objects Act Like Waves?" },
            simple: {
                id: "Karena massa kita sangat besar! Karena h sangat kecil (10⁻³⁴), panjang gelombang manusia yang berjalan kaki adalah 10⁻³⁶ meter — jauh lebih kecil daripada ukuran inti atom sehingga sifat gelombangnya tak teramati.",
                en: "Because our mass is enormous! Because h is minuscule (10⁻³⁴), a walking human has a wavelength of 10⁻³⁶ meters — vastly smaller than an atomic nucleus.",
            },
            deep: {
                id: "Hanya partikel bermassa sangat ringan seperti elektron (9.1 × 10⁻³¹ kg) pada energi beberapa elektron-volt yang memiliki panjang gelombang materi sekitar 0.1 nm — persis sebanding dengan jarak antar-atom dalam kristal padat.",
                en: "Only ultralight particles like electrons (9.1 × 10⁻³¹ kg) at few-eV energies exhibit wavelengths near 0.1 nm, perfectly matching crystalline inter-atomic lattice dimensions.",
            },
            chip: {
                id: "Panjang gelombang de Broglie elektron berkecepatan tinggi dimanfaatkan dalam Transmission Electron Microscope (TEM) untuk memeriksa ketebalan gate oxide 3 atom pada transistor 2 nm.",
                en: "High-speed electron de Broglie wavelengths enable Transmission Electron Microscopy (TEM) to inspect 3-atom-thin gate oxide layers in 2 nm foundry transistors.",
            },
        },
        sideQuest: {
            id: "sq-04",
            title: { id: "Mikroskop Elektron Transmisi (TEM) Fabrikasi", en: "Foundry TEM Metrology Inspection" },
            tag: { id: "Metrologi Nanometer", en: "Nanometer Metrology" },
            description: {
                id: "Berkas elektron 200 kV memiliki λ = 0.0025 nm, memungkinkan insinyur melihat atom silikon individual pada struktur transistor FinFET.",
                en: "Accelerated 200 kV electrons provide 0.0025 nm resolution, enabling engineers to image atomic columns in FinFET gate stacks.",
            },
            realWorldTech: { id: "Thermo Fisher Spectra Ultra TEM", en: "Thermo Fisher Spectra Ultra TEM" },
        },
        quiz: [
            {
                id: "q4_1",
                prompt: { id: "Jika momentum sebuah partikel dilipatduakan, maka panjang gelombang de Broglie-nya akan...", en: "If particle momentum doubles, its de Broglie wavelength will..." },
                formula: "\\lambda = \\frac{h}{p}",
                options: [
                    { id: "Menjadi setengah dari semula", en: "Halve" },
                    { id: "Menjadi dua kali lipat", en: "Double" },
                    { id: "Menjadi empat kali lipat", en: "Quadruple" },
                    { id: "Tetap sama", en: "Remain unchanged" },
                ],
                answer: 0,
                explanation: {
                    id: "Karena λ berbanding terbalik dengan momentum (λ ∝ 1/p), pelipatgandaan p menyebabkan λ berkurang menjadi separuhnya.",
                    en: "Because λ is inversely proportional to momentum (λ ∝ 1/p), doubling p cuts wavelength by half.",
                },
            },
            {
                id: "q4_2",
                prompt: { id: "Eksperimen historis manakah yang pertama kali membuktikan bahwa elektron mengalami difraksi seperti gelombang?", en: "Which landmark experiment first confirmed that electrons diffract like waves?" },
                options: [
                    { id: "Eksperimen difraksi Davisson-Germer pada kristal nikel", en: "Davisson-Germer electron diffraction on nickel crystals" },
                    { id: "Eksperimen tetes minyak Millikan", en: "Millikan oil drop experiment" },
                    { id: "Eksperimen lembaran emas Rutherford", en: "Rutherford gold foil experiment" },
                    { id: "Eksperimen interferometer Michelson-Morley", en: "Michelson-Morley interferometer experiment" },
                ],
                answer: 0,
                explanation: {
                    id: "Pada tahun 1927, Davisson dan Germer menembakkan elektron ke kristal nikel dan mengamati pola difraksi interferensi Bragg.",
                    en: "In 1927, Clinton Davisson and Lester Germer scattered electrons off nickel crystals, observing Bragg diffraction peaks.",
                },
            },
            {
                id: "q4_3",
                prompt: { id: "Mengapa berkas elektron dapat menghasilkan resolusi gambar jauh lebih tinggi daripada mikroskop optik?", en: "Why do electron beams achieve far higher resolution than optical microscopes?" },
                options: [
                    { id: "Panjang gelombang elektron jauh lebih pendek daripada panjang gelombang foton cahaya tampak", en: "Electron matter wavelengths are orders of magnitude shorter than visible photons" },
                    { id: "Elektron bergerak lebih lambat daripada cahaya", en: "Electrons travel slower than light" },
                    { id: "Elektron memiliki muatan negatif", en: "Electrons carry negative charge" },
                    { id: "Lensa mikroskop elektron terbuat dari kaca kristal murni", en: "Electron microscope lenses are made of pure quartz" },
                ],
                answer: 0,
                explanation: {
                    id: "Batas difraksi resolusi sebanding dengan λ. Panjang gelombang elektron (sub-nanometer) ribuan kali lebih pendek dari cahaya tampak (400-700 nm).",
                    en: "Diffraction limits scale directly with λ. Accelerated electrons have picometer wavelengths compared to 400-700 nm visible light.",
                },
            },
            {
                id: "q4_4",
                prompt: { id: "Kira-kira berapakah panjang gelombang de Broglie elektron yang dipercepat oleh tegangan 100 Volt?", en: "Approximately what is the de Broglie wavelength of an electron accelerated by 100 V?" },
                formula: "\\lambda \\approx \\frac{1.226}{\\sqrt{V}} \\text{ nm}",
                options: [
                    { id: "0.123 nm (sekitar 1.23 Å)", en: "0.123 nm (about 1.23 Å)" },
                    { id: "12.3 nm", en: "12.3 nm" },
                    { id: "1.226 µm", en: "1.226 µm" },
                    { id: "0.0012 nm", en: "0.0012 nm" },
                ],
                answer: 0,
                explanation: {
                    id: "λ = 1.226 / √100 = 1.226 / 10 = 0.1226 nm, bersesuaian dengan skala kisi atom kristal padat.",
                    en: "λ = 1.226 / √100 = 0.1226 nm, matching crystal interatomic spacing.",
                },
            },
            {
                id: "q4_5",
                prompt: { id: "Siapakah fisikawan yang mempostulatkan hipotesis dualisme gelombang materi ini dalam tesis doktoralnya tahun 1924?", en: "Who postulated the matter-wave duality hypothesis in his 1924 doctoral thesis?" },
                options: [
                    { id: "Louis de Broglie", en: "Louis de Broglie" },
                    { id: "Erwin Schrödinger", en: "Erwin Schrödinger" },
                    { id: "Werner Heisenberg", en: "Werner Heisenberg" },
                    { id: "Enrico Fermi", en: "Enrico Fermi" },
                ],
                answer: 0,
                explanation: {
                    id: "Pangeran Louis de Broglie mempublikasikan hipotesis ini tahun 1924 dan meraih Nobel Fisika tahun 1929.",
                    en: "Prince Louis de Broglie proposed matter waves in 1924, winning the 1929 Nobel Prize in Physics.",
                },
            },
        ],
        journalEntry: {
            id: "debroglie-matter-waves",
            chapterId: 4,
            title: { id: "Dualisme Gelombang Materi de Broglie", en: "de Broglie Matter Waves" },
            note: {
                id: "Partikel bermassa memiliki panjang gelombang λ = h/p. Sifat gelombang elektron menjadi kunci difraksi kristal dan mikroskopi elektron nanometer.",
                en: "Massive particles behave as waves with λ = h/p. Electron wave interference enables sub-nanometer crystallography and electron microscopy.",
            },
            formula: "\\lambda = \\frac{h}{p}",
            discoveredAt: "2026-01-13T12:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-05: Superposition & The Schrödinger Wavefunction
    // -------------------------------------------------------------
    {
        id: 5,
        code: "CH-05",
        era: "wave_mechanics",
        title: {
            id: "Persamaan Schrödinger & Fungsi Gelombang",
            en: "Schrödinger Equation & Wavefunction Superposition",
        },
        narrative: {
            id: "Erwin Schrödinger merumuskan persamaan diferensial agung mekanika kuantum. Keberadaan elektron tidak lagi digambarkan sebagai partikel titik, melainkan fungsi gelombang kompleks Ψ(x,t) yang berevolusi menurut operator Hamiltonian.",
            en: "Erwin Schrödinger formulates the master wave equation of quantum mechanics. An electron is no longer an exact billiard ball coordinate, but a complex wave amplitude Ψ(x,t) governed by the Hamiltonian.",
        },
        coreConcept: {
            id: "Kuadrat amplitudo fungsi gelombang |Ψ(x)|² menyatakan kerapatan probabilitas menemukan elektron di posisi x (Interpretasi Born). Sebelum pengukuran, sistem berada dalam superposisi linier.",
            en: "The squared modulus |Ψ(x)|² represents the probability density of finding the electron at position x (Born Rule). Prior to observation, the state exists in linear superposition.",
        },
        formula: "i\\hbar\\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi, \\quad P(x) = |\\Psi(x)|^2",
        simulation: {
            type: "wavefunction",
            hasSignFlip: true,
            signLabel: { id: "Fase Waktu Superposisi (+e^{-iωt} / −e^{+iωt})", en: "Time Evolution Phase (+e^{-iωt} / −e^{+iωt})" },
            defaultSign: 1,
            params: [
                { id: "box_width", label: { id: "Lebar Sumur Potensial L (nm)", en: "Quantum Well Width L (nm)" }, min: 1, max: 8, step: 0.5, defaultValue: 4, unit: "nm" },
                { id: "mode_mix", label: { id: "Superposisi Moda (n=1 vs n=2)", en: "Mode Superposition (n=1 vs n=2)" }, min: 0, max: 100, step: 10, defaultValue: 50, unit: "%" },
            ],
            formulaTemplate: "\\Psi(x,t) = c_1 \\psi_1 e^{-iE_1 t/\\hbar} + c_2 \\psi_2 e^{-iE_2 t/\\hbar}",
            formulaBuilder: (p, sign) => `|\\Psi(x,t)|^2 = |c_1\\psi_1 + ${sign >= 0 ? "+" : "-"} c_2\\psi_2 e^{-i\\Delta\\omega t}|^2 \\quad [L = ${p.box_width || 4} \\text{ nm}]`,
            signExplanation: {
                id: "Membalik tanda fase interferensi superposisi (+ ke -) menggeser puncak probabilitas elektron dari sisi kiri sumur ke sisi kanan sumur kuantum, mendemonstrasikan osilasi paket gelombang terkuantisasi.",
                en: "Flipping superposition phase (+ to -) shifts the peak probability density from the left barrier to the right barrier, visualizing quantum coherent wavepacket sloshing.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Fungsi Gelombang Harus Bernilai Kompleks (Ada Bilangan Imajiner i)?", en: "Why Must the Wavefunction Be Complex (Contain Imaginary i)?" },
            simple: {
                id: "Bilangan imajiner i = √(-1) bertindak seperti kompas dua dimensi: ia memungkinkan gelombang berputar dalam bidang fase tanpa kehilangan energi total (probabilitas total selalu 100%).",
                en: "The imaginary unit i = √(-1) acts like a 2D compass, allowing phase rotation in the complex plane while preserving unitary probability (100% total probability at all times).",
            },
            deep: {
                id: "Persamaan Schrödinger berorde satu dalam waktu (∂Ψ/∂t) berbeda dengan gelombang klasik berorde dua. Faktor i memastikan operator waktu menghasilkan nilai eigen energi real (Hermitian) dan konservasi arus probabilitas.",
                en: "Being first-order in time (∂Ψ/∂t), the factor i ensures Hermitian energy eigenvalues and unitary time evolution (U = e^(-iHt/ħ)), preserving quantum probability conservation.",
            },
            chip: {
                id: "Prinsip superposisi ini adalah landasan operasi Quantum Bit (Qubit) pada prosesor komputer kuantum superkonduktor seperti Google Sycamore dan IBM Quantum.",
                en: "This superposition principle enables Quantum Bits (Qubits) in superconducting quantum computing processors like Google Sycamore and IBM Quantum.",
            },
        },
        sideQuest: {
            id: "sq-05",
            title: { id: "Qubit Transmon Komputer Kuantum Sycamore", en: "Google Sycamore Transmon Qubits" },
            tag: { id: "Komputasi Kuantum", en: "Quantum Computing" },
            description: {
                id: "Sirkuit superkonduktor sambungan Josephson memanfaatkan superposisi dua tingkat kuantum |0⟩ dan |1⟩ pada suhu 15 miliKelvin.",
                en: "Superconducting Josephson junctions maintain coherent superposition of |0⟩ and |1⟩ quantum states at 15 milliKelvin cryo-temperatures.",
            },
            realWorldTech: { id: "Google Quantum AI Sycamore Processor", en: "Google Quantum AI Sycamore Processor" },
        },
        quiz: [
            {
                id: "q5_1",
                prompt: { id: "Apa arti fisik dari nilai |Ψ(x)|² menurut interpretasi Max Born?", en: "What does |Ψ(x)|² represent physically according to Max Born?" },
                options: [
                    { id: "Kerapatan probabilitas menemukan partikel pada posisi x", en: "Probability density of locating the particle at position x" },
                    { id: "Kecepatan aktual partikel dalam meter per detik", en: "Actual particle speed in meters per second" },
                    { id: "Muatan listrik total seluruh atom", en: "Total electric charge of all atoms" },
                    { id: "Tekanan udara di dalam sumur kuantum", en: "Air pressure inside the quantum well" },
                ],
                answer: 0,
                explanation: {
                    id: "Max Born merumuskan bahwa probabilitas menemukan partikel di antara x dan x+dx adalah P = |Ψ(x)|² dx.",
                    en: "Born's statistical postulate proves the probability of measuring a particle in [x, x+dx] is |Ψ(x)|² dx.",
                },
            },
            {
                id: "q5_2",
                prompt: { id: "Untuk partikel dalam sumur potensial tak hingga satu dimensi (Particle in a Box), energi berbanding lurus dengan...", en: "For a particle in a 1D infinite square well, energy levels scale with..." },
                formula: "E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2 m L^2}",
                options: [
                    { id: "Kuadrat bilangan kuantum (n²)", en: "Square of quantum number (n²)" },
                    { id: "Akar dari bilangan kuantum (√n)", en: "Square root of quantum number (√n)" },
                    { id: "Berbanding lurus langsung dengan n", en: "Directly linear with n" },
                    { id: "Berbanding terbalik dengan n²", en: "Inversely proportional to n²" },
                ],
                answer: 0,
                explanation: {
                    id: "E_n = (n² π² ħ²) / (2 m L²). Tingkat energi merenggang seiring naiknya n².",
                    en: "E_n ∝ n² / L². Energy levels space quadratically farther apart as n increases.",
                },
            },
            {
                id: "q5_3",
                prompt: { id: "Berapakah probabilitas total menemukan partikel di seluruh ruang (syarat normalisasi)?", en: "What is the total probability of finding a particle integrated over all space?" },
                formula: "\\int_{-\\infty}^{+\\infty} |\\Psi(x)|^2 dx = ?",
                options: [
                    { id: "1 (atau 100%)", en: "1 (or 100%)" },
                    { id: "0", en: "0" },
                    { id: "Tak hingga (∞)", en: "Infinity (∞)" },
                    { id: "Konstanta Planck h", en: "Planck's constant h" },
                ],
                answer: 0,
                explanation: {
                    id: "Karena partikel pasti berada di suatu tempat dalam alam semesta, integral probabilitas total harus tepat sama dengan 1.",
                    en: "Since the particle must exist somewhere in the universe, the total integrated probability is strictly normalized to 1.",
                },
            },
            {
                id: "q5_4",
                prompt: { id: "Jika sistem berada dalam keadaan superposisi |Ψ⟩ = (1/√2)|1⟩ + (1/√2)|2⟩, berapa peluang mengukur keadaan |1⟩?", en: "If in superposition |Ψ⟩ = (1/√2)|1⟩ + (1/√2)|2⟩, what is the probability of measuring state |1⟩?" },
                options: [
                    { id: "50% (atau 1/2)", en: "50% (or 1/2)" },
                    { id: "100%", en: "100%" },
                    { id: "25% (atau 1/4)", en: "25% (or 1/4)" },
                    { id: "70.7% (atau 1/√2)", en: "70.7% (or 1/√2)" },
                ],
                answer: 0,
                explanation: {
                    id: "P₁ = |c₁|² = |1/√2|² = 1/2 = 50%.",
                    en: "P₁ = |c₁|² = |1/√2|² = 1/2 = 50%.",
                },
            },
            {
                id: "q5_5",
                prompt: { id: "Apa yang terjadi pada fungsi gelombang saat dilakukan pengukuran observasi kuantum menurut interpretasi Kopenhagen?", en: "What happens to the wavefunction upon measurement according to the Copenhagen interpretation?" },
                options: [
                    { id: "Fungsi gelombang mengalami keruntuhan (wavefunction collapse) ke satu keadaan eigen", en: "Wavefunction collapses to a single definitive eigenstate" },
                    { id: "Partikel hancur menjadi energi murni", en: "The particle disintegrates into pure photons" },
                    { id: "Frekuensi partikel menjadi tak terhingga", en: "Particle frequency shoots to infinity" },
                    { id: "Fungsi gelombang berubah menjadi gelombang bunyi", en: "Wavefunction converts into sound waves" },
                ],
                answer: 0,
                explanation: {
                    id: "Pengukuran memaksa superposisi runtuh seketika menjadi salah satu keadaan eigen teramati dengan probabilitas Born.",
                    en: "Measurement forces the coherent superposition to project (collapse) into a single measured eigenstate.",
                },
            },
        ],
        journalEntry: {
            id: "schrodinger-wavefunction",
            chapterId: 5,
            title: { id: "Persamaan Schrödinger & Probabilitas Born", en: "Schrödinger Equation & Born Probability" },
            note: {
                id: "Partikel kuantum diekspresikan sebagai fungsi gelombang Ψ. Kerapatan probabilitas |Ψ|² dan superposisi keadaan menjadi dasar komputasi kuantum.",
                en: "Quantum entities exist as complex wavefunctions Ψ. Probability density |Ψ|² and coherent superposition drive quantum algorithms.",
            },
            formula: "i\\hbar\\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi",
            discoveredAt: "2026-01-14T13:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-06: Quantum Tunneling & Gate Leakage (REFERENCE SIMULATION)
    // -------------------------------------------------------------
    {
        id: 6,
        code: "CH-06",
        era: "quantum_tunneling",
        title: {
            id: "Penerowongan Kuantum & Kebocoran Gerbang",
            en: "Quantum Tunneling & Gate Dielectric Leakage",
        },
        narrative: {
            id: "Di dunia klasik, partikel dengan energi E tidak pernah bisa melewati bukit potensial V₀ jika E < V₀. Namun di dunia kuantum, ekor eksponensial fungsi gelombang menembus penghalang tipis! Fenomena ini menyalakan fusi matahari tetapi menjadi musuh terbesar transistor 3 nm.",
            en: "Classically, a particle with energy E can never cross a potential wall V₀ if E < V₀. But in the quantum world, the exponential tail of the wavefunction penetrates through thin barriers! This powers solar fusion, yet haunts modern 3 nm transistors as leakage current.",
        },
        coreConcept: {
            id: "Probabilitas transmisi penerowongan T meluruh secara eksponensial terhadap ketebalan rintangan L (T ≈ e^(-2κL)). Mengubah arah momentum partikel (+ ke −) membalik arah aliran gelombang datang dan pantulan.",
            en: "Tunneling transmission probability decays exponentially with barrier thickness L (T ≈ e^(-2κL)). Flipping particle momentum (+ to −) reverses incident and reflected wave propagation.",
        },
        formula: "T \\approx e^{-2\\kappa L}, \\quad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}",
        simulation: {
            type: "tunneling",
            hasSignFlip: true,
            signLabel: { id: "Arah Gerak Elektron (+ Maju Menembus / − Balik Terpantul)", en: "Electron Velocity Vector (+ Forward Incident / − Reverse Reflection)" },
            defaultSign: 1,
            params: [
                { id: "barrier_width", label: { id: "Tebal Penghalang L (nm)", en: "Barrier Thickness L (nm)" }, min: 0.5, max: 3.5, step: 0.1, defaultValue: 1.2, unit: "nm" },
                { id: "barrier_height", label: { id: "Tinggi Potensial V₀ (eV)", en: "Barrier Height V₀ (eV)" }, min: 2.0, max: 8.0, step: 0.5, defaultValue: 4.5, unit: "eV" },
                { id: "particle_energy", label: { id: "Energi Elektron E (eV)", en: "Electron Energy E (eV)" }, min: 0.5, max: 4.0, step: 0.1, defaultValue: 2.5, unit: "eV" },
            ],
            formulaTemplate: "T \\approx \\exp\\left(-2 L \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}\\right)",
            formulaBuilder: (p, sign) => {
                const L = p.barrier_width || 1.2;
                const V0 = Math.max((p.barrier_height || 4.5), (p.particle_energy || 2.5) + 0.1);
                const E = p.particle_energy || 2.5;
                const kappa = 5.12 * Math.sqrt(V0 - E);
                const T = Math.exp(-2 * kappa * (L * 0.1));
                return `\\vec{v} = ${sign >= 0 ? "+" : "-"}\\sqrt{\\frac{2(E)}{m_e}} \\implies T = ${(T * 100).toFixed(2)}\\% \\quad [\\kappa = ${kappa.toFixed(2)} \\text{ nm}^{-1}]`;
            },
            signExplanation: {
                id: "MEMBALIK TANDA (+ ke −): Membalik tanda vektor kecepatan (v = −√(2E/m)) membalik arah berkas elektron datang dari arah kanan kembali ke kiri. Fungsi gelombang yang tadinya menembus ke depan kini terpantul berbalik arah, membuktikan bahwa momentum linier p = ħk memiliki sifat simetri pembalikan waktu (T-symmetry).",
                en: "SIGN-FLIP EXPLANATION (+ to −): Reversing velocity sign (v = −√(2E/m)) inverts the electron beam vector from right-incident to left-propagating. The wavepacket that was tunneling forward is now reflected backwards, demonstrating that linear momentum p = ħk obeys microscopic time-reversal symmetry in potential barriers.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Gate Oxide Silikon Bocor Saat Dibuat Lebih Tipis dari 2 nm?", en: "Why Do Silicon Gate Oxides Leak When Thinner Than 2 nm?" },
            simple: {
                id: "Bayangkan rintangan adalah dinding kaca. Jika tebalnya 10 cm, tidak ada yang bisa lewat. Tapi jika ditipiskan hingga 1 nanometer (hanya 5 lapis atom), fungsi gelombang elektron tembus begitu saja tanpa hambatan!",
                en: "Imagine the barrier as a glass wall. At 10 cm, nothing passes. But if shaved down to 1 nanometer (barely 5 atoms thick), the electron's quantum wave leaks straight through like mist through a screen door!",
            },
            deep: {
                id: "Di dalam rintangan, energi elektron lebih kecil daripada potensial (E < V₀). Solusi persamaan Schrödinger menghasilkan bilangan gelombang imajiner k = iκ. Gelombang sinus berubah menjadi fungsi peluruhan eksponensial riil e^(-κx). Jika L cukup tipis, ekor amplitudo di sisi seberang belum nol!",
                en: "Inside the barrier, E < V₀ yields an imaginary wavevector k = iκ. The spatial sinusoidal wave converts into a decaying real exponential e^(-κx). For sub-2 nm barriers, this tail emerges with non-zero amplitude on the other side!",
            },
            chip: {
                id: "Inilah alasan industri semikonduktor meninggalkan SiO₂ dan beralih ke material High-k Dielectric (seperti Hafnium Oxide HfO₂) yang memiliki penghalang fisik lebih tebal untuk kapasitansi yang sama.",
                en: "This quantum leakage crisis forced chipmakers to abandon SiO₂ and invent High-k Hafnium Oxide (HfO₂) dielectrics, restoring physical barrier thickness at identical gate capacitance.",
            },
        },
        sideQuest: {
            id: "sq-06",
            title: { id: "Krisis Kebocoran Gerbang Dielektrik High-k Metal Gate", en: "High-k Metal Gate Dielectric Leakage Crisis" },
            tag: { id: "Inovasi Transistor", en: "Transistor Innovation" },
            description: {
                id: "Intel dan TSMC mengganti silikon dioksida dengan HfO₂ (dielektrik k tinggi) untuk menekan arus bocor penerowongan hingga 100 kali lipat pada node 45 nm ke bawah.",
                en: "Replacing SiO₂ with Hafnium dielectric suppressed parasitic quantum tunneling leakage by 100× starting at the 45 nm generation.",
            },
            realWorldTech: { id: "Intel 45nm High-k Hafnium Gate Stack", en: "Intel 45nm High-k Hafnium Gate Stack" },
        },
        quiz: [
            {
                id: "q6_1",
                prompt: { id: "Bagaimana hubungan probabilitas penerowongan kuantum T terhadap ketebalan rintangan L?", en: "How does tunneling transmission probability T depend on barrier thickness L?" },
                formula: "T \\approx e^{-2\\kappa L}",
                options: [
                    { id: "Meluruh secara eksponensial terhadap ketebalan L", en: "Decays exponentially with thickness L" },
                    { id: "Menurun secara linier berbanding terbalik", en: "Decreases linearly" },
                    { id: "Meningkat seiring bertambah tebalnya rintangan", en: "Increases with thicker barriers" },
                    { id: "Konstan dan tidak bergantung pada ketebalan L", en: "Remains constant independent of L" },
                ],
                answer: 0,
                explanation: {
                    id: "T berbanding lurus dengan e^(-2κL). Menambah sedikit saja ketebalan L akan memotong arus terowongan secara eksponensial drastis.",
                    en: "Tunneling decays exponentially e^(-2κL). Even a few angstroms increase in L exponentially chokes off leakage current.",
                },
            },
            {
                id: "q6_2",
                prompt: { id: "Teknologi memori non-volatile manakah yang secara sengaja memanfaatkan penerowongan kuantum Fowler-Nordheim untuk menulis data?", en: "Which non-volatile memory technology intentionally uses Fowler-Nordheim tunneling to program data?" },
                options: [
                    { id: "Flash NAND Memory (SSD & USB Drive)", en: "NAND Flash Memory (SSDs & USB Drives)" },
                    { id: "DRAM Komputer Desktop", en: "Desktop Computer DRAM" },
                    { id: "Hard Disk Magnetik Mekanis", en: "Mechanical Magnetic Hard Drives" },
                    { id: "Kaset Pita Audio Analog", en: "Analog Audio Cassette Tape" },
                ],
                answer: 0,
                explanation: {
                    id: "Memori Flash SSD menggunakan medan listrik tinggi untuk menerowongkan elektron menembus oksida tipis ke Floating Gate / Charge Trap.",
                    en: "NAND Flash drives tunnel electrons across a thin dielectric barrier into charge-trapping nodes to store bits non-volatilly.",
                },
            },
            {
                id: "q6_3",
                prompt: { id: "Bentuk fungsi gelombang elektron di DALAM rintangan potensial persegi (E < V₀) adalah...", en: "The mathematical form of the wavefunction INSIDE the barrier (E < V₀) is..." },
                options: [
                    { id: "Eksponensial meluruh nyata: e^(-κx)", en: "Real decaying exponential: e^(-κx)" },
                    { id: "Gelombang sinus berosilasi konstan: sin(kx)", en: "Constant sinusoidal wave: sin(kx)" },
                    { id: "Garis lurus horizontal bernilai konstan", en: "Horizontal constant line" },
                    { id: "Kurva parabola kuadratik: x²", en: "Quadratic parabola: x²" },
                ],
                answer: 0,
                explanation: {
                    id: "Karena E < V₀, bilangan gelombang menjadi imajiner k = iκ, mengubah fungsi sinus berosilasi menjadi fungsi peluruhan eksponensial nyata.",
                    en: "Inside the classically forbidden zone (E < V₀), the wavevector is purely imaginary, producing an exponentially decaying envelope.",
                },
            },
            {
                id: "q6_4",
                prompt: { id: "Jika massa partikel dinaikkan (misal partikel diganti dari elektron menjadi proton yang 1836x lebih berat), peluang penerowongan akan...", en: "If particle mass increases (e.g. replacing an electron with an 1836× heavier proton), tunneling probability will..." },
                formula: "\\kappa = \\frac{\\sqrt{2 m (V_0 - E)}}{\\hbar}",
                options: [
                    { id: "Turun secara sangat drastis mendekati nol", en: "Plummet drastically close to zero" },
                    { id: "Naik secara eksponensial", en: "Increase exponentially" },
                    { id: "Tetap sama persis", en: "Remain precisely identical" },
                    { id: "Berubah menjadi partikel foton", en: "Convert into photon packets" },
                ],
                answer: 0,
                explanation: {
                    id: "Massa m yang lebih besar membuat nilai κ jauh lebih besar, sehingga peluruhan eksponensial e^(-2κL) jatuh ke nol seketika.",
                    en: "Heavier mass dramatically increases κ in the exponent, quenching tunneling transmission down to absolute zero.",
                },
            },
            {
                id: "q6_5",
                prompt: { id: "Apa solusi utama insinyur chip saat lapisan gerbang silikon dioksida (SiO₂) bocor akibat penerowongan kuantum?", en: "What was the semiconductor industry's primary solution to gate oxide tunneling leakage?" },
                options: [
                    { id: "Mengganti SiO₂ dengan material dielektrik High-k (seperti Hafnium Oksida) yang lebih tebal secara fisik", en: "Replacing SiO₂ with physically thicker High-k dielectrics (such as Hafnium Oxide)" },
                    { id: "Menaikkan voltase prosesor menjadi 100 Volt", en: "Increasing CPU voltage up to 100 Volts" },
                    { id: "Mendinginkan komputer dengan es batu", en: "Cooling processors with ice cubes" },
                    { id: "Menghapus isolator gerbang sama sekali", en: "Eliminating the gate insulator completely" },
                ],
                answer: 0,
                explanation: {
                    id: "Dielektrik High-k (HfO₂) memiliki konstanta dielektrik k tinggi, sehingga ketebalan fisik L bisa dibuat lebih tebal untuk menghentikan penerowongan.",
                    en: "High-k dielectrics provide high capacitance at larger physical thicknesses L, exponentially blocking quantum tunneling.",
                },
            },
        ],
        journalEntry: {
            id: "quantum-tunneling",
            chapterId: 6,
            title: { id: "Penerowongan Kuantum & Kebocoran Gerbang", en: "Quantum Tunneling & Gate Leakage" },
            note: {
                id: "Fungsi gelombang menembus rintangan potensial terlarang dengan probabilitas T ≈ e^(-2κL). Fenomena ini menjadi fondasi memori Flash namun membatasi ketebalan gerbang transistor.",
                en: "Wavefunctions penetrate classically forbidden barriers with probability T ≈ e^(-2κL), enabling Flash storage while constraining transistor gate scaling.",
            },
            formula: "T \\approx e^{-2\\kappa L}",
            discoveredAt: "2026-01-15T14:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-07: Energy Band Theory & Bandgap
    // -------------------------------------------------------------
    {
        id: 7,
        code: "CH-07",
        era: "solid_state",
        title: {
            id: "Teori Pita Energi & Celah Pita (Bandgap)",
            en: "Energy Band Theory & The Forbidden Bandgap",
        },
        narrative: {
            id: "Ketika triliunan atom silikon dirapatkan membentuk kristal padat, Prinsip Larangan Pauli memaksa tingkat-tingkat energi elektron yang bertumpuk untuk berpisah menjadi pita-pita energi kontinu: Pita Valensi dan Pita Konduksi.",
            en: "When trillions of silicon atoms pack into a periodic crystal, the Pauli Exclusion Principle forbids identical quantum states, splitting energy levels into continuous Valence and Conduction bands.",
        },
        coreConcept: {
            id: "Celah pita (Bandgap Eg = Ec - Ev) adalah 'jurang energi terlarang' yang harus dilompati elektron agar kristal dapat mengalirkan arus listrik.",
            en: "The bandgap (Eg = Ec - Ev) is the forbidden energetic chasm that electrons must jump across to conduct electricity through a solid.",
        },
        formula: "E_g = E_C - E_V",
        simulation: {
            type: "bandgap",
            hasSignFlip: true,
            signLabel: { id: "Arah Medan Listrik Eksternal (+ Kanan / − Kiri)", en: "External Electric Field (+ Right / − Left)" },
            defaultSign: 1,
            params: [
                { id: "bandgap_eg", label: { id: "Lebar Celah Pita Eg (eV)", en: "Bandgap Width Eg (eV)" }, min: 0.1, max: 4.0, step: 0.1, defaultValue: 1.12, unit: "eV" },
                { id: "temperature", label: { id: "Suhu Bahan (Kelvin)", en: "Material Temperature (K)" }, min: 100, max: 600, step: 25, defaultValue: 300, unit: "K" },
            ],
            formulaTemplate: "n_i = \\sqrt{N_C N_V} \\exp\\left(-\\frac{E_g}{2 k_B T}\\right)",
            formulaBuilder: (p, sign) => `E_g = ${(p.bandgap_eg || 1.12).toFixed(2)} \\text{ eV} \\quad [\\vec{\\mathcal{E}} = ${sign >= 0 ? "+\\mathcal{E}" : "-\\mathcal{E}"}]`,
            signExplanation: {
                id: "Membalik tanda medan listrik memiringkan pita energi ke arah berlawanan: elektron di pita konduksi kini melayang ke kiri sedangkan hole di pita valensi melayang ke kanan.",
                en: "Reversing electric field sign tilts the energy band diagram in reverse: conduction electrons drift left while valence holes drift right.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Kayu Adalah Isolator sedangkan Tembaga Adalah Konduktor?", en: "Why Is Wood an Insulator While Copper Is a Conductor?" },
            simple: {
                id: "Pada konduktor (tembaga), pita energinya saling tumpang tindih sehingga elektron bebas bergerak tanpa hambatan. Pada isolator (kayu/kaca), jurang celah pita sangat lebar (>5 eV) sehingga elektron mustahil melompat.",
                en: "In conductors (copper), energy bands overlap so electrons roam free with zero hurdle. In insulators (wood/diamond), the bandgap is a massive canyon (>5 eV) that electrons cannot leap.",
            },
            deep: {
                id: "Pada semikonduktor (seperti Silikon Eg = 1.12 eV), celah pita cukup moderat sehingga energi termal k_BT pada suhu kamar (300 K) mampu membangkitkan sejumlah pasangan elektron-hole secara terkendali.",
                en: "Semiconductors like Silicon (Eg = 1.12 eV) have a moderate bandgap where room-temperature thermal energy k_BT reliably excites controllable electron-hole carrier concentrations.",
            },
            chip: {
                id: "Bahan semikonduktor masa depan seperti Gallium Nitride (GaN, Eg = 3.4 eV) dan Silicon Carbide (SiC, Eg = 3.2 eV) mampu menahan tegangan ribuan volt tanpa mengalami breakdown termal.",
                en: "Wide-bandgap chips like Gallium Nitride (GaN, Eg = 3.4 eV) and Silicon Carbide (SiC, Eg = 3.2 eV) withstand thousands of volts in electric vehicle inverters without thermal breakdown.",
            },
        },
        sideQuest: {
            id: "sq-07",
            title: { id: "Chip Daya Mobil Listrik SiC & GaN Fast Charger", en: "EV SiC Inverter & GaN Fast Chargers" },
            tag: { id: "Elektronika Daya", en: "Power Electronics" },
            description: {
                id: "Inverter Tesla Model 3 menggunakan chip SiC wide-bandgap untuk efisiensi daya 98% pada tegangan baterai 800 Volt.",
                en: "Silicon Carbide wide-bandgap transistors deliver 98% conversion efficiency at 800V in electric vehicle powertrains.",
            },
            realWorldTech: { id: "STMicroelectronics SiC Power MOSFET", en: "STMicroelectronics SiC Power MOSFET" },
        },
        quiz: [
            {
                id: "q7_1",
                prompt: { id: "Berapakah nilai celah pita (bandgap) silikon murni pada suhu kamar (~300 K)?", en: "What is the bandgap of pure silicon at room temperature (~300 K)?" },
                options: [
                    { id: "Sekitar 1.12 eV", en: "Approximately 1.12 eV" },
                    { id: "0 eV (tumpang tindih)", en: "0 eV (overlapping bands)" },
                    { id: "5.5 eV", en: "5.5 eV" },
                    { id: "0.01 eV", en: "0.01 eV" },
                ],
                answer: 0,
                explanation: {
                    id: "Silikon memiliki celah pita tak langsung sebesar 1.12 eV pada suhu 300 K, menjadikannya semikonduktor ideal untuk elektronik digital.",
                    en: "Silicon features an indirect bandgap of 1.12 eV at 300 K, optimal for thermally stable digital switching.",
                },
            },
            {
                id: "q7_2",
                prompt: { id: "Bahan manakah di bawah ini yang memiliki pita valensi dan pita konduksi yang saling tumpang tindih (tanpa celah pita)?", en: "Which material exhibits overlapping valence and conduction bands (no bandgap)?" },
                options: [
                    { id: "Tembaga (Konduktor logam)", en: "Copper (Metallic conductor)" },
                    { id: "Silikon murni", en: "Pure silicon" },
                    { id: "Intan berlian (Isolator)", en: "Diamond (Insulator)" },
                    { id: "Silikon dioksida", en: "Silicon dioxide" },
                ],
                answer: 0,
                explanation: {
                    id: "Pada logam konduktor, pita konduksi terisi sebagian atau tumpang tindih dengan pita valensi, sehingga elektron bebas mengalir bebas.",
                    en: "In metallic conductors, bands overlap or are partially occupied, providing abundant delocalized conduction electrons.",
                },
            },
            {
                id: "q7_3",
                prompt: { id: "Ketika sebuah elektron di pita valensi melompat ke pita konduksi, apa yang ditinggalkannya di pita valensi?", en: "When a valence electron excites to the conduction band, what remains behind?" },
                options: [
                    { id: "Sebuah 'hole' (lubang kosong) bermuatan positif efektif", en: "A 'hole' acting as an effective positive charge carrier" },
                    { id: "Sebuah partikel proton bebas", en: "A free proton" },
                    { id: "Sebuah partikel foton cahaya", en: "A light photon" },
                    { id: "Sebuah atom netron", en: "A neutron atom" },
                ],
                answer: 0,
                explanation: {
                    id: "Ketiadaan elektron pada pita valensi berperilaku seperti kuasipartikel bermuatan positif bernama hole.",
                    en: "The vacant electron state in the valence band behaves collectively as an effective positive carrier called a hole.",
                },
            },
            {
                id: "q7_4",
                prompt: { id: "Mengapa material semikonduktor 'Wide-Bandgap' seperti GaN dan SiC sangat diminati pada mobil listrik?", en: "Why are wide-bandgap semiconductors (GaN, SiC) favored in electric vehicles?" },
                options: [
                    { id: "Mampu beroperasi pada tegangan, suhu, dan frekuensi switching jauh lebih tinggi dengan disipasi panas minimal", en: "Withstand higher voltages, temperatures, and switching frequencies with minimal heat" },
                    { id: "Harga bahan bakunya lebih murah daripada pasir biasa", en: "Raw material cost is cheaper than beach sand" },
                    { id: "Dapat larut dalam air", en: "Dissolves in water" },
                    { id: "Tidak memerlukan pendingin sama sekali di luar angkasa", en: "Needs zero cooling in space" },
                ],
                answer: 0,
                explanation: {
                    id: "Celah pita lebar (>3 eV) mencegah terjadinya breakdown dielektrik dan kebocoran arus termal pada tegangan ribuan volt.",
                    en: "A >3 eV bandgap resists electric field breakdown and thermal avalanche up to hundreds of degrees Celsius.",
                },
            },
            {
                id: "q7_5",
                prompt: { id: "Prinsip mekanika kuantum fundamental apa yang memaksa tingkat energi elektron atomik terpisah menjadi pita energi pada zat padat?", en: "Which quantum principle forces discrete atomic levels to split into continuous bands?" },
                options: [
                    { id: "Prinsip Larangan Pauli (Pauli Exclusion Principle)", en: "Pauli Exclusion Principle" },
                    { id: "Hukum Archimedes", en: "Archimedes' Principle" },
                    { id: "Hukum Gas Ideal", en: "Ideal Gas Law" },
                    { id: "Efek Doppler Relativistik", en: "Relativistic Doppler Effect" },
                ],
                answer: 0,
                explanation: {
                    id: "Prinsip Pauli melarang dua fermion (elektron) menempati keadaan kuantum yang sama persis, sehingga tingkat energi terbagi-bagi menjadi pita.",
                    en: "Pauli's principle prevents identical fermions from occupying identical quantum states, splitting degenerate levels into dense bands.",
                },
            },
        ],
        journalEntry: {
            id: "band-theory",
            chapterId: 7,
            title: { id: "Struktur Pita Energi & Celah Pita (Bandgap)", en: "Energy Band Structure & Bandgap" },
            note: {
                id: "Pita energi valensi dan konduksi dipisahkan oleh celah pita terlarang Eg. Nilai Eg membedakan isolator, semikonduktor, dan konduktor.",
                en: "Valence and conduction bands are separated by forbidden gap Eg, defining the physical boundary between insulators, semiconductors, and metals.",
            },
            formula: "E_g = E_C - E_V",
            discoveredAt: "2026-01-16T15:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-08: Doping & Charge Carriers (N-Type & P-Type)
    // -------------------------------------------------------------
    {
        id: 8,
        code: "CH-08",
        era: "semiconductors",
        title: {
            id: "Semikonduktor Ekstrinsik: Doping Tipe-N & Tipe-P",
            en: "Extrinsic Semiconductors: N-Type & P-Type Doping",
        },
        narrative: {
            id: "Silikon murni memiliki resistansi terlalu tinggi untuk komputasi. Insinyur bahan menyuntikkan atom pengotor (doping) seperti Fosfor atau Boron dengan rasio satu per sejuta atom untuk mengendalikan konduktivitas listrik secara presisi jutaan kali lipat.",
            en: "Intrinsic silicon conducts too feebly to build microprocessors. Materials scientists implant dopant impurity atoms like Phosphorus or Boron at parts-per-million ratios, multiplying electrical conductivity by millions.",
        },
        coreConcept: {
            id: "Donor Golongan V (Fosfor/Arsen) menghasilkan elektron bebas (tipe-N). Akseptor Golongan III (Boron) menghasilkan hole positif (tipe-P). Hukum Aksi Massa n · p = n_i² selalu terpenuhi.",
            en: "Group V donors (P/As) yield excess conduction electrons (N-type). Group III acceptors (Boron) create excess mobile holes (P-type). The Mass Action Law n · p = n_i² holds in thermal equilibrium.",
        },
        formula: "n \\cdot p = n_i^2, \\quad \\sigma = q(n\\mu_n + p\\mu_p)",
        simulation: {
            type: "doping",
            hasSignFlip: true,
            signLabel: { id: "Jenis Doping Mayoritas (+ Tipe-N Elektron / − Tipe-P Hole)", en: "Majority Dopant Type (+ N-Type Electron / − P-Type Hole)" },
            defaultSign: 1,
            params: [
                { id: "doping_density", label: { id: "Konsentrasi Doping (log10 cm⁻³)", en: "Doping Density (log10 cm⁻³)" }, min: 14, max: 20, step: 0.5, defaultValue: 17, unit: "cm⁻³" },
                { id: "temperature", label: { id: "Suhu Kisi (K)", en: "Lattice Temperature (K)" }, min: 200, max: 500, step: 25, defaultValue: 300, unit: "K" },
            ],
            formulaTemplate: "n \\approx N_D \\quad \\text{atau} \\quad p \\approx N_A",
            formulaBuilder: (p, sign) => `${sign >= 0 ? "N\\text{-type (Donor P)}: n \\approx 10^{" + (p.doping_density || 17) + "}" : "P\\text{-type (Akseptor B)}: p \\approx 10^{" + (p.doping_density || 17) + "}"} \\text{ cm}^{-3}`,
            signExplanation: {
                id: "Beralih tanda dari + ke − mengubah doping mayoritas dari tipe-N (elektron bermuatan negatif bergerak cepat) menjadi tipe-P (hole bermuatan positif dengan mobilitas lebih rendah), menggeser posisi Tingkat Fermi E_F relatif terhadap celah pita.",
                en: "Toggling sign from + to − swaps majority carriers from N-type (agile negative electrons) to P-type (positive holes with lower mobility), shifting the Fermi level E_F across the bandgap.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Hanya Mengganti 1 dari 1 Juta Atom Silikon Bisa Mengubah Konduktivitas Drastis?", en: "Why Does 1 Dopant Atom in a Million Explode Silicon's Conductivity?" },
            simple: {
                id: "Pada silikon murni suhu ruang, hanya ada 1 elektron bebas di antara 100 miliar atom! Menambahkan 1 atom fosfor per sejuta atom melipatgandakan jumlah pembawa muatan hingga 100.000 kali lipat seketika.",
                en: "In intrinsic silicon at room temperature, barely 1 in 100 billion atoms frees an electron. Injecting 1 phosphorus per million atoms increases free charge carriers by 100,000× instantly.",
            },
            deep: {
                id: "Energi ionisasi elektron ke-5 pada atom Fosfor di kisi silikon hanya ~0.045 eV (sangat kecil dibanding celah pita 1.12 eV). Akibatnya, pada suhu kamar (k_BT ≈ 0.026 eV), hampir 100% atom donor terionisasi penuh.",
                en: "The ionization energy of Phosphorus's 5th valence electron in silicon is barely ~0.045 eV. At room temperature (k_BT ≈ 0.026 eV), thermal energy ionizes ~100% of all donor impurities.",
            },
            chip: {
                id: "Mesin Ion Implanter menggunakan medan magnetik dan akselerator tegangan 100.000 Volt untuk menembakkan ion boron dan fosfor secara presisi ke kedalaman nanometer pada wafer TSMC.",
                en: "High-current Ion Implantation tools use 100 kV accelerator beams and magnetic mass filters to inject boron/phosphorus dopants at precise nanometer depth profiles in wafer foundries.",
            },
        },
        sideQuest: {
            id: "sq-08",
            title: { id: "Mesin Ion Implanter Berkas Akselerator Fabrikasi", en: "Foundry Ion Implantation Beamline" },
            tag: { id: "Fabrikasi Semikonduktor", en: "Fab Processing" },
            description: {
                id: "Mesin implanter ion Varian berbobot 30 ton menyaring ion fosfor murni menggunakan spektrometer massa magnetik sebelum menembak wafer 300 mm.",
                en: "30-ton ion implantation tools magnetically filter isotope-pure dopant beams to implant source/drain extensions in modern transistors.",
            },
            realWorldTech: { id: "Applied Materials Varian VIISta Ion Implanter", en: "Applied Materials Varian VIISta Ion Implanter" },
        },
        quiz: [
            {
                id: "q8_1",
                prompt: { id: "Atom unsur golongan berapakah dalam tabel periodik yang digunakan sebagai donor untuk membuat silikon tipe-N?", en: "Which periodic table group acts as donor impurities to create N-type silicon?" },
                options: [
                    { id: "Golongan V (seperti Fosfor dan Arsen)", en: "Group V (such as Phosphorus and Arsenic)" },
                    { id: "Golongan III (seperti Boron dan Galium)", en: "Group III (such as Boron and Gallium)" },
                    { id: "Golongan VIII (Gas Mulia)", en: "Group VIII (Noble Gases)" },
                    { id: "Golongan I (Logam Alkali)", en: "Group I (Alkali Metals)" },
                ],
                answer: 0,
                explanation: {
                    id: "Atom Golongan V memiliki 5 elektron valensi. Empat berikatan kovalen dengan silikon, satu elektron bebas menjadi pembawa muatan negatif (tipe-N).",
                    en: "Group V atoms possess 5 valence electrons. Four bond with neighboring silicon atoms; the 5th electron is donated to the conduction band.",
                },
            },
            {
                id: "q8_2",
                prompt: { id: "Menurut Hukum Aksi Massa (Law of Mass Action) dalam semikonduktor pada kesetimbangan termal, nilai n · p selalu sama dengan...", en: "According to the Law of Mass Action in thermal equilibrium, n · p equals..." },
                formula: "n \\cdot p = ?",
                options: [
                    { id: "n_i² (kuadrat konsentrasi intrinsik)", en: "n_i² (square of intrinsic carrier concentration)" },
                    { id: "Nol (0)", en: "Zero (0)" },
                    { id: "N_D + N_A", en: "N_D + N_A" },
                    { id: "Konstanta Planck h", en: "Planck's constant h" },
                ],
                answer: 0,
                explanation: {
                    id: "n · p = n_i². Jika kita memperbanyak elektron (n tinggi), laju rekombinasi naik sehingga konsentrasi hole (p) turun sebanding.",
                    en: "n · p = n_i². Increasing electron density n proportionally suppresses hole density p via elevated recombination rates.",
                },
            },
            {
                id: "q8_3",
                prompt: { id: "Mengapa mobilitas elektron (μ_n) dalam silikon umumnya lebih tinggi daripada mobilitas hole (μ_p)?", en: "Why is electron mobility (μ_n) in silicon higher than hole mobility (μ_p)?" },
                options: [
                    { id: "Massa efektif elektron di pita konduksi lebih ringan daripada massa efektif hole di pita valensi", en: "Electron effective mass in conduction band is lighter than hole effective mass" },
                    { id: "Elektron memiliki muatan lebih besar dari hole", en: "Electrons carry larger charge than holes" },
                    { id: "Hole tidak dapat bergerak sama sekali", en: "Holes are permanently stationary" },
                    { id: "Elektron terbuat dari foton cahaya", en: "Electrons are made of light photons" },
                ],
                answer: 0,
                explanation: {
                    id: "Kelengkungan pita konduksi silikon menghasilkan massa efektif m*_e ≈ 0.26 m₀, sedangkan hole memiliki m*_h ≈ 0.38 m₀, sehingga elektron bergerak lebih gesit.",
                    en: "Conduction band curvature confers a lighter effective mass (m*_e ≈ 0.26 m₀) than valence holes (m*_h ≈ 0.38 m₀), allowing faster drift velocity.",
                },
            },
            {
                id: "q8_4",
                prompt: { id: "Di mana posisi Tingkat Fermi (Fermi Level, E_F) pada semikonduktor tipe-N berkonsentrasi tinggi?", en: "Where does the Fermi Level E_F reside in heavily doped N-type silicon?" },
                options: [
                    { id: "Mendekati tepi Pita Konduksi (E_C)", en: "Shifted close to the Conduction Band edge (E_C)" },
                    { id: "Mendekati tepi Pita Valensi (E_V)", en: "Shifted close to the Valence Band edge (E_V)" },
                    { id: "Tepat di tengah-tengah celah pita terlarang", en: "Precisely in the center of the bandgap" },
                    { id: "Di luar kristal semikonduktor", en: "Outside the semiconductor crystal" },
                ],
                answer: 0,
                explanation: {
                    id: "Doping donor menaikkan probabilitas terisinya pita konduksi, menggeser tingkat Fermi E_F mendekati E_C.",
                    en: "Donor doping raises conduction state occupancy probability, pulling the chemical potential (Fermi level E_F) upward toward E_C.",
                },
            },
            {
                id: "q8_5",
                prompt: { id: "Jika silikon didoping dengan 10¹⁶ cm⁻³ atom Boron, jenis semikonduktor apa yang terbentuk dan apa pembawa muatan mayoritasnya?", en: "If silicon is doped with 10¹⁶ cm⁻³ Boron, what semiconductor type forms and what is the majority carrier?" },
                options: [
                    { id: "Tipe-P dengan pembawa muatan mayoritas Hole", en: "P-type with Hole majority carriers" },
                    { id: "Tipe-N dengan pembawa muatan mayoritas Elektron", en: "N-type with Electron majority carriers" },
                    { id: "Isolator murni tanpa muatan", en: "Pure insulator with zero carriers" },
                    { id: "Superkonduktor suhu tinggi", en: "High-temperature superconductor" },
                ],
                answer: 0,
                explanation: {
                    id: "Boron adalah akseptor Golongan III yang menghasilkan kelebihan hole positif (semikonduktor tipe-P).",
                    en: "Boron is a Group III acceptor that captures valence electrons, creating majority positive holes (P-type).",
                },
            },
        ],
        journalEntry: {
            id: "semiconductor-doping",
            chapterId: 8,
            title: { id: "Doping Tipe-N & Tipe-P", en: "N-Type & P-Type Doping" },
            note: {
                id: "Menyuntikkan atom Golongan V menghasilkan elektron bebas (N-type), sedangkan Golongan III menghasilkan hole (P-type). Keduanya patuh pada hukum n·p = n_i².",
                en: "Doping Group V yields free electrons (N-type); Group III yields mobile holes (P-type). Thermal equilibrium satisfies n·p = n_i².",
            },
            formula: "n \\cdot p = n_i^2",
            discoveredAt: "2026-01-17T16:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-09: P-N Junction & Diodes
    // -------------------------------------------------------------
    {
        id: 9,
        code: "CH-09",
        era: "semiconductors",
        title: {
            id: "Sambungan P-N & Dioda Rekayasa",
            en: "P-N Junction & Semiconductor Diodes",
        },
        narrative: {
            id: "Ketika wilayah tipe-P dan tipe-N disatukan dalam satu kristal silikon monolitik, keajaiban rekayasa terjadi di perbatasan. Elektron dan hole berdifusi saling menyeberang dan berekombinasi, meninggalkan ion-ion telanjang yang menciptakan 'Daerah Deplesi' dengan medan listrik bawaan (Built-in Potential V_bi).",
            en: "When P-type and N-type regions unite within a monolithic silicon crystal, quantum magic happens at the boundary. Electrons and holes diffuse and recombine, exposing uncompensated dopant ions that establish a 'Depletion Region' with built-in potential V_bi.",
        },
        coreConcept: {
            id: "Sambungan P-N adalah katup satu arah (rectifier). Bias maju (+V) meruntuhkan rintangan potensial mengalirkan arus eksponensial. Bias mundur (−V) memperlebar deplesi dan memblokir arus.",
            en: "A P-N junction is a one-way electronic valve. Forward bias (+V) flattens the potential barrier for exponential current. Reverse bias (−V) widens depletion, blocking current.",
        },
        formula: "I = I_s \\left(e^{\\frac{q V}{k_B T}} - 1\\right)",
        simulation: {
            type: "pn_junction",
            hasSignFlip: true,
            signLabel: { id: "Polaritas Bias Tegangan (+ Maju / − Mundur)", en: "Bias Voltage Polarity (+ Forward / − Reverse)" },
            defaultSign: 1,
            params: [
                { id: "applied_bias", label: { id: "Tegangan Bias Luar V (Volt)", en: "Applied Bias Voltage V (V)" }, min: 0.1, max: 1.2, step: 0.05, defaultValue: 0.7, unit: "V" },
                { id: "temperature", label: { id: "Suhu Sambungan (K)", en: "Junction Temperature (K)" }, min: 250, max: 400, step: 25, defaultValue: 300, unit: "K" },
            ],
            formulaTemplate: "I = I_s \\left[\\exp\\left(\\frac{q V}{k_B T}\\right) - 1\\right]",
            formulaBuilder: (p, sign) => {
                const v = (p.applied_bias || 0.7) * (sign >= 0 ? 1 : -1);
                const current = sign >= 0 ? (Math.exp(v / 0.026) * 1e-9).toFixed(2) : "≈ -I_s (pA)";
                return `V_{bias} = ${v >= 0 ? "+" : ""}${v.toFixed(2)} \\text{ V} \\implies I = ${current} \\text{ mA}`;
            },
            signExplanation: {
                id: "MEMBALIK TANDA (+ ke −): Memberikan tegangan bias mundur (−V) menarik pembawa muatan menjauhi sambungan, memperlebar daerah deplesi isolator dan menghentikan arus difusi hingga hanya menyisakan arus bocor saturasi sangat kecil (picoampere).",
                en: "SIGN-FLIP EXPLANATION (+ to −): Applying reverse bias (−V) pulls mobile carriers away from the metallurgical interface, expanding the insulating depletion layer and completely extinguishing forward diffusion current.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Dioda Hanya Mengalirkan Listrik ke Satu Arah?", en: "Why Does a Diode Pass Current in Only One Direction?" },
            simple: {
                id: "Bayangkan pintu gerbang berengsel satu arah dengan pegas penahan. Mendorong dari arah maju (+0.7V) membuka pintu selebar-lebarnya. Mendorong dari arah sebaliknya (−V) justru mengunci pintu semakin rapat!",
                en: "Picture a one-way spring-loaded turnstile. Pushing forward (+0.7V) overcomes the spring and lets a crowd march through. Pushing backwards (−V) slams the latch tighter shut!",
            },
            deep: {
                id: "Medan listrik internal di daerah deplesi menghalangi difusi mayoritas. Bias maju menurunkan bukit potensial q(V_bi - V), memungkinkan elektron berdifusi secara eksponensial. Bias mundur menaikkan bukit q(V_bi + |V|), mematikan difusi.",
                en: "The built-in space-charge field opposes majority diffusion. Forward bias reduces the energetic hill q(V_bi - V), unlocking exponential diffusion. Reverse bias elevates the barrier to q(V_bi + |V|), choking conduction.",
            },
            chip: {
                id: "Sambungan P-N adalah elemen proteksi ESD (Electrostatic Discharge) di setiap pin input-output prosesor untuk membuang sengatan listrik statis 2000V ke ground sebelum merusak sirkuit internal.",
                en: "P-N junctions form Electrostatic Discharge (ESD) clamp diodes on every I/O pad of a microchip, shunting 2000V human body static strikes safely to ground rails.",
            },
        },
        sideQuest: {
            id: "sq-09",
            title: { id: "Sirkuit Proteksi ESD Sambungan P-N Port USB-C", en: "USB-C Port ESD Protection Clamp Diodes" },
            tag: { id: "Proteksi Sirkuit", en: "Circuit Protection" },
            description: {
                id: "Saat mencolokkan kabel USB-C ke laptop, percikan muatan statis ribuan volt dijinakkan oleh array dioda TVS sambungan P-N dalam waktu kurang dari 1 nanodetik.",
                en: "Connecting USB-C cables risks kilovolt static discharge. Sub-nanosecond P-N junction transient voltage suppressors clamp voltage spikes instantly.",
            },
            realWorldTech: { id: "Nexperia Low-Capacitance TVS Diode Array", en: "Nexperia Low-Capacitance TVS Diode Array" },
        },
        quiz: [
            {
                id: "q9_1",
                prompt: { id: "Berapa tegangan ambang (built-in voltage) tipikal untuk membuat dioda silikon mulai menghantarkan arus maju secara signifikan?", en: "What is the typical forward threshold voltage to turn on a standard silicon P-N diode?" },
                options: [
                    { id: "Sekitar 0.6 – 0.7 Volt", en: "Around 0.6 – 0.7 Volts" },
                    { id: "Tepat 5.0 Volt", en: "Exactly 5.0 Volts" },
                    { id: "0.01 Volt", en: "0.01 Volts" },
                    { id: "100 Volt", en: "100 Volts" },
                ],
                answer: 0,
                explanation: {
                    id: "Pada silikon, built-in potential V_bi berkisar 0.6 hingga 0.8 V. Begitu tegangan bias luar mendekati 0.7 V, rintangan deplesi runtuh dan arus mengalir deras.",
                    en: "Silicon built-in barrier V_bi is ~0.7V. Once forward bias offsets this barrier, diffusion current surges exponentially.",
                },
            },
            {
                id: "q9_2",
                prompt: { id: "Apa yang terjadi pada lebar daerah deplesi (depletion region) saat dioda diberikan tegangan bias mundur (reverse bias)?", en: "What happens to the depletion region width when reverse bias is applied?" },
                options: [
                    { id: "Daerah deplesi semakin melebar", en: "The depletion region widens" },
                    { id: "Daerah deplesi menyusut dan lenyap", en: "The depletion region shrinks and vanishes" },
                    { id: "Lebar daerah deplesi tidak berubah sama sekali", en: "Depletion width remains strictly constant" },
                    { id: "Material silikon meleleh", en: "The silicon material melts" },
                ],
                answer: 0,
                explanation: {
                    id: "Bias mundur menarik elektron dan hole menjauhi perbatasan, mengekspos lebih banyak ion tak terkompensasi dan memperlebar zona deplesi W ∝ √(V_bi + V_R).",
                    en: "Reverse polarity pulls majority carriers away from the junction, uncovering more immobile ions and expanding depletion width W ∝ √(V_bi + V_R).",
                },
            },
            {
                id: "q9_3",
                prompt: { id: "Persamaan arus dioda ideal I = I_s [exp(qV / kT) - 1] dirumuskan oleh fisikawan legendaris...", en: "The ideal diode equation I = I_s [exp(qV / kT) - 1] was formulated by..." },
                options: [
                    { id: "William Shockley", en: "William Shockley" },
                    { id: "James Clerk Maxwell", en: "James Clerk Maxwell" },
                    { id: "Isaac Newton", en: "Isaac Newton" },
                    { id: "Nikola Tesla", en: "Nikola Tesla" },
                ],
                answer: 0,
                explanation: {
                    id: "William Shockley merumuskan persamaan dioda sambungan P-N tahun 1949 di Bell Labs sebelum memenangkan Hadiah Nobel Fisika.",
                    en: "William Shockley published the foundational P-N junction diode theory in 1949 at Bell Laboratories.",
                },
            },
            {
                id: "q9_4",
                prompt: { id: "Jika dioda sambungan P-N dibuat dari bahan semikonduktor dengan celah pita langsung (seperti GaAs atau GaN), emisi rekombinasi elektron-hole menghasilkan...", en: "In direct-bandgap semiconductor P-N junctions (GaAs, GaN), carrier recombination radiates..." },
                options: [
                    { id: "Cahaya foton (Light Emitting Diode / LED)", en: "Light photons (Light Emitting Diode / LED)" },
                    { id: "Gelombang gravitasi", en: "Gravitational waves" },
                    { id: "Getaran suara ultrasonik", en: "Ultrasonic sound waves" },
                    { id: "Partikel atomik netron", en: "Atomic neutron particles" },
                ],
                answer: 0,
                explanation: {
                    id: "Pada celah pita langsung, elektron dan hole berekombinasi tanpa bantuan fonon kisi, memancarkan seluruh energi celah pita Eg sebagai foton cahaya LED.",
                    en: "Direct bandgaps allow momentum-conserving radiative recombination, transforming electrical current directly into LED photons.",
                },
            },
            {
                id: "q9_5",
                prompt: { id: "Fenomena apa yang terjadi jika tegangan bias mundur dinaikkan melebihi batas kritis dioda Zener?", en: "What occurs when reverse bias exceeds a critical threshold in a Zener diode?" },
                options: [
                    { id: "Terjadi breakdown terkendali akibat penerowongan kuantum elektron menembus celah pita", en: "Controlled breakdown occurs via quantum tunneling across the narrow bandgap" },
                    { id: "Arus listrik berhenti total selamanya", en: "Current stops permanently forever" },
                    { id: "Dioda berubah menjadi baterai kimia", en: "The diode turns into a chemical battery" },
                    { id: "Cahaya laser keluar dari kabel penghubung", en: "Laser light shoots out from wire leads" },
                ],
                answer: 0,
                explanation: {
                    id: "Pada dioda Zener terdoping pekat, medan listrik tinggi memungkinkan penerowongan kuantum langsung dari pita valensi ke konduksi (Zener Breakdown).",
                    en: "In heavily doped Zener diodes, intense fields bend bands sufficiently for direct quantum band-to-band tunneling at precise voltages.",
                },
            },
        ],
        journalEntry: {
            id: "pn-junction",
            chapterId: 9,
            title: { id: "Sambungan P-N & Dioda Penyearah", en: "P-N Junction & Diode Rectification" },
            note: {
                id: "Sambungan P-N membentuk daerah deplesi dengan potensial built-in. Bias maju melipatgandakan arus difusi eksponensial I = Is(e^{qV/kT}-1).",
                en: "P-N metallurgical junctions form built-in space charge zones. Forward bias unlocks exponential diffusion current I = Is(e^{qV/kT}-1).",
            },
            formula: "I = I_s \\left(e^{qV/k_B T} - 1\\right)",
            discoveredAt: "2026-01-18T17:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-10: MOSFET & Transistor Operation (SPECIAL CHIP SANDBOX)
    // -------------------------------------------------------------
    {
        id: 10,
        code: "CH-10",
        era: "chip_design",
        title: {
            id: "Transistor MOSFET: Katup Elektronik Digital",
            en: "The MOSFET Transistor: Modern Digital Valve",
        },
        narrative: {
            id: "Inilah penemuan teragung abad ke-20: Transistor Efek Medan Logam-Oksida-Semikonduktor (MOSFET). Dengan mengendalikan tegangan pada elektroda gerbang (Gate), medan listrik memicu 'inversi kuantum' di bawah isolator tipis, menghubungkan Source dan Drain menjadi sakelar 1 dan 0.",
            en: "The greatest invention of the modern era: The Metal-Oxide-Semiconductor Field-Effect Transistor (MOSFET). Voltage applied to an insulated Gate induces quantum surface inversion, switching the Source-to-Drain channel ON and OFF trillions of times per second.",
        },
        coreConcept: {
            id: "Tegangan gerbang V_GS harus melampaui Tegangan Ambang (Threshold Voltage V_th) untuk membalikkan tipe semikonduktor permukaan dari P ke N, membuka kanal arus I_D.",
            en: "Gate voltage V_GS must exceed Threshold Voltage V_th to invert the surface from P-type to an N-channel sheet of electrons, opening drain current I_D.",
        },
        formula: "I_D = \\frac{1}{2} \\mu_n C_{ox} \\frac{W}{L} (V_{GS} - V_{th})^2",
        simulation: {
            type: "mosfet",
            hasSignFlip: true,
            signLabel: { id: "Polaritas Gerbang (+ Sakelar ON Inversi / − Sakelar OFF)", en: "Gate Voltage Polarity (+ Turn-ON Inversion / − Turn-OFF Cutoff)" },
            defaultSign: 1,
            params: [
                { id: "oxide_thickness", label: { id: "Tebal Oksida Gerbang t_ox (nm)", en: "Gate Oxide Thickness t_ox (nm)" }, min: 0.8, max: 4.0, step: 0.2, defaultValue: 1.4, unit: "nm" },
                { id: "gate_voltage", label: { id: "Tegangan Gerbang V_GS (Volt)", en: "Gate Voltage V_GS (V)" }, min: 0.0, max: 1.8, step: 0.05, defaultValue: 0.9, unit: "V" },
                { id: "substrate_doping", label: { id: "Doping Kanal N_A (log10 cm⁻³)", en: "Substrate Doping N_A (log10)" }, min: 16, max: 19, step: 0.5, defaultValue: 17.5, unit: "cm⁻³" },
            ],
            formulaTemplate: "I_D = \\frac{1}{2} \\mu_n \\frac{\\varepsilon_{ox}}{t_{ox}} \\frac{W}{L} (V_{GS} - V_{th})^2",
            formulaBuilder: (p, sign) => {
                const tox = p.oxide_thickness || 1.4;
                const vgs = (p.gate_voltage || 0.9) * (sign >= 0 ? 1 : -1);
                const vth = 0.35 + (tox - 1.0) * 0.08;
                const on = vgs > vth;
                const id = on ? (0.5 * (3.9 * 8.85e-14 / (tox * 1e-7)) * 2 * Math.pow(vgs - vth, 2) * 1e3).toFixed(1) : "0.0001 (Leakage)";
                return `V_{th} = ${vth.toFixed(2)} \\text{ V} \\implies I_D = ${id} \\text{ mA} \\quad [${on ? "STATUS: ON (Kanal Terbuka)" : "STATUS: OFF (Kanal Terputus)"}]`;
            },
            signExplanation: {
                id: "MEMBALIK TANDA (+ ke −): Memberikan tegangan gerbang negatif (V_GS < 0) menolak elektron dan menarik hole ke permukaan (keadaan Akumulasi). Lapisan inversi hancur total, mematikan arus kanal konduksi secara seketika dan mengunci sakelar dalam status OFF.",
                en: "SIGN-FLIP EXPLANATION (+ to −): Reversing gate voltage to negative (V_GS < 0) repels electrons and attracts majority holes to the interface (Accumulation mode). The conducting inversion channel vanishes, locking the digital switch strictly into the OFF state.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Transistor Menghasilkan Panas Saat Menjalankan Game / AI?", en: "Why Do Computer Chips Generate Heat During Heavy Gaming & AI?" },
            simple: {
                id: "Tiap kali transistor berganti status antara 1 dan 0, kapasitor gerbang diisi dan dikosongkan. Miliaran transistor berpindah status 4 miliar kali per detik (4 GHz), mengubah energi listrik pengisian kapasitor menjadi panas disipasi!",
                en: "Every time a transistor flips between 1 and 0, gate capacitance charges and discharges. Billions of switches flipping 4 billion times a second (4 GHz) dump capacitive charging energy as thermal heat!",
            },
            deep: {
                id: "Daya total chip adalah P_total = α C_L V_DD² f + I_leak V_DD. Selain disipasi dinamis saat switching frekuensi f, ketebalan gerbang t_ox yang sangat tipis memicu kebocoran statis penerowongan kuantum bahkan saat komputer sedang tidur (idle)!",
                en: "Total chip power follows P = α C_L V_DD² f + I_leak V_DD. Beyond dynamic switching losses at frequency f, sub-nanometer gate oxides leak static quantum tunneling currents continuously even during idle sleep!",
            },
            chip: {
                id: "Untuk mengendalikan arus bocor pada transistor sub-5 nm, industri beralih dari transistor datar (Planar) ke arsitektur 3D FinFET dan Gate-All-Around (GAA) Nanosheet di mana gerbang membungkus kanal dari 4 sisi.",
                en: "To suppress short-channel leakage below 5 nm, foundries transitioned from planar FETs to 3D FinFETs and Gate-All-Around (GAA) Nanosheets wrapping the channel on all 4 sides.",
            },
        },
        sideQuest: {
            id: "sq-10",
            title: { id: "Sandbox Desain Transistor Gate-All-Around (GAA) 3 nm", en: "3 nm Gate-All-Around (GAA) Transistor Sandbox" },
            tag: { id: "Arsitektur Nanosheet", en: "Nanosheet Architecture" },
            description: {
                id: "Kanal silikon nanosheet setebal 5 nm dikepung oleh gerbang logam dari keempat sisi untuk menjinakkan efek kanal pendek (DIBL) pada chip smartphone flagship.",
                en: "Stacked 5 nm silicon nanosheets surrounded on all four sides by metal gates tame Drain-Induced Barrier Lowering (DIBL).",
            },
            realWorldTech: { id: "Samsung 3GAE Nanosheet Transistor Stack", en: "Samsung 3GAE Nanosheet Transistor Stack" },
        },
        quiz: [
            {
                id: "q10_1",
                prompt: { id: "Tegangan minimum pada elektroda gerbang (Gate) yang dibutuhkan untuk membuka kanal konduksi MOSFET disebut...", en: "The minimum gate voltage required to induce a conductive channel in a MOSFET is called..." },
                options: [
                    { id: "Tegangan Ambang (Threshold Voltage, V_th)", en: "Threshold Voltage (V_th)" },
                    { id: "Tegangan Keruntuhan Zener", en: "Zener Breakdown Voltage" },
                    { id: "Tegangan Termal Einstein", en: "Einstein Thermal Voltage" },
                    { id: "Tegangan Baterai Statis", en: "Static Battery Voltage" },
                ],
                answer: 0,
                explanation: {
                    id: "Ketika V_GS melampaui V_th, pita energi melengkung cukup dalam sehingga konsentrasi elektron di permukaan melebihi konsentrasi akseptor (Strong Inversion).",
                    en: "When V_GS exceeds V_th, surface band bending induces strong inversion, creating a mobile electron channel.",
                },
            },
            {
                id: "q10_2",
                prompt: { id: "Apa fungsi utama lapisan tipis oksida gerbang (Gate Oxide) di bawah elektroda Gate pada MOSFET?", en: "What is the primary role of the thin Gate Oxide dielectric beneath the gate electrode?" },
                options: [
                    { id: "Mengisolasi secara elektrik agar tidak ada arus DC yang bocor dari Gate ke kanal semikonduktor", en: "Providing electrical isolation so zero DC current leaks from gate into the channel" },
                    { id: "Menghantarkan listrik sebesar-besarnya dari Gate ke Drain", en: "Conducting maximum electrical current from Gate to Drain" },
                    { id: "Mendinginkan suhu transistor agar tidak panas", en: "Cooling the transistor to prevent overheating" },
                    { id: "Mengubah silikon menjadi logam tembaga", en: "Converting silicon into metallic copper" },
                ],
                answer: 0,
                explanation: {
                    id: "Gerbang MOSFET bekerja murni melalui efek medan elektrostatik kapasitor; isolator gerbang bertugas memblokir aliran arus DC langsung.",
                    en: "The gate operates strictly as an electrostatic field plate; the dielectric prevents parasitic DC gate current flow.",
                },
            },
            {
                id: "q10_3",
                prompt: { id: "Berapa jumlah transistor yang terdapat di dalam prosesor laptop atau smartphone modern (seperti Apple M-series atau Snapdragon)?", en: "Approximately how many transistors are integrated inside modern laptop/phone processors?" },
                options: [
                    { id: "Puluhan Miliar (10 – 100+ Miliar transistor)", en: "Tens of Billions (10 to 100+ Billion transistors)" },
                    { id: "Sekitar 100 ribu transistor", en: "About 100 thousand transistors" },
                    { id: "Hanya 500 buah transistor", en: "Only 500 transistors" },
                    { id: "Tepat satu juta transistor", en: "Exactly one million transistors" },
                ],
                answer: 0,
                explanation: {
                    id: "Prosesor modern 3 nm seperti Apple M4 mengintegrasikan lebih dari 28 miliar transistor dalam keping silikon seluas kuku jari.",
                    en: "Modern 3 nm chips like Apple M4 pack over 28 billion transistors on a silicon die smaller than a fingernail.",
                },
            },
            {
                id: "q10_4",
                prompt: { id: "Mengapa transistor modern beralih dari struktur 2D Planar ke struktur 3D FinFET?", en: "Why did modern transistors transition from 2D Planar to 3D FinFETs?" },
                options: [
                    { id: "Gerbang 3D menjepit kanal dari 3 sisi sehingga kontrol elektrostatik jauh lebih kuat mencegah arus bocor", en: "3D gates wrap the channel on 3 sides for superior electrostatic control against leakage" },
                    { id: "Struktur 3D lebih mudah dicat warna-warni", en: "3D structures are easier to colorize" },
                    { id: "Mengurangi biaya silikon hingga 90%", en: "Reduces silicon raw cost by 90%" },
                    { id: "Menghilangkan kebutuhan akan tegangan listrik", en: "Eliminates the requirement for power supplies" },
                ],
                answer: 0,
                explanation: {
                    id: "FinFET melipat kanal menjadi sirip 3D tipis vertikal yang dijepit gerbang dari atas, kiri, dan kanan untuk menekan efek kanal pendek.",
                    en: "FinFETs raise the channel into a thin vertical fin wrapped on three sides, suppressing short-channel drain leakage.",
                },
            },
            {
                id: "q10_5",
                prompt: { id: "Jika panjang kanal transistor (L) diperpendek, apa dampaknya terhadap kecepatan switching dan hambatan kanal?", en: "If transistor channel length L is scaled down, what happens to switching speed and on-resistance?" },
                formula: "R_{on} \\propto \\frac{L}{W}, \\quad \\tau \\propto \\frac{C L}{I_{on}}",
                options: [
                    { id: "Kecepatan switching meningkat lebih cepat dan hambatan kanal R_on menurun", en: "Switching speed increases and channel on-resistance R_on decreases" },
                    { id: "Kecepatan switching melambat drastis", en: "Switching speed slows down drastically" },
                    { id: "Transistor tidak dapat dialiri listrik lagi", en: "The transistor ceases conducting forever" },
                    { id: "Tegangan ambang naik menjadi 100 Volt", en: "Threshold voltage jumps to 100 Volts" },
                ],
                answer: 0,
                explanation: {
                    id: "L yang lebih pendek memperpendek waktu transit elektron (τ ∝ L/v) dan menurunkan resistansi kanal, mempercepat kecepatan clock prosesor.",
                    en: "Shorter channel length reduces transit time and on-resistance, enabling higher clock frequencies (Moore's Law scaling).",
                },
            },
        ],
        journalEntry: {
            id: "mosfet-transistor",
            chapterId: 10,
            title: { id: "Transistor MOSFET & Inversi Gerbang", en: "MOSFET Transistor & Gate Inversion" },
            note: {
                id: "Tegangan gerbang V_GS memicu lapisan inversi kanal elektron. MOSFET adalah sakelar dasar komputasi digital dengan arus I_D = 1/2 μ C_ox (W/L)(V_GS - V_th)².",
                en: "Gate voltage V_GS induces surface channel inversion. MOSFETs form the atomic switch of digital computing governed by I_D = 1/2 μ C_ox (W/L)(V_GS - V_th)².",
            },
            formula: "I_D = \\frac{1}{2}\\mu C_{ox}\\frac{W}{L}(V_{GS}-V_{th})^2",
            discoveredAt: "2026-01-19T18:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-11: Photolithography & Wafer Nanofabrication
    // -------------------------------------------------------------
    {
        id: 11,
        code: "CH-11",
        era: "chip_design",
        title: {
            id: "Fotolitografi EUV & Fabrikasi Wafer",
            en: "EUV Photolithography & Wafer Nanofabrication",
        },
        narrative: {
            id: "Bagaimana cara mencetak kabel sirkuit selebar 10 nanometer pada wafer silikon berdiameter 300 mm? Mesin fotolitografi Extreme Ultraviolet (EUV) memproyeksikan cahaya 13.5 nm menggunakan cermin Bragg berlapis-lapis di ruang hampa udara.",
            en: "How do we print circuit interconnects barely 10 nanometers wide across a 300 mm silicon wafer? Extreme Ultraviolet (EUV) lithography scanners project 13.5 nm light via multilayer Bragg mirrors in ultra-high vacuum.",
        },
        coreConcept: {
            id: "Resolusi fitur terkecil CD (Critical Dimension) dibatasi oleh difraksi cahaya menurut Kriteria Rayleigh: CD = k₁ · (λ / NA). Menurunkan panjang gelombang λ memungkinkan pencetakan pola nanometer.",
            en: "Minimum printable Critical Dimension (CD) is fundamentally governed by wave diffraction via the Rayleigh Criterion: CD = k₁ · (λ / NA). Shorter wavelength λ yields finer nano-patterns.",
        },
        formula: "CD = k_1 \\frac{\\lambda}{NA}, \\quad DOF = k_2 \\frac{\\lambda}{NA^2}",
        simulation: {
            type: "lithography",
            hasSignFlip: true,
            signLabel: { id: "Tipe Fotoresist Kimia (+ Positif / − Negatif)", en: "Photoresist Chemistry (+ Positive / − Negative)" },
            defaultSign: 1,
            params: [
                { id: "wavelength", label: { id: "Panjang Gelombang Cahaya λ (nm)", en: "Light Wavelength λ (nm)" }, min: 13.5, max: 193, step: 1, defaultValue: 13.5, unit: "nm" },
                { id: "numerical_aperture", label: { id: "Numerical Aperture NA (Lensa)", en: "Numerical Aperture NA" }, min: 0.33, max: 0.55, step: 0.02, defaultValue: 0.33 },
                { id: "process_k1", label: { id: "Faktor Proses k₁", en: "Process Factor k₁" }, min: 0.25, max: 0.6, step: 0.05, defaultValue: 0.35 },
            ],
            formulaTemplate: "CD = k_1 \\frac{\\lambda}{NA}",
            formulaBuilder: (p, sign) => {
                const cd = ((p.process_k1 || 0.35) * (p.wavelength || 13.5) / (p.numerical_aperture || 0.33)).toFixed(1);
                return `CD = ${cd} \\text{ nm} \\quad [\\text{Resist: } ${sign >= 0 ? "+Positif (Terlarut)" : "-Negatif (Mengeras)"}]`;
            },
            signExplanation: {
                id: "MEMBALIK TANDA (+ ke −): Beralih dari fotoresist positif (+, area terpapar cahaya larut dalam larutan developer) ke fotoresist negatif (−, area terpapar cahaya mengalami ikatan silang polimer dan tetap bertahan), menghasilkan inversi pola topografi sirkuit.",
                en: "SIGN-FLIP EXPLANATION (+ to −): Toggling resist polarity from positive (+, UV-exposed regions dissolve) to negative (−, UV exposure cross-links polymers so exposed regions remain), inverting the transferred silicon circuit topography.",
            },
        },
        askWhy: {
            title: { id: "Mengapa Mesin Fotolitografi EUV Menggunakan Cermin, Bukan Lensa Kaca?", en: "Why Does EUV Lithography Use Mirrors Instead of Glass Lenses?" },
            simple: {
                id: "Cahaya Extreme Ultraviolet (EUV) memiliki panjang gelombang 13.5 nm yang sangat energik. Cahaya ini diserap oleh hampir semua zat padat termasuk kaca lensa biasa dan bahkan udara! Oleh karena itu, mesin harus bekerja dalam ruang hampa menggunakan cermin pemantul khusus.",
                en: "13.5 nm Extreme Ultraviolet light is so energetic that virtually all matter absorbs it — including glass lenses and regular air! The entire machine must operate in high vacuum using reflective mirrors.",
            },
            deep: {
                id: "Cermin EUV dibuat dari 40-50 pasangan lapisan selang-seling Molibdenum dan Silikon (Mo/Si) berketebalan 3.4 nm. Pantulan gelombang Bragg konstruktif menghasilkan reflektifitas sekitar 70% per cermin.",
                en: "EUV mirrors comprise 40-50 alternating nanoscale layers of Molybdenum and Silicon (Mo/Si). Constructive Bragg interface interference reflects ~70% of incident 13.5 nm EUV photons.",
            },
            chip: {
                id: "Mesin ASML Twinscan EXE:5000 High-NA EUV generasi terbaru seharga \$350 Juta adalah mesin tercanggih peradaban manusia untuk memproduksi chip 2 nm dan 1.4 nm.",
                en: "The \$350 Million ASML Twinscan High-NA EUV scanner represents the pinnacle of human engineering, patterning 2 nm and 1.4 nm generation chips.",
            },
        },
        sideQuest: {
            id: "sq-11",
            title: { id: "Scanner ASML High-NA EUV (0.55 NA)", en: "ASML High-NA EUV Scanner Architecture" },
            tag: { id: "Peralatan Litografi", en: "Lithography Hardware" },
            description: {
                id: "Laser karbon dioksida 25 kilowatt menembak 50.000 tetesan timah cair per detik untuk memicu plasma pemancar foton EUV 13.5 nm.",
                en: "A 25 kW CO2 laser blasts 50,000 molten tin droplets per second to generate extreme 13.5 nm EUV plasma radiation.",
            },
            realWorldTech: { id: "ASML Twinscan EXE:5200 Scanner", en: "ASML Twinscan EXE:5200 Scanner" },
        },
        quiz: [
            {
                id: "q11_1",
                prompt: { id: "Berapa panjang gelombang cahaya Extreme Ultraviolet (EUV) yang digunakan dalam mesin litografi tercanggih saat ini?", en: "What is the light wavelength utilized in current state-of-the-art EUV lithography scanners?" },
                options: [
                    { id: "13.5 nanometer", en: "13.5 nanometers" },
                    { id: "193 nanometer (ArF Laser)", en: "193 nanometers (ArF Laser)" },
                    { id: "650 nanometer (Laser Merah)", en: "650 nanometers (Red Laser)" },
                    { id: "0.01 nanometer (Sinar Gamma)", en: "0.01 nanometers (Gamma Rays)" },
                ],
                answer: 0,
                explanation: {
                    id: "Standar industri EUV internasional beroperasi pada panjang gelombang tepat 13.5 nm yang dipancarkan plasma timah (Tin droplet).",
                    en: "Standard EUV lithography operates at 13.5 nm emission generated by tin plasma laser excitation.",
                },
            },
            {
                id: "q11_2",
                prompt: { id: "Berdasarkan Kriteria Rayleigh CD = k₁ · (λ / NA), dua cara utama untuk memperkecil ukuran fitur cetak CD adalah...", en: "Per Rayleigh's Criterion CD = k₁ · (λ / NA), the two primary ways to shrink printable feature size CD are..." },
                formula: "CD = k_1 \\frac{\\lambda}{NA}",
                options: [
                    { id: "Memperpendek panjang gelombang λ dan memperbesar Numerical Aperture NA lensa", en: "Decreasing wavelength λ and increasing lens Numerical Aperture NA" },
                    { id: "Memperbesar panjang gelombang λ dan memperkecil NA", en: "Increasing wavelength λ and decreasing NA" },
                    { id: "Menaikkan suhu ruangan pabrik hingga 500°C", en: "Raising cleanroom temperature to 500°C" },
                    { id: "Menggunakan wafer berbentuk segitiga", en: "Using triangular silicon wafers" },
                ],
                answer: 0,
                explanation: {
                    id: "CD berbanding lurus dengan λ dan berbanding terbalik dengan NA. Memperpendek λ dan memperbesar NA menghasilkan resolusi nano tertajam.",
                    en: "CD ∝ λ / NA. Scaling down λ and expanding NA minimizes optical diffraction blur.",
                },
            },
            {
                id: "q11_3",
                prompt: { id: "Perusahaan manakah di dunia yang memonopoli 100% produksi mesin fotolitografi EUV komersial?", en: "Which company holds a 100% global monopoly on commercial EUV lithography scanners?" },
                options: [
                    { id: "ASML (Belanda)", en: "ASML (Netherlands)" },
                    { id: "Canon (Jepang)", en: "Canon (Japan)" },
                    { id: "Nikon (Jepang)", en: "Nikon (Japan)" },
                    { id: "Intel (Amerika Serikat)", en: "Intel (United States)" },
                ],
                answer: 0,
                explanation: {
                    id: "ASML yang berpusat di Veldhoven, Belanda adalah satu-satunya produsen mesin EUV komersial di planet bumi.",
                    en: "ASML based in Veldhoven, Netherlands is the sole commercial manufacturer of EUV scanners globally.",
                },
            },
            {
                id: "q11_4",
                prompt: { id: "Mengapa sistem optik litografi EUV harus beroperasi di dalam ruang hampa udara (high vacuum)?", en: "Why must EUV optical projection systems operate in high vacuum chambers?" },
                options: [
                    { id: "Karena udara ambien (nitrogen dan oksigen) menyerap cahaya EUV 13.5 nm secara total", en: "Because ambient air (nitrogen and oxygen) strongly absorbs 13.5 nm EUV light" },
                    { id: "Agar suara mesin tidak berisik ke luar pabrik", en: "To prevent machine acoustic noise from escaping" },
                    { id: "Agar gravitasi bumi hilang di dalam mesin", en: "To eliminate Earth's gravity inside the tool" },
                    { id: "Untuk mencegah lensa berkarat", en: "To prevent lenses from rusting" },
                ],
                answer: 0,
                explanation: {
                    id: "Foton EUV berinteraksi kuat dengan elektron pada atom gas udara dan langsung terserap dalam jarak beberapa milimeter jika tidak divakum.",
                    en: "13.5 nm photons are heavily absorbed by atmospheric gas molecules within a few millimeters unless evacuated to high vacuum.",
                },
            },
            {
                id: "q11_5",
                prompt: { id: "Berapa diameter standar wafer silikon kristal tunggal yang diproses di pabrik fabrikasi terdepan saat ini?", en: "What is the standard diameter of monocrystalline silicon wafers processed in modern fabs?" },
                options: [
                    { id: "300 milimeter (sekitar 12 inci)", en: "300 millimeters (about 12 inches)" },
                    { id: "50 milimeter (2 inci)", en: "50 millimeters (2 inches)" },
                    { id: "1000 milimeter (1 meter)", en: "1000 millimeters (1 meter)" },
                    { id: "10 milimeter", en: "10 millimeters" },
                ],
                answer: 0,
                explanation: {
                    id: "Giga-fab TSMC, Samsung, dan Intel memproses wafer silikon berdiameter 300 mm (12 inci) seberat ~2 kg dengan ketebalan 775 µm.",
                    en: "Leading-edge semiconductor fabs run 300 mm (12-inch) single-crystal silicon boules sliced into 775 µm thick disks.",
                },
            },
        ],
        journalEntry: {
            id: "photolithography",
            chapterId: 11,
            title: { id: "Fotolitografi EUV & Batas Rayleigh", en: "EUV Lithography & Rayleigh Limit" },
            note: {
                id: "Ukuran cetak minimum dibatasi oleh difraksi cahaya CD = k₁(λ/NA). Panjang gelombang EUV 13.5 nm memungkinkan pencetakan miliaran pola sirkuit nanometer.",
                en: "Printable resolution is bounded by wave diffraction CD = k₁(λ/NA). 13.5 nm EUV scanners enable printing billions of nanometer circuit wires.",
            },
            formula: "CD = k_1\\frac{\\lambda}{NA}",
            discoveredAt: "2026-01-20T19:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-12: CMOS Logic Gates & Integrated Circuits
    // -------------------------------------------------------------
    {
        id: 12,
        code: "CH-12",
        era: "chip_design",
        title: {
            id: "Gerbang Logika CMOS & Sirkuit Terpadu",
            en: "CMOS Logic Gates & Integrated Circuits",
        },
        narrative: {
            id: "Sebuah transistor tunggal hanyalah sakelar. Namun ketika transistor NMOS dan PMOS digabungkan secara komplementer (CMOS), terbentuklah gerbang logika universal: Inverter (NOT), NAND, dan NOR yang menyusun seluruh prosesor modern.",
            en: "A single transistor is just a switch. But when NMOS and PMOS transistors pair in complementary fashion (CMOS), they form universal logic gates: Inverter (NOT), NAND, and NOR powering all computation.",
        },
        coreConcept: {
            id: "Keunggulan CMOS adalah arus statis mendekati nol: sirkuit hanya mengonsumsi daya dinamis saat beralih status logika (P_dyn = α C_L V_DD² f).",
            en: "CMOS's revolution is near-zero static power: the circuit draws active energy almost purely when switching digital states (P_dyn = α C_L V_DD² f).",
        },
        formula: "P_{dyn} = \\alpha C_L V_{DD}^2 f",
        simulation: {
            type: "logic_gate",
            hasSignFlip: true,
            signLabel: { id: "Status Input Logika (+ Input '1' / − Input '0')", en: "Digital Input State (+ Logic '1' / − Logic '0')" },
            defaultSign: 1,
            params: [
                { id: "clock_freq", label: { id: "Frekuensi Clock f (GHz)", en: "Clock Frequency f (GHz)" }, min: 1.0, max: 5.5, step: 0.5, defaultValue: 3.5, unit: "GHz" },
                { id: "supply_voltage", label: { id: "Tegangan Suplai V_DD (Volt)", en: "Supply Voltage V_DD (V)" }, min: 0.6, max: 1.3, step: 0.05, defaultValue: 0.85, unit: "V" },
                { id: "load_capacitance", label: { id: "Kapasitansi Beban C_L (fF)", en: "Load Capacitance C_L (fF)" }, min: 5, max: 50, step: 5, defaultValue: 15, unit: "fF" },
            ],
            formulaTemplate: "P_{dyn} = \\alpha C_L V_{DD}^2 f",
            formulaBuilder: (p, sign) => {
                const vdd = p.supply_voltage || 0.85;
                const f = p.clock_freq || 3.5;
                const cl = (p.load_capacitance || 15) * 1e-15;
                const pdyn = (0.5 * cl * Math.pow(vdd, 2) * (f * 1e9) * 1e6).toFixed(2);
                const inputVal = sign >= 0 ? 1 : 0;
                const outVal = 1 - inputVal;
                return `IN = ${inputVal} \\implies OUT = ${outVal} \\quad [P_{gate} = ${pdyn} \\mu\\text{W}]`;
            },
            signExplanation: {
                id: "MEMBALIK TANDA (+ ke −): Mengubah input logika dari '1' (+V_DD) ke '0' (GND) mematikan jaringan Pull-Down NMOS dan menyalakan jaringan Pull-Up PMOS, mengisi kapasitansi beban output ke level logika HIGH ('1').",
                en: "SIGN-FLIP EXPLANATION (+ to −): Flipping digital input from '1' (+V_DD) down to '0' (GND) turns OFF the NMOS pull-down network and turns ON the PMOS pull-up network, charging output capacitance to HIGH ('1').",
            },
        },
        askWhy: {
            title: { id: "Mengapa Tegangan Operasi Prosesor Diturunkan dari 5V ke Bawah 1V?", en: "Why Did CPU Supply Voltages Drop from 5V to Below 1V?" },
            simple: {
                id: "Karena konsumsi daya dan panas naik secara kuadratik terhadap voltase (V²)! Menurunkan tegangan dari 5 Volt ke 0.8 Volt memotong panas disipasi hingga 97%, mencegah chip meleleh saat clock 4 GHz.",
                en: "Because power dissipation scales quadratically with voltage (V²)! Slashing voltage from 5V down to 0.8V reduces heat by ~97%, preventing thermal meltdown at 4 GHz.",
            },
            deep: {
                id: "Hukum penskalaan Dennard (Dennard Scaling) awalnya memprediksi daya konstan per luas chip. Namun di bawah 1V, penurunan tegangan terhenti karena tegangan ambang V_th tidak bisa dikecilkan lebih jauh tanpa memicu arus bocor eksponensial.",
                en: "Dennard scaling predicted constant power density. However, below 1V, voltage scaling stalled because threshold voltage V_th cannot be lowered further without triggering massive subthreshold leakage.",
            },
            chip: {
                id: "Sirkuit komplementer CMOS adalah blok dasar penyusun sel memori SRAM Cache 6T dan unit logika aritmatika ALU prosesor smartphone dan server AI.",
                en: "CMOS complementary pairs form the core building blocks of 6T SRAM caches and 64-bit ALU datapaths inside smartphone and AI accelerator dies.",
            },
        },
        sideQuest: {
            id: "sq-12",
            title: { id: "Sel Memori 6T SRAM Cache Level 3 Prosesor", en: "6T SRAM Cache Cell Layout" },
            tag: { id: "Memori Statis On-Chip", en: "On-Chip SRAM" },
            description: {
                id: "Satu sel memori SRAM tercepat terdiri dari 6 transistor CMOS (2 PMOS pull-up, 2 NMOS pull-down, 2 pass-gate) seluas 0.021 µm² pada node 3 nm.",
                en: "A 6-transistor SRAM bitcell occupies just 0.021 µm² on 3 nm foundry nodes, delivering sub-nanosecond L1 cache access.",
            },
            realWorldTech: { id: "TSMC 3nm High-Density SRAM Bitcell", en: "TSMC 3nm High-Density SRAM Bitcell" },
        },
        quiz: [
            {
                id: "q12_1",
                prompt: { id: "Sebuah inverter CMOS standar tersusun dari pasangan transistor...", en: "A standard CMOS inverter circuit is composed of a pair of..." },
                options: [
                    { id: "Satu transistor PMOS (pull-up) dan satu transistor NMOS (pull-down)", en: "One PMOS (pull-up) transistor and one NMOS (pull-down) transistor" },
                    { id: "Dua transistor NMOS yang dihubungkan seri", en: "Two NMOS transistors connected in series" },
                    { id: "Dua transistor bipolar NPN", en: "Two NPN bipolar transistors" },
                    { id: "Satu dioda silikon dan satu resistor", en: "One silicon diode and one resistor" },
                ],
                answer: 0,
                explanation: {
                    id: "CMOS (Complementary MOS) menggabungkan PMOS di bagian atas (menghubungkan ke VDD) dan NMOS di bagian bawah (menghubungkan ke GND).",
                    en: "Complementary MOS pairs a PMOS pull-up network to VDD with an NMOS pull-down network to GND.",
                },
            },
            {
                id: "q12_2",
                prompt: { id: "Jika tegangan suplai V_DD sebuah chip dipotong menjadi setengahnya (misal dari 1.2 V ke 0.6 V), daya dinamis switching P_dyn akan...", en: "If chip supply voltage V_DD is halved (e.g., 1.2V down to 0.6V), dynamic switching power P_dyn will..." },
                formula: "P_{dyn} \\propto V_{DD}^2",
                options: [
                    { id: "Turun menjadi seperempatnya (1/4)", en: "Drop to one-fourth (1/4)" },
                    { id: "Turun menjadi setengahnya (1/2)", en: "Drop to one-half (1/2)" },
                    { id: "Tetap sama persis", en: "Remain unchanged" },
                    { id: "Meningkat dua kali lipat", en: "Double" },
                ],
                answer: 0,
                explanation: {
                    id: "Karena P_dyn berbanding lurus dengan kuadrat V_DD (P ∝ V_DD²), memotong V_DD menjadi 1/2 menurunkan daya menjadi (1/2)² = 1/4 (pengurangan 75%).",
                    en: "Because P_dyn scales with V_DD², cutting voltage in half reduces dynamic power to (0.5)² = 0.25 (75% power reduction).",
                },
            },
            {
                id: "q12_3",
                prompt: { id: "Gerbang logika universal manakah yang dapat digunakan untuk menyusun seluruh jenis fungsi logika boolean lainnya?", en: "Which universal logic gate can be configured to synthesize all other boolean operations?" },
                options: [
                    { id: "Gerbang NAND (atau NOR)", en: "NAND gate (or NOR gate)" },
                    { id: "Gerbang AND saja", en: "AND gate exclusively" },
                    { id: "Gerbang OR saja", en: "OR gate exclusively" },
                    { id: "Gerbang XOR saja", en: "XOR gate exclusively" },
                ],
                answer: 0,
                explanation: {
                    id: "NAND dan NOR adalah gerbang universal: kombinasi gerbang NAND dapat mereplikasi fungsi NOT, AND, OR, XOR, dan flip-flop memori.",
                    en: "NAND and NOR are functionally complete universal gates able to construct any arbitrary combinational or sequential circuit.",
                },
            },
            {
                id: "q12_4",
                prompt: { id: "Mengapa teknologi CMOS mendominasi sirkuit digital modern dibandingkan teknologi NMOS lama?", en: "Why did CMOS decisively supplant NMOS in modern digital computing?" },
                options: [
                    { id: "CMOS memiliki konsumsi daya statis mendekati nol saat gerbang tidak beralih", en: "CMOS draws near-zero static power when idle in steady states" },
                    { id: "CMOS hanya membutuhkan satu kabel", en: "CMOS requires only one wire" },
                    { id: "NMOS tidak bisa dibuat di silikon", en: "NMOS cannot be fabricated on silicon" },
                    { id: "CMOS tidak memerlukan suplai listrik", en: "CMOS requires no power source" },
                ],
                answer: 0,
                explanation: {
                    id: "Pada NMOS lama, resistor pull-up mengalirkan arus terus menerus saat output LOW. CMOS memutus aliran DC statis secara total.",
                    en: "Older NMOS gates dissipated static current continuously whenever output was LOW. CMOS shuts off static DC paths entirely.",
                },
            },
            {
                id: "q12_5",
                prompt: { id: "Berapa keluaran (Output) dari gerbang logika NAND 2-input jika kedua inputnya bernilai logika '1'?", en: "What is the output of a 2-input NAND gate if both inputs are logic '1'?" },
                options: [
                    { id: "Logika '0' (LOW)", en: "Logic '0' (LOW)" },
                    { id: "Logika '1' (HIGH)", en: "Logic '1' (HIGH)" },
                    { id: "Mengambang (High-Z)", en: "Floating (High-Z)" },
                    { id: "Nilai acak tak tentu", en: "Random indeterminate state" },
                ],
                answer: 0,
                explanation: {
                    id: "NAND adalah NOT-AND. 1 AND 1 = 1; NOT(1) = 0.",
                    en: "NAND negates AND. 1 AND 1 = 1; inverted gives 0.",
                },
            },
        ],
        journalEntry: {
            id: "cmos-logic",
            chapterId: 12,
            title: { id: "Gerbang Logika CMOS & Disipasi Dinamis", en: "CMOS Logic Gates & Dynamic Power" },
            note: {
                id: "Sirkuit komplementer CMOS memadukan PMOS pull-up dan NMOS pull-down. Disipasi daya dinamis P = α C V² f mendikte batas frekuensi prosesor modern.",
                en: "CMOS combines PMOS pull-up and NMOS pull-down networks. Dynamic dissipation P = α C V² f sets the thermal clock frequency wall of modern chips.",
            },
            formula: "P_{dyn} = \\alpha C_L V_{DD}^2 f",
            discoveredAt: "2026-01-21T20:00:00Z",
        },
    },

    // -------------------------------------------------------------
    // CH-13: Capstone: Chip Design & 2 nm Quantum Limits
    // -------------------------------------------------------------
    {
        id: 13,
        code: "CH-13",
        era: "chip_design",
        title: {
            id: "Capstone: Desain Chip & Batas Kuantum 2 nm",
            en: "Capstone: Chip Design & The 2 nm Quantum Frontier",
        },
        narrative: {
            id: "Selamat datang di puncak Quantum Lab! Kamu sekarang adalah Principal Silicon Architect. Di batas nanometer bawah-2nm, transistor begitu kecil sehingga hanya selebar 10 atom silikon. Efek kuantum seperti tunneling dan variasi diskret atomik menjadi penentu batas performa komputasi AI masa depan.",
            en: "Welcome to the summit of Quantum Lab! You are now Principal Silicon Architect. At sub-2nm nodes, transistor channels span barely 10 silicon atoms wide. Quantum tunneling and atomic stochastic variations dictate the ultimate frontier of future computing.",
        },
        coreConcept: {
            id: "Desain chip modern adalah seni menyeimbangkan kompromi PPA (Power, Performance, Area). Optimalkan clock delay vs kebocoran statis kuantum untuk merakit ALU komputasi 64-bit.",
            en: "Advanced chip architecture balances the PPA triad (Power, Performance, Area). Optimize logic delay vs quantum leakage to construct high-throughput arithmetic pipelines.",
        },
        formula: "\\tau_{delay} \\propto \\frac{C_L V_{DD}}{I_{on}}, \\quad P_{total} = P_{dyn} + I_{leak} V_{DD}",
        simulation: {
            type: "capstone_chip",
            hasSignFlip: true,
            signLabel: { id: "Mode Optimasi Chip (+ Performa Ekstrem / − Mode Hemat Daya)", en: "Optimization Priority (+ Max Frequency / − Ultra-Low Power)" },
            defaultSign: 1,
            params: [
                { id: "node_size", label: { id: "Node Fabrikasi Silikon (nm)", en: "Process Technology Node (nm)" }, min: 2, max: 14, step: 1, defaultValue: 3, unit: "nm" },
                { id: "voltage_overdrive", label: { id: "Tegangan Inti V_DD (Volt)", en: "Core Operating Voltage V_DD" }, min: 0.65, max: 1.15, step: 0.05, defaultValue: 0.8, unit: "V" },
                { id: "gate_count", label: { id: "Skala Kompleksitas Gerbang (Juta)", en: "Logic Gate Complexity (Millions)" }, min: 100, max: 2000, step: 100, defaultValue: 500 },
            ],
            formulaTemplate: "TDP = P_{dyn} + P_{leak}, \\quad \\text{Score} = \\frac{\\text{TOPS}}{\\text{Watt}}",
            formulaBuilder: (p, sign) => {
                const node = p.node_size || 3;
                const vdd = p.voltage_overdrive || 0.8;
                const isPerf = sign >= 0;
                const freqNum = isPerf ? 4.2 - (node - 2) * 0.2 : 2.4 - (node - 2) * 0.1;
                const powerNum = isPerf ? 65 + (14 - node) * 4 : 15 + (14 - node) * 1.5;
                const freq = freqNum.toFixed(1);
                const power = powerNum.toFixed(0);
                const score = ((freqNum * 1000) / (powerNum || 1)).toFixed(1);
                return `Freq = ${freq} \\text{ GHz} \\mid TDP = ${power} \\text{ W} \\implies \\text{PPA Efisiensi: } ${score} \\text{ pts}`;
            },
            signExplanation: {
                id: "MEMBALIK TANDA (+ ke −): Beralih dari Mode Performa Ekstrem (+, voltase tinggi untuk frekuensi clock maksimum 4.2+ GHz) ke Mode Hijau Hemat Daya (−, voltase mendekati threshold untuk memangkas kebocoran daya statis hingga 80%), mendemonstrasikan kompromi kritis arsitek prosesor AI.",
                en: "SIGN-FLIP EXPLANATION (+ to −): Toggling optimization priority from Turbo Performance (+, elevated overdrive for 4.2+ GHz clock speeds) down to Ultra-Low Power (−, near-threshold operation cutting leakage by 80%), simulating the core trade-off faced by AI processor architects.",
            },
        },
        askWhy: {
            title: { id: "Apakah Hukum Moore Telah Berakhir di Bawah 2 nm?", en: "Has Moore's Law Reached Its Ultimate Atomic Limit Below 2 nm?" },
            simple: {
                id: "Satu atom silikon berukuran sekitar 0.2 nanometer. Pada transistor 2 nm, tebal kanal hanya tersisa sekitar 10 atom! Kita tidak bisa lagi mengecilkan transistor lebih kecil dari ukuran satu atom tunggal.",
                en: "A single silicon atom is about 0.2 nanometers across. At 2 nm, transistor channels are barely 10 atoms wide! We physically cannot build a transistor smaller than an individual atom.",
            },
            deep: {
                id: "Di bawah 2 nm, fluktuasi statistik penempatan atom dopant (Random Dopant Fluctuation) dan arus bocor penerowongan langsung dari Source ke Drain (Source-to-Drain Tunneling) menuntut inovasi material baru seperti lembaran 2D Monolayer MoS₂ dan arsitektur 3D Chiplet.",
                en: "Below 2 nm, Random Dopant Fluctuation and direct Source-to-Drain quantum tunneling demand radical architectural pivots: 2D Transition Metal Dichalcogenide monolayers (MoS₂) and 3D Backside Power Delivery (Intel PowerVia).",
            },
            chip: {
                id: "Solusi masa depan untuk terus meningkatkan daya komputasi adalah arsitektur 3D Packaging (Chiplet Interconnect seperti TSMC CoWoS) yang menggabungkan beberapa keping silikon terpisah menjadi satu super-chip raksasa seperti GPU Nvidia Blackwell.",
                en: "The vanguard solution is 3D Advanced Packaging (like TSMC CoWoS chiplet interconnects), fusing multiple specialized silicon dies into monolithic supercomputers like the Nvidia Blackwell B200 GPU.",
            },
        },
        sideQuest: {
            id: "sq-13",
            title: { id: "Super-Chip AI Nvidia Blackwell B200 (CoWoS-L 208 Miliar Transistor)", en: "Nvidia Blackwell B200 AI Super-Chip (208 Billion Transistors)" },
            tag: { id: "Akselerator AI", en: "AI Supercomputing" },
            description: {
                id: "Dua keping silikon 4NP digabungkan melalui interkoneksi 10 TB/detik dengan memori HBM3e berkapasitas 192 GB untuk melatih model kecerdasan buatan terbesar di dunia.",
                en: "Dual reticle-limit 4NP silicon dies linked via a 10 TB/s CoWoS silicon bridge package 208 billion transistors alongside 192 GB of HBM3e memory.",
            },
            realWorldTech: { id: "Nvidia Blackwell B200 Ultra-Accelerator", en: "Nvidia Blackwell B200 Ultra-Accelerator" },
        },
        quiz: [
            {
                id: "q13_1",
                prompt: { id: "Apa arti singkatan metriks 'PPA' yang menjadi kompromi utama dalam arsitektur desain chip modern?", en: "What does the industry-standard acronym 'PPA' stand for in microchip architecture?" },
                options: [
                    { id: "Power, Performance, Area (Daya, Performa, Luas Silikon)", en: "Power, Performance, Area" },
                    { id: "Photons, Protons, Atoms", en: "Photons, Protons, Atoms" },
                    { id: "Program, Process, Algorithm", en: "Program, Process, Algorithm" },
                    { id: "Packet, Protocol, Address", en: "Packet, Protocol, Address" },
                ],
                answer: 0,
                explanation: {
                    id: "PPA (Power, Performance, Area) adalah segitiga kompromi utama: menaikkan performa (kecepatan) biasanya membutuhkan lebih banyak daya atau area silikon.",
                    en: "Power, Performance, Area (PPA) defines the core trade-off triad optimized across the entire EDA chip design flow.",
                },
            },
            {
                id: "q13_2",
                prompt: { id: "Teknologi pengiriman daya revolusioner apa yang memindahkan jalur kabel daya ke bagian belakang wafer silikon pada node 2 nm (seperti Intel PowerVia)?", en: "Which revolutionary power delivery technology routes power wires to the backside of the silicon wafer at 2 nm?" },
                options: [
                    { id: "Backside Power Delivery Network (BSPDN)", en: "Backside Power Delivery Network (BSPDN)" },
                    { id: "Baterai nuklir on-chip", en: "On-chip nuclear micro-battery" },
                    { id: "Kabel tembaga gantung", en: "Suspended aerial copper cables" },
                    { id: "Pengisian daya nirkabel Qi internal", en: "Internal Qi wireless induction charging" },
                ],
                answer: 0,
                explanation: {
                    id: "Backside Power Delivery memisahkan jalur suplai daya ke belakang wafer, membebaskan lapisan depan khusus untuk perutean sinyal data berkecepatan tinggi.",
                    en: "Backside Power Delivery Networks route power rails on the reverse side of the thinned wafer, de-congesting top metal layers exclusively for signal wires.",
                },
            },
            {
                id: "q13_3",
                prompt: { id: "Apa tantangan kuantum paling berbahaya saat kanal transistor diperpendek hingga di bawah 2 nanometer?", en: "What is the most severe quantum barrier when transistor channels shrink below 2 nm?" },
                options: [
                    { id: "Penerowongan kuantum langsung dari Source ke Drain (Source-to-Drain Tunneling) yang membuat transistor tidak bisa dimatikan", en: "Direct Source-to-Drain quantum tunneling making the transistor impossible to turn off" },
                    { id: "Elektron berubah menjadi partikel gravitasi", en: "Electrons converting into gravitational quanta" },
                    { id: "Silikon berubah warna menjadi merah muda", en: "Silicon turning bright pink" },
                    { id: "Kecepatan cahaya melambat menjadi 10 km/jam", en: "Light slowing down to 10 km/h" },
                ],
                answer: 0,
                explanation: {
                    id: "Ketika jarak Source ke Drain hanya beberapa nanometer, elektron dapat menerowong langsung menembus kanal meski gerbang bertegangan 0 V (sakelar bocor total).",
                    en: "When the channel length drops to a few nanometers, electrons tunnel straight through the barrier from Source to Drain regardless of gate electrostatic control.",
                },
            },
            {
                id: "q13_4",
                prompt: { id: "Strategi arsitektur alternatif apa yang digunakan industri untuk mengatasi batas ukuran fisik keping silikon (Reticle Limit)?", en: "Which architectural strategy overcomes single-die reticle limits by assembling multiple modular silicon tiles?" },
                options: [
                    { id: "Arsitektur Chiplet dengan kemasan canggih 3D (Advanced Packaging)", en: "Chiplet architecture using 3D Advanced Packaging" },
                    { id: "Menghentikan pembuatan prosesor komputer", en: "Ceasing microprocessor manufacturing" },
                    { id: "Membuat chip dari bahan plastik daur ulang", en: "Fabricating chips from recycled plastic" },
                    { id: "Membakar wafer silikon", en: "Burning silicon wafers" },
                ],
                answer: 0,
                explanation: {
                    id: "Chiplet membagi prosesor besar menjadi modul-modul kecil (CPU compute tiles, I/O dies, HBM) yang dihubungkan dengan pita interkoneksi super-padat (TSMC CoWoS / Intel EMIB).",
                    en: "Chiplet modularity splits massive monolithic designs into yield-friendly functional tiles bonded via dense 3D silicon interconnect bridges.",
                },
            },
            {
                id: "q13_5",
                prompt: { id: "Pernyataan manakah yang paling tepat merangkum perjalanan dari hipotesis kuantisasi Planck (1900) hingga chip komputer modern?", en: "Which statement best summarizes the century-long journey from Planck (1900) to modern microchips?" },
                options: [
                    { id: "Mekanika kuantum bukan sekadar teori abstrak, melainkan fondasi fisik utama yang memungkinkan eksistensi seluruh industri semikonduktor dan komputasi digital modern", en: "Quantum mechanics is not mere abstract theory, but the fundamental physical foundation enabling the entire semiconductor and digital computing universe" },
                    { id: "Fisika klasik sudah cukup untuk merancang transistor 2 nm", en: "Classical physics is sufficient to design 2 nm transistors" },
                    { id: "Komputer modern bekerja tanpa melibatkan atom sama sekali", en: "Modern computers operate completely without atoms" },
                    { id: "Max Planck adalah perancang prosesor smartphone pertama", en: "Max Planck designed the first smartphone processor" },
                ],
                answer: 0,
                explanation: {
                    id: "Setiap transistor di dalam miliaran ponsel pintar, mobil listrik, dan server AI di planet bumi bekerja secara langsung berdasarkan prinsip-prinsip kuantum yang ditemukan sejak Planck, Einstein, Bohr, hingga Schrödinger.",
                    en: "Every transistor in modern supercomputers operates strictly under the quantum laws discovered by Planck, Einstein, Bohr, and Schrödinger.",
                },
            },
        ],
        journalEntry: {
            id: "capstone-chip-design",
            chapterId: 13,
            title: { id: "Batas Kuantum Desain Chip 2 nm", en: "The 2 nm Quantum Frontier" },
            note: {
                id: "Di batas nanometer, komputasi berhadapan langsung dengan batas atomik dan penerowongan kuantum. Penskalaan PPA, GAA Nanosheet, dan kemasan 3D Chiplet meneruskan obor komputasi manusia.",
                en: "At sub-2nm scales, computing converges with atomic limits and direct tunneling. PPA optimization, GAA Nanosheets, and 3D Chiplets carry human computing forward.",
            },
            formula: "\\tau \\propto \\frac{C_L V_{DD}}{I_{on}}, \\quad P = P_{dyn} + P_{leak}",
            discoveredAt: "2026-01-22T21:00:00Z",
        },
    },
];

export const getChapterFull = (id: number): ChapterFull | undefined => {
    return CURRICULUM.find((c) => c.id === id);
};
