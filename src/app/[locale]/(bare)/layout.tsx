import SeenMark from "@/components/SeenMark";
import styles from "./layout.module.scss";

export default function BareLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <main className={styles.bare}>
      <SeenMark />
      {children}
    </main>
  );
}
