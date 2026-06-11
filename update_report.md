# Laporan Pembaruan EduPanel (Update Log) from Diaby

Berikut adalah ringkasan dari semua perubahan, peningkatan, dan perbaikan *bug* yang telah dilakukan pada sesi pengembangan ini:

## 1. Perubahan Mekanika Game (Gameplay Mechanics)

### A. Word Pinisi Duel
- **Mode Adu Cepat (Race Mode):** Merombak sistem giliran menjadi format berebut. Begitu salah satu pemain (P1 atau P2) menjawab (baik benar maupun salah), sistem akan langsung mengevaluasi skor dan otomatis berpindah ke soal berikutnya setelah jeda singkat.
- **Sistem Nyawa Permanen:** Logika nyawa (atau batas kesalahan/`p1Errors` & `p2Errors`) telah diubah sehingga persisten (tetap) selama 1 putaran permainan. Nyawa tidak lagi di-*reset* setiap pergantian soal.
- **Kondisi Kalah Langsung (Sudden Death):** Menambahkan *Death Check* di mana jika salah satu pemain kehabisan nyawa (mencapai batas maksimal kesalahan), game akan otomatis berakhir (Pemain tersebut KO).

### B. Waste Sorting Race (Balapan Pilah Sampah)
- **Mode Adu Cepat (Race Mode):** Menyelaraskan mekanik permainannya agar sama dengan *Word Pinisi*. Segera setelah pemain memasukkan sampah ke keranjang, skor langsung dihitung, pilihan lawan otomatis terkunci (*locked* state), dan soal item sampah langsung berganti secara otomatis.

### C. Space Exploration (Jelajah Tata Surya)
- **Sistem Kuis Flashcard:** Mengubah game dari sekadar eksplorasi klik menjadi game tebak satelit/bulan. Layar dibagi menjadi 3 area: Daftar Planet (Kiri), Animasi SVG Tata Surya (Tengah), dan Kartu Soal Kuis (Kanan).
- **Tingkat Kesulitan Clue:** Menghapus penyebutan nama planet secara langsung di dalam teks petunjuk (fakta/clue) bulan untuk meningkatkan tantangan.
- **Animasi Umpan Balik (Feedback Alert):** 
  - Jika jawaban **Benar**: Muncul tulisan raksasa hijau **"+15"** dan bulan otomatis mengorbit planet tujuan.
  - Jika jawaban **Salah**: Muncul tulisan raksasa merah **"SALAH!"** disertai animasi bergetar (*shake*) pada planet yang ditebak.

---

## 2. Peningkatan Antarmuka Pengguna (UI/UX) & Tata Letak

### Standarisasi `GameHeader`
Semua antarmuka bagian atas game sekarang telah diseragamkan menggunakan komponen sentral `GameHeader`.
Pembaruan ini diterapkan secara spesifik pada **King of the Jungle** dan **Geometric Shapes**:
- **Tombol Kembali (Menu Utama):** Dipindah menjadi rapi ke pojok kiri atas (sebelumnya berada di tombol besar bawah yang menghalangi pandangan).
- **Tombol Fullscreen:** Diubah ukurannya dan dipindahkan ke pojok kanan atas dengan proporsi kotak bening yang sama persis untuk semua game.
- **Pemindahan Indikator Giliran (King of Jungle):** Memindahkan teks *turn indicator* ("Giliran TIM BIRU") yang tadinya tumpang tindih (*overlap*) dengan *scoreboard*, ke bawah kotak "Keterangan" di panel sisi kanan (*sidebar*).

---

## 3. Perbaikan Bug & Optimasi Kode (Code Health)

- **Perbaikan Hydration Mismatch:** Menyelesaikan peringatan (error merah) React Hydration Mismatch pada `WasteSortingRace` dan `WordPinisiDuel` yang disebabkan oleh perbedaan *render* antara Server dan Client (seperti pemanggilan acak *random* array). Diperbaiki dengan mengimplementasikan state penanda `isMounted` dan penundaan render.
- **Penanganan Error Linter (React state update warning):** Perintah `setIsMounted` telah dibungkus menggunakan `setTimeout` ke *Event Loop* browser, sehingga Next.js/React tidak lagi melempar peringatan *Cascading/Synchronous render*.
- **Perbaikan Animasi Framer Motion:** Memperbaiki *error console* (yang menyebutkan `Only two keyframes currently supported with spring`) pada animasi salah di game tata surya, dengan memisahkan transisi gerak sumbu X (kiri-kanan) dari efek *Spring* menjadi *Tween* linear biasa.
- **Pembersihan Kode Sampah (Refactoring):** Melalui *scanning* ESLint, telah dihapus berbagai variabel skor persen yang tidak dipakai, *import* usang (seperti `useEffect` dan `useRef` yang tak digunakan lagi), dan mematikan peringatan linter palsu (*false positives*).

---

## 4. Konsep Diskusi Selanjutnya (Tertunda/Hold)
- **Rencana Rombak Space Exploration Menjadi 2-Player (1v1):** Konsep yang telah disetujui adalah membiarkan tata surya tetap di tengah sebagai visualisasi, sementara Sisi Kiri (P1) dan Sisi Kanan (P2) memiliki tombol panel planetnya masing-masing untuk digunakan berebut secara *real-time*. (Status: *On Hold*).
