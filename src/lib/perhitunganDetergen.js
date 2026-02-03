import { useState } from "react";

/**
 * usePerhitungan - custom hook untuk perhitungan Tsukamoto
 */
export default function usePerhitungan() {
  // konstanta / rentang
  const WARNA_MAX = 10;
  const TEBAL_MAX = 10;
  const BERAT_MAX = 30;
  const DETERJEN_MIN = 20;
  const DETERJEN_MAX = 100;

  // state input + hasil
  const [warnaKain, setWarnaKain] = useState("");
  const [ketebalanKain, setKetebalanKain] = useState("");
  const [beratKain, setBeratKain] = useState("");
  const [hasil, setHasil] = useState(null);
  const [rules, setRules] = useState([]);
  const [fuzzifikasi, setFuzzifikasi] = useState(null);

  // ===== fungsi keanggotaan =====
  // WARNA (0..10) - crossover 5
  const muGelap = (x) => {
    if (x <= 5) return (5 - x) / 5;
    return 0;
  };
  const muTerang = (x) => {
    if (x >= 5) return (x - 5) / 5;
    return 0;
  };

  const muTipis = muGelap;
  const muTebal = muTerang;

  const muRingan = (x) => {
    if (x <= 15) return Math.max(0, (15 - x) / 14); // contoh pembagian
    return 0;
  };
  const muBerat = (x) => {
    if (x >= 15) return Math.max(0, (x - 15) / 15);
    return 0;
  };

  // ===== fungsi output Tsukamoto (monoton) =====
  const zSedikit = (alpha) => {
    return 50 - alpha * 30;
  };

  const zBanyak = (alpha) => {
    // contoh: banyak di range 40..100 (atau sesuai kebutuhan)
    // lebih sederhana: linear antara min..max
    return 60 + alpha * (DETERJEN_MAX - 60);
  };

  function hitungDeterjen(warna, ketebalan, berat) {
    // pastikan angka
    const w = Number(warna);
    const k = Number(ketebalan);
    const b = Number(berat);

    // fuzzifikasi
    const gelap = muGelap(w);
    const terang = muTerang(w);
    const tipis = muTipis(k);
    const tebal = muTebal(k);
    const ringan = muRingan(b);
    const beratK = muBerat(b);

    // rules (alpha dan tipe z)
    const rulesRaw = [
      { name: "R1", alpha: Math.min(gelap, tipis, ringan), zType: "sedikit" },
      { name: "R2", alpha: Math.min(gelap, tebal, ringan), zType: "sedikit" },
      { name: "R3", alpha: Math.min(gelap, tipis, beratK), zType: "banyak" },
      { name: "R4", alpha: Math.min(gelap, tebal, beratK), zType: "banyak" },
      { name: "R5", alpha: Math.min(terang, tipis, ringan), zType: "sedikit" },
      { name: "R6", alpha: Math.min(terang, tebal, ringan), zType: "banyak" },
      { name: "R7", alpha: Math.min(terang, tipis, beratK), zType: "banyak" },
      { name: "R8", alpha: Math.min(terang, tebal, beratK), zType: "banyak" },
    ];

    // defuzzifikasi: hitung z per rule dan akumulasi
    let atas = 0;
    let bawah = 0;
    const ruleDetail = []; // kumpulan rule dengan nilai z
    rulesRaw.forEach((r) => {
      let z = 0;

      if (r.alpha > 0) {
        z = r.zType === "sedikit" ? zSedikit(r.alpha) : zBanyak(r.alpha);

        atas += r.alpha * z;
        bawah += r.alpha;
      }

      ruleDetail.push({ ...r, z });
    });

    const hasilValue = bawah === 0 ? 0 : Number((atas / bawah).toFixed(2));

    // return lengkap (bisa dipakai langsung)

    return {
      hasil: hasilValue,
      rulesRaw,
      rules: ruleDetail,
      fuzzifikasi: { gelap, terang, tipis, tebal, ringan, beratK },
    };
  }
  console.log("Rules with Z:", rules);

  // ===== handleHitung: memanggil hitungDeterjen dan menyimpan ke state =====
  const handleHitung = () => {
    const data = hitungDeterjen(warnaKain, ketebalanKain, beratKain);
    setHasil(data.hasil);
    setRules(data.rules);
    setFuzzifikasi(data.fuzzifikasi);
    return data; // opsional: kembalikan untuk immediate use
  };

  // return hook API — semua yang perlu diakses page
  return {
    // input state
    warnaKain,
    ketebalanKain,
    beratKain,
    setWarnaKain,
    setKetebalanKain,
    setBeratKain,

    // hasil / debug
    hasil,
    rules,
    fuzzifikasi,

    // aksi + konstanta
    handleHitung,
    WARNA_MAX,
    TEBAL_MAX,
    BERAT_MAX,
  };
}
