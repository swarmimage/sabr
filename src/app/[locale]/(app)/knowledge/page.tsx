import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { getContent } from "@/content";
import Tabs from "@/features/knowledge/Tabs";
import { getDictionary, hasLocale } from "@/i18n/config";
import { pad } from "@/lib/format";
import ui from "@/styles/ui.module.scss";
import styles from "./page.module.scss";

export default async function KnowledgePage({
  params,
}: PageProps<"/[locale]/knowledge">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const k = dict.knowledge;
  const { MYTHS, STORIES, PRACTICES } = getContent(locale);

  return (
    <>
      <PageTitle thin={k.title[0]} bold={k.title[1]} />
      <Tabs labels={k.tabs}>
        {[
          MYTHS.map(([myth, fact], i) => (
            <article key={myth} className={ui.card}>
              <span className={ui.tag}>
                {k.myth} {pad(i + 1)}
              </span>
              <span className={styles.myth}>{myth}</span>
              <div className={ui.hr} />
              <span className={`${ui.tag} ${ui.tagAccent}`}>{k.fact}</span>
              <span>{fact}</span>
            </article>
          )),
          STORIES.map((story, i) => (
            <article
              key={story.h}
              className={`${ui.card} ${i % 2 === 0 ? ui.light : ""}`}
            >
              <span className={ui.tag}>
                {k.story} · {story.s}
              </span>
              <h2 className={styles.storyTitle}>{story.h}</h2>
              <span>{story.p}</span>
              <span className={styles.lesson}>{story.l}</span>
            </article>
          )),
          PRACTICES.map(([title, text], i) => (
            <article key={title} className={`${ui.card} ${styles.practice}`}>
              <span className={styles.number}>{pad(i + 1)}</span>
              <div>
                <h2>{title}</h2>
                <span className={`${ui.muted} ${ui.small}`}>{text}</span>
              </div>
            </article>
          )),
        ]}
      </Tabs>
      <p className={ui.src}>{dict.common.sourceNote}</p>
    </>
  );
}
