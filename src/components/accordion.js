import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TableDemo } from "./table-demo";
import { BlockMath } from "react-katex";

const items = [
  {
    value: "notifications",
    trigger: "Notification Settings",
    content:
      "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
  },
  {
    value: "privacy",
    trigger: "Privacy & Security",
    content:
      "Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.",
  },
  {
    value: "billing",
    trigger: "Billing & Subscription",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
];

export function AccordionMultiple() {
  const fuzzifikasiTableHead = [
    { label: "Berat", key: "berat" },
    { label: "Himpunan", key: "himpunan" },
    { label: "Nilai", key: "nilai" },
  ];
  const fuzzifikasiTableRow = [
    { id: 1, berat: "Ringan", himpunan: "Kotor", nilai: "0.33" },
    { id: 2, berat: "Sedang", himpunan: "Kotor", nilai: "0.66" },
    { id: 3, berat: "Berat", himpunan: "Kotor", nilai: "1" },
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
