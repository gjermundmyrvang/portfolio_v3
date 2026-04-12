import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-auto py-4 text-sm text-center text-gray-500">
      <nav className="flex justify-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </footer>
  );
}
