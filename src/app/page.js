import { db } from "@/utils/dbConnection";
import fetch from "node-fetch";
import spotifyUrlInfo from "spotify-url-info";
import Link from "next/link";

const { getData } = spotifyUrlInfo(fetch);

export default async function HomePage() {
  const recentQuery = await db.query(
    `SELECT * FROM playlists ORDER BY id DESC LIMIT 3`,
  );
  const recentRows = recentQuery.rows;

  const featuredQuery = await db.query(
    `SELECT * FROM playlists ORDER BY id ASC LIMIT 1`,
  );
  const featuredRow = featuredQuery.rows[0];

  const recent = await Promise.all(
    recentRows.map(async (playlist) => {
      try {
        const meta = await getData(playlist.spotify_url);
        return {
          ...playlist,
          title: meta.title,
        };
      } catch (err) {
        console.error("Failed to fetch metadata for:", playlist.spotify_url);
        return {
          ...playlist,
          title: "Untitled Playlist",
        };
      }
    }),
  );

  let featured = null;
  if (featuredRow) {
    const meta = await getData(featuredRow.spotify_url);
    featured = {
      ...featuredRow,
      title: meta.title || meta.name,
    };
  }

  return (
    <main className="px-6 py-10 bg-(--bg) text-(--text) space-y-16">
      <section className="space-y-4 border-l-4 border-(--accent) pl-4">
        <h1 className="text-4xl font-bold text-(--accent)">
          My Spotify Playlists
        </h1>

        <p className="text-lg opacity-90">
          A collection of playlists with track previews and user comments.
        </p>

        <Link
          href="/playlists"
          className="inline-block bg-(--accent) text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition"
        >
          Browse Playlists
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-(--accent)">
          Recently Added
        </h2>

        <ul className="space-y-3">
          {recent.map((playlist) => (
            <li
              key={playlist.id}
              className="bg-(--card) border border-(--border) p-4 rounded-lg hover:border-(--accent) transition"
            >
              <Link
                href={`/playlists/${playlist.id}`}
                className="text-(--accent) text-xl font-medium hover:underline"
              >
                {playlist.title}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/playlists"
          className="inline-block text-(--accent) hover:underline"
        >
          View All Playlists
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-(--accent)">
          Featured Playlist
        </h2>

        {featured && (
          <div className="bg-(--card) border border-(--border) p-5 rounded-lg hover:border-(--accent) transition">
            <h3 className="text-xl font-medium text-(--accent)">
              {featured.title}
            </h3>

            <Link
              href={`/playlists/${featured.id}`}
              className="text-(--accent) hover:underline"
            >
              View Playlist
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
