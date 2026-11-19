const paths = {
  go: "M7 17L17 7M9 7h8v8",
  back: "M20 12H4M10 6l-6 6 6 6",
  up: "M12 20V4M6 10l6-6 6 6",
  close: "M6 6l12 12M18 6L6 18",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0",
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert: "M12 3l9 16H3L12 3zM12 10v4M12 17h.01",
  timer: "M12 8v5l3 2M12 21a8 8 0 100-16 8 8 0 000 16zM9 2h6",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h13",
  beads:
    "M12 3a2 2 0 110 4 2 2 0 010-4zM5 10a2 2 0 110 4 2 2 0 010-4zM19 10a2 2 0 110 4 2 2 0 010-4zM12 17a2 2 0 110 4 2 2 0 010-4z",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  list: "M4 6h10M4 12h16M4 18h7",
  moon: "M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z",
  chat: "M4 5h16v11H8l-4 4V5z",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 018 0v3",
} as const;

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  size = 18,
}: {
  name: IconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
