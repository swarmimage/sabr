import styles from "./PageTitle.module.scss";

/** Заголовок макета: тонкая белая строка + жирная жёлтая. */
export default function PageTitle({
  thin,
  bold,
}: {
  thin: string;
  bold: string;
}) {
  return (
    <h1 className={styles.title}>
      {thin}
      <b>{bold}</b>
    </h1>
  );
}
