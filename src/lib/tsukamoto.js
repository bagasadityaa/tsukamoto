// lib/tsukamoto.js
// Rumus sesuai BAB III FIX.pdf (Fuzzy Tsukamoto)

export function hitungDetergen({ berat, warna, kotor, tebal }) {
  // =========================
  // 1) FUNGSI KEANGGOTAAN INPUT
  // =========================

  // --- Berat Cucian (v) ---
  const muBeratRingan = (v) => {
    if (v < 1) return 1;
    if (v >= 1 && v <= 4) return (4 - v) / (4 - 1);
    return 0;
  };

  const muBeratSedang = (v) => {
    if (v <= 2 || v >= 6) return 0;
    if (v >= 2 && v <= 4) return (v - 2) / (4 - 2);
    if (v >= 4 && v <= 6) return (6 - v) / (6 - 4);
    return 0;
  };

  const muBeratBerat = (v) => {
    if (v < 4) return 0;
    if (v >= 4 && v <= 8) return (v - 4) / (8 - 4);
    return 1;
  };

  // --- Warna Kain (w) ---
  const muWarnaGelap = (w) => {
    if (w < 10) return 1;
    if (w >= 10 && w <= 50) return (50 - w) / (50 - 10);
    return 0;
  };

  const muWarnaSedang = (w) => {
    if (w <= 30 || w >= 70) return 0;
    if (w >= 30 && w <= 50) return (w - 30) / (50 - 30);
    if (w >= 50 && w <= 70) return (70 - w) / (70 - 50);
    return 0;
  };

  const muWarnaTerang = (w) => {
    if (w < 50) return 0;
    if (w >= 50 && w <= 100) return (w - 50) / (100 - 50);
    return 1;
  };

  // --- Tingkat Kotor (x) ---
  const muKotorRingan = (x) => {
    if (x < 1) return 1;
    if (x >= 1 && x <= 5) return (5 - x) / (5 - 1);
    return 0;
  };

  const muKotorSedang = (x) => {
    if (x <= 3 || x >= 7) return 0;
    if (x >= 3 && x <= 5) return (x - 3) / (5 - 3);
    if (x >= 5 && x <= 7) return (7 - x) / (7 - 5);
    return 0;
  };

  const muKotorBerat = (x) => {
    if (x < 5) return 0;
    if (x >= 5 && x <= 10) return (x - 5) / (10 - 5);
    return 1;
  };

  // --- Ketebalan (y) ---
  const muTebalTipis = (y) => {
    if (y < 0.5) return 1;
    if (y >= 0.5 && y <= 2.5) return (2.5 - y) / (2.5 - 0.5);
    return 0;
  };

  const muTebalSedang = (y) => {
    if (y <= 1.5 || y >= 3.5) return 0;
    if (y >= 1.5 && y <= 2.5) return (y - 1.5) / (2.5 - 1.5);
    if (y >= 2.5 && y <= 3.5) return (3.5 - y) / (3.5 - 2.5);
    return 0;
  };

  const muTebalTebal = (y) => {
    if (y < 2.5) return 0;
    if (y >= 2.5 && y <= 5) return (y - 2.5) / (5 - 2.5);
    return 1;
  };

  // =========================
  // 2) HITUNG DERAJAT KEANGGOTAAN
  // =========================

  const beratFuzzy = {
    ringan: muBeratRingan(berat),
    sedang: muBeratSedang(berat),
    berat: muBeratBerat(berat),
  };

  const warnaFuzzy = {
    gelap: muWarnaGelap(warna),
    sedang: muWarnaSedang(warna),
    terang: muWarnaTerang(warna),
  };

  const kotorFuzzy = {
    ringan: muKotorRingan(kotor),
    sedang: muKotorSedang(kotor),
    berat: muKotorBerat(kotor),
  };

  const tebalFuzzy = {
    tipis: muTebalTipis(tebal),
    sedang: muTebalSedang(tebal),
    tebal: muTebalTebal(tebal),
  };

  // =========================
  // 3) FUNGSI OUTPUT TSUKAMOTO (Z)
  // =========================
  // Output:
  // Sedikit : z < 30 -> 1, 30-70 turun, >70 -> 0
  // Sedang  : segitiga 50-70-90
  // Banyak  : z < 70 -> 0, 70-110 naik, >110 -> 1

  // Kebalikan fungsi (invers) untuk cari z dari alpha

  // sedikit: alpha = (70 - z) / 40  => z = 70 - 40*alpha
  const zSedikit = (alpha) => 70 - (70 - 30) * alpha;

  // sedang: ada 2 sisi, tapi Tsukamoto butuh fungsi monoton.
  // Biasanya dipisah:
  // sedang_naik (50-70)  : alpha = (z - 50)/20 => z = 50 + 20*alpha
  // sedang_turun (70-90) : alpha = (90 - z)/20 => z = 90 - 20*alpha
  const zSedangNaik = (alpha) => 50 + (70 - 50) * alpha;
  const zSedangTurun = (alpha) => 90 - (90 - 70) * alpha;

  // banyak: alpha = (z - 70) / 40 => z = 70 + 40*alpha
  const zBanyak = (alpha) => 70 + (110 - 70) * alpha;

  // =========================
  // 4) RULE BASE (81 RULE)
  // =========================
  // Di PDF rule lengkap ada 81.
  // Karena tabel di BAB III cuma menampilkan sebagian dan sisanya di lampiran,
  // kita buat generator 81 rule otomatis.

  const kategoriBerat = ["ringan", "sedang", "berat"];
  const kategoriWarna = ["gelap", "sedang", "terang"];
  const kategoriKotor = ["ringan", "sedang", "berat"];
  const kategoriTebal = ["tipis", "sedang", "tebal"];

  // Mapping output berdasarkan pola umum:
  // Semakin berat cucian / kotor / tebal -> makin banyak detergen
  // (Kalau kamu punya lampiran rule outputnya EXACT, tinggal ganti bagian ini)

  function tentukanOutputRule(b, w, k, t) {
    // skor sederhana untuk mendekati aturan laundry
    const skor =
      (b === "ringan" ? 0 : b === "sedang" ? 1 : 2) +
      (k === "ringan" ? 0 : k === "sedang" ? 1 : 2) +
      (t === "tipis" ? 0 : t === "sedang" ? 1 : 2) +
      (w === "gelap" ? 0 : w === "sedang" ? 1 : 2);

    if (skor <= 3) return "sedikit";
    if (skor <= 6) return "sedang";
    return "banyak";
  }

  // =========================
  // 5) INFERENSI TSUKAMOTO
  // =========================

  let atas = 0;
  let bawah = 0;

  const ruleDetail = [];

  let ruleNo = 1;

  for (const b of kategoriBerat) {
    for (const w of kategoriWarna) {
      for (const k of kategoriKotor) {
        for (const t of kategoriTebal) {
          const alpha = Math.min(
            beratFuzzy[b],
            warnaFuzzy[w],
            kotorFuzzy[k],
            tebalFuzzy[t],
          );

          const output = tentukanOutputRule(b, w, k, t);

          let z = 0;

          if (output === "sedikit") {
            z = zSedikit(alpha);
          } else if (output === "banyak") {
            z = zBanyak(alpha);
          } else {
            // output sedang: kita ambil yang mendekati tengah (70)
            // supaya stabil.
            // (Kalau kamu punya rule lampiran, bisa dibuat exact)
            const z1 = zSedangNaik(alpha);
            const z2 = zSedangTurun(alpha);
            z = (z1 + z2) / 2;
          }

          atas += alpha * z;
          bawah += alpha;

          ruleDetail.push({
            ruleNo,
            IF: { berat: b, warna: w, kotor: k, tebal: t },
            alpha,
            output,
            z,
          });

          ruleNo++;
        }
      }
    }
  }

  const hasil = bawah === 0 ? 0 : atas / bawah;

  return {
    input: { berat, warna, kotor, tebal },
    fuzzy: { beratFuzzy, warnaFuzzy, kotorFuzzy, tebalFuzzy },
    hasil: Number(hasil.toFixed(3)),
    ruleDetail,
  };
}
