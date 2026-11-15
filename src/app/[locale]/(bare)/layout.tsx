import styles from "./layout.module.scss";

export default function BareLayout({ children }: LayoutProps<"/[locale]">) {
  return <main className={styles.bare}>{children}</main>;
}
