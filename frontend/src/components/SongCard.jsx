export default function SongCard({ song, index }) {
    return (
      <div className="song-card">
        <div className="song-num">{String(index + 1).padStart(2, '0')}</div>
        <div className="song-info">
          <div className="song-title">{song.title}</div>
          <div className="song-artist">{song.artist}</div>
          {song.reason && <div className="song-reason">{song.reason}</div>}
        </div>
        <div className="song-links">
          <a href={song.youtubeUrl} target="_blank" rel="noreferrer" className="link-btn yt">
            ▶ YT
          </a>
          <a href={song.spotifyUrl} target="_blank" rel="noreferrer" className="link-btn sp">
            ♪ SP
          </a>
        </div>
      </div>
    )
  }