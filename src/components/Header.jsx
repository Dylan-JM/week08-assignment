import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-(--card) border-b border-(--border) px-6 py-4 flex items-center gap-6">
      <Link
        href="/"
        className="text-(--text) hover:text-(--accent) font-medium transition"
      >
        Home
      </Link>

      <Link
        href="/playlists"
        className="text-(--text) hover:text-(--accent) font-medium transition"
      >
        Playlists
      </Link>
    </nav>
  );
}
