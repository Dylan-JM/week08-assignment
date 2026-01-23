import EditToggle from "@/components/EditToggle";
import { db } from "@/utils/dbConnection";
import { revalidatePath } from "next/cache";
import fetch from "node-fetch";
import spotifyUrlInfo from "spotify-url-info";
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

  //Forms and Submitting form
  async function handleSubmit(formData) {
    "use server";
    console.log(formData);
    const formValues = {
      name: formData.get("name"),
      comment: formData.get("comment"),
    };

    db.query(
      `INSERT INTO comments_playlists (name, comment, playlist_id) VALUES ($1, $2, $3)`,
      [formValues.name, formValues.comment, playlistId],
    );

    revalidatePath(`/playlists/${playlistId}`);
  }

  const commentsQuery = await db.query(
    `SELECT * FROM comments_playlists WHERE playlist_id = $1 ORDER BY created_at ASC`,
    [playlistId],
  );

  const comments = commentsQuery.rows;

  async function handleDelete(formData) {
    "use server";

    const commentId = formData.get("commentId");

    await db.query(`DELETE FROM comments_playlists WHERE id = $1`, [commentId]);

    revalidatePath(`/playlists/${playlistId}`);
  }

  async function handleEdit(formData) {
    "use server";
    const commentId = formData.get("commentId");
    const newComment = formData.get("newComment");

    await db.query(`UPDATE comments_playlists SET comment = $1 WHERE id = $2`, [
      newComment,
      commentId,
    ]);
    revalidatePath(`/playlists/${playlistId}`);
  }

  return (
    <>
      <h1>{playlist.title}</h1>
      <p>{playlist.description}</p>

      <h2>Songs</h2>
      <ul>
        {songsWithMeta.map((song) => (
          <li key={song.id}>
            <p>{song.trackName}</p>
            <p>{song.artist}</p>
            <iframe
              src={`https://open.spotify.com/embed/track/${song.spotify_url.split("/track/")[1]}`}
              width="300"
              height="80"
              allow="encrypted-media"
            ></iframe>
            <p>{song.personal_comment}</p>
          </li>
        ))}
      </ul>

      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>
              {comment.name}: {comment.comment} at{" "}
              {new Date(comment.created_at).toLocaleString()}{" "}
            </p>
            <EditToggle>
              <form action={handleEdit}>
                <input type="hidden" name="commentId" value={comment.id} />
                <input
                  type="text"
                  name="newComment"
                  defaultValue={comment.comment}
                  maxLength={255}
                  required
                />
                <button>Save</button>
              </form>
            </EditToggle>
            <form action={handleDelete}>
              <input type="hidden" name="commentId" value={comment.id} />
              <button>Delete</button>
            </form>
          </li>
        ))}
      </ul>
      <form action={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" maxLength={255} required />
        <label htmlFor="comment">Comment: </label>
        <input type="text" name="comment" maxLength={255} required />
        <button>Submit</button>
      </form>
    </>
  );
}
