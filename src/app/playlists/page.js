import { db } from "@/utils/dbConnection";
import fetch from "node-fetch";
import spotifyUrlInfo from "spotify-url-info";
import Link from "next/link";

const { getData } = spotifyUrlInfo(fetch);

export default async function PlaylistsPage({ searchParams }) {
  const params = await searchParams;
  const order = params.sort === "desc" ? "DESC" : "ASC";

  const { rows } = await db.query(
    `SELECT * FROM playlists ORDER BY id ${order}`,
  );

  const playlistMetaData = await Promise.all(
    rows.map(async (playlist) => {
      try {
        const meta = await getData(playlist.spotify_url);

        return {
          ...playlist,
          title: meta.title || "Unknown Playlist",
        };
      } catch (err) {
        console.error("Failed to fetch metadata for:", playlist.spotify_url);

        return {
          ...playlist,
          title: "Unknown Playlist",
        };
      }
    }),
  );

  return (
    <main className="px-6 py-10 bg-(--bg) text-(--text) space-y-10">
      <h1 className="text-4xl font-bold text-(--accent)">Playlists</h1>

      <div className="flex gap-4">
        <Link
          href="/playlists?sort=asc"
          className="text-(--accent) hover:underline"
        >
          Sort Oldest
        </Link>

        <Link
          href="/playlists?sort=desc"
          className="text-(--accent) hover:underline"
        >
          Sort Newest
        </Link>
      </div>

      <ul className="space-y-4">
        {playlistMetaData.map((playlist) => (
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

            <p className="text-sm opacity-80 mt-1">
              {playlist.image} {playlist.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
