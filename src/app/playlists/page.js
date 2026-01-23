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
      const meta = await getData(playlist.spotify_url);
      return {
        ...playlist, // database data id, description, spotify_url, etc.
        title: meta.title || meta.name, // extra data from the spotify_url
      };
    }),
  );

  return (
    <>
      <h1>Playlists</h1>
      <div>
        <Link href="/playlists?sort=asc">Sort Oldest</Link>
        <Link href="/playlists?sort=desc">Sort Newest</Link>
      </div>

      {playlistMetaData.map((playlist) => {
        return (
          <li key={playlist.id}>
            <Link href={`/playlists/${playlist.id}`}>{playlist.title}</Link>
            <p>
              {playlist.image} {playlist.description}
            </p>
          </li>
        );
      })}
    </>
  );
}
