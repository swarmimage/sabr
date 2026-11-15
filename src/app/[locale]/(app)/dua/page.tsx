import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { getContent } from "@/content";
import { getDictionary, hasLocale } from "@/i18n/config";
import { pad } from "@/lib/format";
import ui from "@/styles/ui.module.scss";
import styles from "./page.module.scss";

export default async function DuaPage({ params }: PageProps<"/[locale]/dua">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { DUAS } = getContent(locale);

  return (
    <>
      <PageTitle thin={dict.dua.title[0]} bold={dict.dua.title[1]} />
      <p className={ui.lead}>{dict.dua.lead}</p>
      <div className={styles.grid}>
        {DUAS.map((dua, i) => (
          <article
            key={dua.h}
            className={`${ui.card} ${i === 1 ? ui.light : ""}`}
          >
            <span className={`${ui.tag} ${i === 1 ? "" : ui.tagAccent}`}>
              {pad(i + 1)} · {dua.h}
            </span>
            <div className={ui.ar} lang="ar">
              {dua.ar}
            </div>
            <span className={ui.translit}>{dua.tr}</span>
            <span>{dua.m}</span>
            <span className={ui.src}>{dua.s}</span>
          </article>
        ))}
      </div>
      <p className={ui.src}>{dict.common.sourceNote}</p>
    </>
  );
}
