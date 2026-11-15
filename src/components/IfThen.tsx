import type { Rule } from "@/lib/store/types";
import styles from "./IfThen.module.scss";

/** Правило «если — то» в две строки, как в макете. */
export default function IfThen({
  rule,
  labels,
}: {
  rule: Rule;
  labels: { if: string; then: string };
}) {
  return (
    <div className={styles.rule}>
      <div>
        <span className={styles.key}>{labels.if}</span>
        <span>{rule.if}</span>
      </div>
      <div>
        <span className={`${styles.key} ${styles.then}`}>{labels.then}</span>
        <span className={styles.action}>{rule.then}</span>
      </div>
    </div>
  );
}
