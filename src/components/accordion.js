import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TableDemo } from "./table-demo";
import { BlockMath } from "react-katex";

export function AccordionMultiple({ beratPakaian, tingkatKotor, cfg }) {
  const nilaBerat =
    (beratPakaian - cfg.berat.mid) / (cfg.berat.max - cfg.berat.mid);

  const nilaKotor =
    (tingkatKotor - cfg.kotor.mid) / (cfg.kotor.max - cfg.kotor.mid);
  const fuzzifikasiTableHead = [
    { label: "Variable", key: "variable" },
    { label: "Himpunan", key: "himpunan" },
    { label: "Rumus", key: "rumus" },
    { label: "Nilai", key: "nilai" },
  ];
  const fuzzifikasiTableRow = [
    {
      id: 1,
      variable: `Berat (${beratPakaian} kg)`,
      himpunan: "Berat",
      rumus: `μ(${beratPakaian}) = (${beratPakaian} - ${cfg.berat.mid}) / (${cfg.berat.max} - ${cfg.berat.mid})`,
      nilai: nilaBerat,
    },
    {
      id: 2,
      variable: `Kotor (${tingkatKotor})`,
      himpunan: "Tinggi",
      rumus: `μ(${tingkatKotor}) = (${tingkatKotor} - ${cfg.kotor.mid}) / (${cfg.kotor.max} - ${cfg.kotor.mid})`,
      nilai: nilaKotor,
    },
  ];
  const AturanTableHead = [
    { label: "Rule", key: "rule" },
    { label: "Kondisi", key: "kondisi" },
    { label: "α", key: "a" },
  ];
  const AturanTableRow = [
    { id: 1, rule: "R1", kondisi: "BErat A Kotor Tinggi", a: "0.33" },
  ];
  const NilaiZTableHead = [
    { label: "Rule", key: "rulez" },
    { label: "Output", key: "output" },
    { label: "z (ml)", key: "z" },
  ];
  const NilaiZTableRow = [{ id: 1, rulez: "R1", output: "Banyak", z: "79.9" }];
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
