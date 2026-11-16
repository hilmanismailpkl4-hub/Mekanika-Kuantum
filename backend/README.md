# Quantum Lab - Backend API & Models

Layanan backend terpadu untuk kurikulum fisika kuantum interaktif **Quantum Lab: Dari Planck ke Chip**.

## Struktur Direktori
```
backend/
├── data/
│   └── kuantum.json     # Dataset kurikulum 13 bab, konsep, & skema desain
├── models.py            # Data model dataclasses & loader dataset
├── server.py            # HTTP REST API server
└── README.md            # Dokumentasi backend
```

## Menjalankan Server
Jalankan server menggunakan Python:
```bash
python server.py
# atau dengan port kustom:
python server.py 8080
```

## Daftar Endpoint REST API
- `GET /api/health` - Cek status kesehatan backend
- `GET /api/chapters` - Mengambil seluruh 13 bab kurikulum kuantum
- `GET /api/chapters/<id>` - Mengambil detail bab spesifik berdasarkan ID (1-13)
- `GET /api/quiz/<chapter_id>` - Mengambil soal kuis untuk bab bersangkutan
- `GET /api/dataset` - Mengambil seluruh metadata dan blueprint proyek
- `GET /api/progress` - Mengambil status progres pembelajaran pengguna
- `POST /api/progress` - Menyimpan pembaruan progres pengguna (XP, bab terbuka, lencana)
