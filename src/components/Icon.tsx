const paths = {
  go: "M7 17L17 7M9 7h8v8",
  back: "M20 12H4M10 6l-6 6 6 6",
  up: "M12 20V4M6 10l6-6 6 6",
  close: "M6 6l12 12M18 6L6 18",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0",
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
