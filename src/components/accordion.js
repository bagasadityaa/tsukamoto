import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TableDemo } from "./table-demo";
import { BlockMath } from "react-katex";

export function AccordionMultiple({
  beratkain,
  ketebalanKain,
  handleHitung,
  warnaKain,
}) {
  // --- Tabel Fuzzifikasi ---
  const fuzzifikasiTableHead = [
    { label: "Variable", key: "variable" },
    { label: "Himpunan", key: "himpunan" },
    { label: "Rumus", key: "rumus" },
    { label: "Derajat Keanggotaan (μ)", key: "nilai" },
  ];

  const fuzzifikasiTableRow = [
    {
      id: 1,
      variable: "Warna (60)",
      himpunan: "Terang",
      rumus: "μTerang(60) = (60 - 0) / (100 - 0)",
      nilai: "0.60",
    },
    {
      id: 2,
      variable: "Ketebalan (6)",
      himpunan: "Tebal",
      rumus: "μTebal(6) = (6 - 0) / (10 - 0)",
      nilai: "0.60",
    },
    {
      id: 3,
      variable: "Berat (25)",
      himpunan: "Berat",
      rumus: "μBerat(25) = (25 - 0) / (30 - 0)",
      nilai: "0.83",
    },
  ];

  // --- Tabel Aturan (Rule Evaluation) ---
  const AturanTableHead = [
    { label: "Rule", key: "rule" },
    { label: "Kondisi", key: "kondisi" },
    { label: "α-Predikat (Min)", key: "a" },
  ];

  const AturanTableRow = [
    {
      id: 1,
      rule: "R8",
      kondisi: "Terang(0.6) AND Tebal(0.6) AND Berat(0.83)",
      a: "min(0.6, 0.6, 0.83) = 0.60",
    },
  ];

  // --- Tabel Nilai Z (Inference) ---
  const NilaiZTableHead = [
    { label: "Rule", key: "rulez" },
    { label: "Kategori Output", key: "output" },
    { label: "Rumus Z", key: "rumus_z" },
    { label: "Hasil z (ml)", key: "z" },
  ];

  const NilaiZTableRow = [
    {
      id: 1,
      rulez: "R8",
      output: "Banyak",
      rumus_z: "20 + 0.6(100 - 20)",
      z: "68.00",
    },
  ];
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["notifications"]}
    >
      <AccordionItem key="Fuzzifikasi" value="Fuzzifikasi">
        <AccordionTrigger>Fuzzifikasi 2</AccordionTrigger>
        <AccordionContent>
          <TableDemo
            tableHead={fuzzifikasiTableHead}
            tableRow={fuzzifikasiTableRow}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem key="Aturan" value="Aturan">
        <AccordionTrigger>Aturan & Nilai a</AccordionTrigger>
        <AccordionContent>
          <TableDemo tableHead={AturanTableHead} tableRow={AturanTableRow} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem key="Nilai" value="Nilai">
        <AccordionTrigger>Nilai z</AccordionTrigger>
        <AccordionContent>
          <TableDemo tableHead={NilaiZTableHead} tableRow={NilaiZTableRow} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem key="Defuzzifikasi" value="Defuzzifikasi">
        <AccordionTrigger>Defuzzifikasi</AccordionTrigger>
        <AccordionContent>
          <h1 className="text-lg font-semibold">Ditampilkan sebagai Rumus</h1>

          <BlockMath math="Z = \frac{\sum(\alpha \cdot z)}{\sum \alpha}" />

          <h1 className="text-lg font-semibold">Hasil</h1>

          <BlockMath math="Z = 79.9 \text{ ml}" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
