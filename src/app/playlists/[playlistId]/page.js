import { db } from "@/utils/dbConnection";
import fetch from "node-fetch";
import spotifyUrlInfo from "spotify-url-info";
import Image from "next/image";
const { getPreview } = spotifyUrlInfo(fetch);

export default async function PlaylistId({ params }) {
  const { playlistId } = await params;

  // Fetch playlist
  const playlistQuery = await db.query(
    `SELECT * FROM playlists WHERE id = $1`,
    [playlistId],
  );

  const playlist = playlistQuery.rows[0];

  if (!playlist) {
    return <h1>Playlist not found</h1>;
  }

  // Fetch songs
  const songsQuery = await db.query(
    `SELECT * FROM songs WHERE playlist_id = $1 ORDER BY song_order ASC`,
    [playlistId],
  );

  const songs = songsQuery.rows;

  // Fetch song metadata
  const songsWithMeta = await Promise.all(
    songs.map(async (song) => {
      const preview = await getPreview(song.spotify_url);

      return {
        ...song,
        trackName: preview.title,
        artist: preview.artist,
        image: preview.image,
        preview: preview.audio,
      };
    }),
  );

  return (
    <>
      <h1>{playlist.title}</h1>
      <p>{playlist.description}</p>

      <h2>Songs</h2>
      <ul>
        {songsWithMeta.map((song) => (
          <li key={song.id}>
            <Image
              src={song.image}
              alt={song.trackName}
              width={80}
              height={80}
            />
            <p>{song.trackName}</p>
            <p>{song.artist}</p>
            <audio controls src={song.preview}>
              Your browser does not support audio.
            </audio>
            <p>{song.personal_comment}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
