import { db } from "@/utils/dbConnection";
import fetch from "node-fetch";
import spotifyUrlInfo from "spotify-url-info";

const { getData } = spotifyUrlInfo(fetch);

export default async function PlaylistsPage({ params }) {
  const { rows } = await db.query(`SELECT * FROM playlists ORDER BY id ASC`);

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
      {playlistMetaData.map((playlist) => {
        return (
          <li key={playlist.id}>
            <h2>{playlist.title}</h2>{" "}
            <p>
              {playlist.image} {playlist.description}
            </p>
          </li>
        );
      })}
    </>
  );
}
