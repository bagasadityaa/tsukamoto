"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function RiwayatPage() {
  const [data, setData] = useState([]);
  const [mounted, setMounted] = useState(false);

  const ambilData = async () => {
    try {
      const response = await getDocs(collection(db, "data"));

      const hasil = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(hasil);
    } catch (err) {
      console.error("Error getting documents:", err);
    }
  };

  useEffect(() => {
    ambilData();
  }, []);

  useEffect(() => {
    setMounted(true);
  });
  if (!mounted) return null;
  if (typeof window !== "undefined") console.log("data", data);
  return (
    <div>
      <h1>Riwayat Page</h1>
      <div className="grid">
        {[...data]
          .sort((a, b) => {
            const dateA =
              a.res?.createdAt?.toDate?.() ?? new Date(a.res?.createdAt);
            const dateB =
              b.res?.createdAt?.toDate?.() ?? new Date(b.res?.createdAt);
            return dateB - dateA;
          })
          .map((r, i) => (
            <Card key={i} className="my-4 overflow-hidden">
              {/* Header */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Detail Pencucian
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.res?.createdAt?.toDate
                        ? r.res.createdAt.toDate().toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : new Date(r.res?.createdAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Takaran Detergen
                    </p>
                    <p className="text-xl font-semibold text-primary">
                      {r.res?.hasil} ml
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Info Grid */}
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Berat Kain", value: `${r.res?.beratKain} kg` },
                    {
                      label: "Ketebalan Kain",
                      value: `${r.res?.ketebalanKain} mm`,
                    },
                    { label: "Warna Kain", value: r.res?.warnaKain },
                    { label: "Tingkat Kotor", value: r.res?.kotorKain },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-muted/50 rounded-lg px-3 py-2"
                    >
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Rule Table */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Rule Aktif
                  </p>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-xs py-2 w-14">
                            Rule
                          </TableHead>
                          <TableHead className="text-xs py-2">IF</TableHead>
                          <TableHead className="text-xs py-2 w-20">
                            THEN
                          </TableHead>
                          <TableHead className="text-xs py-2 w-16 text-right">
                            α
                          </TableHead>
                          <TableHead className="text-xs py-2 w-16 text-right">
                            Z
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {r.res?.rules?.map((rule, j) => (
                          <TableRow key={j} className="text-xs">
                            <TableCell className="py-2 font-medium text-primary">
                              R{rule.ruleNo}
                            </TableCell>
                            <TableCell className="py-2 text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {rule.IF.berat}
                              </span>
                              {" · "}
                              <span className="font-medium text-foreground">
                                {rule.IF.warna}
                              </span>
                              {" · "}
                              <span className="font-medium text-foreground">
                                {rule.IF.kotor}
                              </span>
                              {" · "}
                              <span className="font-medium text-foreground">
                                {rule.IF.tebal}
                              </span>
                            </TableCell>
                            <TableCell className="py-2 capitalize">
                              {rule.out}
                            </TableCell>
                            <TableCell className="py-2 text-right">
                              {rule.alpha.toFixed(3)}
                            </TableCell>
                            <TableCell className="py-2 text-right">
                              {rule.z.toFixed(3)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
