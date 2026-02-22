"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function TableDemo({ data }) {
  const [mounted, setMounted] = useState(false);
  const tableHead = [
    { key: "tanggal", label: "Tanggal" },
    { key: "beratKain", label: "Berat (kg)" },
    { key: "ketebalanKain", label: "Tebal (mm)" },
    { key: "warnaKain", label: "Warna" },
    { key: "kotorKain", label: "Kotor" },
    { key: "hasil", label: "Hasil (ml)" },
  ];
  const formatDate = (value) => {
    if (!value) return "-";

    const d =
      typeof value?.toDate === "function" ? value.toDate() : new Date(value);

    return d.toLocaleDateString("id-ID");
  };

  const tableRow = data.map((item, index) => ({
    id: index,
    tanggal: formatDate(item.res.createdAt),
    beratKain: item.res.beratKain,
    ketebalanKain: item.res.ketebalanKain,
    warnaKain: item.res.warnaKain,
    kotorKain: item.res.kotorKain,
    hasil: Number(item.res.hasil).toFixed(2),
  }));
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableHead.map((head) => (
            <TableHead key={head.key}>{head.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {tableRow.map((row) => (
          <TableRow key={row.id}>
            {tableHead.map((head) => (
              <TableCell key={head.key}>{row[head.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
