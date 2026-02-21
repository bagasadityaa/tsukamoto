// lib/tsukamoto.js
// Rumus sesuai BAB III FIX.pdf (Fuzzy Tsukamoto)

// lib/tsukamoto.js
// Fuzzy Tsukamoto - Takaran Detergen
// Input:
// v = berat cucian (Kg)
// w = warna (0-100)
// x = tingkat kotor (1-10)
// y = ketebalan kain (mm)
// Output:
// Z = takaran detergen (ml)

// lib/tsukamoto.js
export function hitungDetergenTsukamoto(vInput, wInput, xInput, yInput) {
  // pastikan angka
  const v = Number(vInput);
  const w = Number(wInput);
  const x = Number(xInput);
  const y = Number(yInput);

  // =========================
  // 1) FUNGSI KEANGGOTAAN (sesuai PDF)
  // =========================

  // Berat (v)
  const muBeratRingan = (v) => {
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

  // Warna (w)
  const muWarnaGelap = (w) => {
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

  // Tingkat kotor (x)
  const muKotorRingan = (x) => {
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

  // Ketebalan (y)
  const muTebalTipis = (y) => {
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
  // 2) HITUNG µ UNTUK INPUT
  // =========================
  const berat = {
    ringan: muBeratRingan(v),
    sedang: muBeratSedang(v),
    berat: muBeratBerat(v),
  };

  const warna = {
    gelap: muWarnaGelap(w),
    sedang: muWarnaSedang(w),
    terang: muWarnaTerang(w),
  };

  const kotor = {
    ringan: muKotorRingan(x),
    sedang: muKotorSedang(x),
    berat: muKotorBerat(x),
  };

  const tebal = {
    tipis: muTebalTipis(y),
    sedang: muTebalSedang(y),
    tebal: muTebalTebal(y),
  };

  // =========================
  // 3) RULE GENERATOR (81 rules) — setiap rule: {b,w,k,t,out}
  // Jika kamu ingin 100% sesuai lampiran, ganti fungsi tentukanOutput dengan array rule tetap.
  // =========================
  const kategoriBerat = ["ringan", "sedang", "berat"];
  const kategoriWarna = ["gelap", "sedang", "terang"];
  const kategoriKotor = ["ringan", "sedang", "berat"];
  const kategoriTebal = ["tipis", "sedang", "tebal"];

  const tentukanOutput = (b, wv, k, t) => {
    // logika sederhana (bisa diganti dengan lampiran)
    let skor = 0;
    if (b === "sedang") skor += 1;
    if (b === "berat") skor += 2;
    if (wv === "sedang") skor += 1;
    if (wv === "terang") skor += 2;
    if (k === "sedang") skor += 1;
    if (k === "berat") skor += 2;
    if (t === "sedang") skor += 1;
    if (t === "tebal") skor += 2;
    if (skor <= 2) return "sedikit";
    if (skor <= 5) return "sedang";
    return "banyak";
  };

  const rules = [];
  for (const b of kategoriBerat) {
    for (const wv of kategoriWarna) {
      for (const k of kategoriKotor) {
        for (const t of kategoriTebal) {
          rules.push({
            b,
            w: wv,
            k,
            t,
            out: tentukanOutput(b, wv, k, t),
          });
        }
      }
    }
  }
  // rules.length seharusnya 81

  // =========================
  // 4) Fungsi z (invers) sesuai PDF
  // =========================
  const zSedikit = (alpha) => 70 - 40 * alpha; // 30..70 turun
  const zBanyak = (alpha) => 70 + 40 * alpha; // 70..110 naik
  const zSedangNaik = (alpha) => 50 + 20 * alpha; // 50..70
  const zSedangTurun = (alpha) => 90 - 20 * alpha; // 70..90

  // =========================
  // 5) Inferensi & Defuzzifikasi
  // =========================
  let atas = 0;
  let bawah = 0;
  const ruleDetail = [];

  rules.forEach((rule, idx) => {
    const alpha = Math.min(
      berat[rule.b] ?? 0,
      warna[rule.w] ?? 0,
      kotor[rule.k] ?? 0,
      tebal[rule.t] ?? 0,
    );

    if (!(alpha > 0)) return; // skip rule yang tidak aktif

    let z;
    if (rule.out === "sedikit") {
      z = zSedikit(alpha);
    } else if (rule.out === "banyak") {
      z = zBanyak(alpha);
    } else {
      // untuk "sedang" kita ambil sisi naik jika kondisi cenderung ke rendah,
      // atau sisi turun kalau cenderung ke tinggi. Simpel: rata-rata dua sisi.
      const z1 = zSedangNaik(alpha);
      const z2 = zSedangTurun(alpha);
      z = (z1 + z2) / 2;
    }

    atas += alpha * z;
    bawah += alpha;

    ruleDetail.push({
      ruleNo: idx + 1,
      IF: { berat: rule.b, warna: rule.w, kotor: rule.k, tebal: rule.t },
      out: rule.out,
      alpha: Number(alpha.toFixed(3)),
      z: Number(z.toFixed(3)),
    });
  });

  const hasil = bawah > 0 ? atas / bawah : 0;

  return {
    input: { berat: v, warna: w, kotor: x, tebal: y },
    mu: { berat, warna, kotor, tebal },
    hasil: Number(hasil.toFixed(3)),
    atas: Number(atas.toFixed(3)),
    bawah: Number(bawah.toFixed(3)),
    ruleDetail, // semua rule aktif dengan alpha dan z
  };
}
