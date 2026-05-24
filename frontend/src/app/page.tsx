import Link from "next/link";
import "@/styles/app/home.css";

export default function Home() {
  return (
    <div className="home-page">
      <main className="home-main">
        <h1>Welcome to MedManager</h1>
        <p>Your comprehensive hospital suite management system.</p>
        <Link href="/patients" className="start-button">
          Go to Patients
        </Link>
      </main>
    </div>
  );
}
