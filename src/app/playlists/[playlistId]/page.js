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
    return (
      <h1 className="text-(--accent) text-3xl font-bold px-6 py-10">
        Playlist not found
      </h1>
    );
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
    <main className="px-6 py-10 bg-(--bg) text-(--text) space-y-12">
      <section className="space-y-2 border-l-4 border-(--accent) pl-4">
        <h1 className="text-3xl font-bold text-(--accent)">{playlist.title}</h1>
        <p className="opacity-80">{playlist.description}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-(--accent)">Songs</h2>

        <ul className="space-y-4">
          {songsWithMeta.map((song) => (
            <li
              key={song.id}
              className="bg-(--card) border border-(--border) p-4 rounded-lg"
            >
              <p className="text-xl font-medium text-(--accent)">
                {song.trackName}
              </p>
              <p className="opacity-80 mb-2">{song.artist}</p>

              <iframe
                src={`https://open.spotify.com/embed/track/${song.spotify_url.split("/track/")[1]}`}
                width="300"
                height="80"
                allow="encrypted-media"
                className="rounded"
              ></iframe>

              {song.personal_comment && (
                <p className="mt-2 opacity-80">{song.personal_comment}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-(--accent)">Comments</h2>

        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-(--card) border border-(--border) p-4 rounded-lg"
            >
              <p className="mb-2">
                <span className="text-(--accent) font-medium">
                  {comment.name}
                </span>
                : {comment.comment}
                <span className="opacity-60 text-sm">
                  {" "}
                  • {new Date(comment.created_at).toLocaleString()}
                </span>
              </p>

              <div className="flex gap-4 items-start">
                <EditToggle>
                  <form action={handleEdit} className="space-y-2">
                    <input type="hidden" name="commentId" value={comment.id} />

                    <input
                      type="text"
                      name="newComment"
                      defaultValue={comment.comment}
                      maxLength={255}
                      required
                      className="bg-(--bg) border border-(--border) p-2 rounded w-full"
                    />

                    <button className="bg-(--accent) text-black px-3 py-1 rounded hover:opacity-90 transition">
                      Save
                    </button>
                  </form>
                </EditToggle>

                <form action={handleDelete}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <button className="text-red-400 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-(--accent)">Add Comment</h3>

        <form
          action={handleSubmit}
          className="space-y-4 bg-(--card) border border-(--border) p-4 rounded-lg"
        >
          <div className="flex flex-col gap-2">
            <label>Name</label>
            <input
              type="text"
              name="name"
              maxLength={255}
              required
              className="bg-(--bg) border border-(--border) p-2 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Comment</label>
            <input
              type="text"
              name="comment"
              maxLength={255}
              required
              className="bg-(--bg) border border-(--border) p-2 rounded"
            />
          </div>

          <button className="bg-(--accent) text-black px-4 py-2 rounded hover:opacity-90 transition">
            Submit
          </button>
        </form>
      </section>
    </main>
  );
}
