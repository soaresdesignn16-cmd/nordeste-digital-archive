import { useEffect, useRef } from "react";
import VimeoPlayer from "@vimeo/player";

type Props = {
  videoId: string;
  hash?: string;
  /** Called the first time playback actually starts */
  onPlay?: () => void;
  /** Called whenever currentTime updates, in seconds */
  onTimeUpdate?: (seconds: number) => void;
  /** Called when video reaches the end */
  onEnded?: () => void;
};

/**
 * Stable Vimeo player. The iframe is mounted once and never re-created,
 * so playback never gets interrupted by parent re-renders.
 */
export function VSLPlayer({ videoId, hash, onPlay, onTimeUpdate, onEnded }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const playedOnceRef = useRef(false);

  // Keep latest callbacks in refs so we don't re-subscribe on every render
  const onPlayRef = useRef(onPlay);
  const onTimeRef = useRef(onTimeUpdate);
  const onEndedRef = useRef(onEnded);
  onPlayRef.current = onPlay;
  onTimeRef.current = onTimeUpdate;
  onEndedRef.current = onEnded;

  useEffect(() => {
    if (!containerRef.current) return;

    const player = new VimeoPlayer(containerRef.current, {
      id: Number(videoId),
      ...(hash ? { h: hash } : {}),
      responsive: true,
      autoplay: false,
      muted: false,
      playsinline: true,
      dnt: true,
    });
    playerRef.current = player;

    const handlePlay = () => {
      if (!playedOnceRef.current) {
        playedOnceRef.current = true;
        onPlayRef.current?.();
      }
    };
    const handleTime = (data: { seconds: number }) => {
      onTimeRef.current?.(data.seconds);
    };
    const handleEnded = () => {
      onEndedRef.current?.();
    };

    player.on("play", handlePlay);
    player.on("timeupdate", handleTime);
    player.on("ended", handleEnded);

    return () => {
      player.off("play", handlePlay);
      player.off("timeupdate", handleTime);
      player.off("ended", handleEnded);
      player.destroy().catch(() => {});
      playerRef.current = null;
    };
    // Mount once. videoId/hash are stable for this app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
    />
  );
}
