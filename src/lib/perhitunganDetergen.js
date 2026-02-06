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
    return (10 - x) / 10;
  };
  const muTerang = (x) => {
    return x / 10;
  };

  const muTipis = muGelap;
  const muTebal = muTerang;

  const muRingan = (x) => {
    return (30 - x) / 30;
  };
  const muBerat = (x) => {
    return x / 30;
  };

  const zSedikit = (alpha) =>
    DETERJEN_MAX - (DETERJEN_MAX - DETERJEN_MIN) * alpha;
  const zBanyak = (alpha) =>
    DETERJEN_MIN + (DETERJEN_MAX - DETERJEN_MIN) * alpha;

  function hitungDeterjen(warna, ketebalan, berat) {
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

    const rulesRaw = [
      { name: "R1", alpha: Math.min(tebal, beratK), zType: "banyak" },
      { name: "R2", alpha: Math.min(tipis, ringan), zType: "sedikit" },
      { name: "R3", alpha: Math.min(gelap, beratK), zType: "banyak" },
      { name: "R4", alpha: Math.min(terang, ringan), zType: "sedikit" },
    ];

    let atas = 0;
    let bawah = 0;
    const ruleDetail = [];

    rulesRaw.forEach((r) => {
      const alpha = Number(r.alpha) || 0;

      let z = 0;
      if (alpha > 0) {
        z = r.zType === "sedikit" ? zSedikit(alpha) : zBanyak(alpha);
        atas += alpha * z;
        bawah += alpha;
      }

      ruleDetail.push({ ...r, alpha, z: +z.toFixed(2) });
    });

    const hasilValue = bawah === 0 ? 0 : +(atas / bawah).toFixed(2);

    return {
      hasil: hasilValue,
      rules: ruleDetail,

      fuzzifikasi: { gelap, terang, tipis, tebal, ringan, beratK },
    };
  }

  // ===== handleHitung: memanggil hitungDeterjen dan menyimpan ke state =====
  const handleHitung = () => {
    const data = hitungDeterjen(warnaKain, ketebalanKain, beratKain);

    setHasil(data.hasil);
    setRules(data.rules);
    setFuzzifikasi(data.fuzzifikasi);

    console.log("Rules with Z:", data.rules);
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
