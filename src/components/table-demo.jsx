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

export function TableDemo({ tableHead, tableRow }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableHead === undefined ? (
            <>
              <TableHead>Tanggal</TableHead>
              <TableHead>Berat (kg)</TableHead>
              <TableHead>Kotor</TableHead>
              <TableHead>Warna</TableHead>
              <TableHead>Hasil (ml)</TableHead>
            </>
          ) : (
            tableHead.map((head) => (
              <TableHead key={head.key}>{head.label}</TableHead>
            ))
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableRow === undefined
          ? invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
              </TableRow>
            ))
          : tableRow.map((row) => (
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
