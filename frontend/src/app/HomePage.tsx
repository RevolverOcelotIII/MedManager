import Link from "next/link";
import { i18n } from "@/src/lib/i18n";
import "@/src/styles/app/home.css";

export default function Home() {
  return (
    <div className="home-page">
      <main className="home-main">
        <h1>{i18n.t("pages.home.title")}</h1>
        <p>{i18n.t("pages.home.subtitle")}</p>
        <Link href="/patients" className="start-button">
          {i18n.t("pages.home.go_to_patients")}
        </Link>
      </main>
    </div>
  );
}
