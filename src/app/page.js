import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        <h1>Sistem Penunjang keputusan</h1>
      </div>
      <div>
        <h2>Metode Tsukamoto</h2>
      </div>
      <Link href="/login" className="px-3 py-1 rounded bg-white text-black">
        Login
      </Link>
    </div>
  );
}
