import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { subscribeToUserReports } from "../services/reportsService";
import ReportCard from "../components/dashboard/ReportCard";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserReports(user.uid, (data) => {
      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const activeReports  = reports.filter(r => r.status === "active");
  const matchedReports = reports.filter(r => r.status === "matched");
  const closedReports  = reports.filter(r => r.status === "closed");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mis reportes</h1>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span>Activos</span>
          <strong>{activeReports.length}</strong>
        </div>
        <div className={`${styles.summaryCard} ${matchedReports.length > 0 ? styles.summaryMatch : ""}`}>
          <span>Con match</span>
          <strong>{matchedReports.length}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span>Cerrados</span>
          <strong>{closedReports.length}</strong>
        </div>
      </div>

      {loading ? (
        <SkeletonList />
      ) : (
        <>
          {matchedReports.length > 0 && (
            <Section title="🎉 ¡Tenés matches! Coordiná la devolución">
              {matchedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </Section>
          )}

          {activeReports.length > 0 && (
            <Section title="Buscando coincidencia">
              {activeReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </Section>
          )}

          {closedReports.length > 0 && (
            <Section title="Cerrados">
              {closedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </Section>
          )}

          {reports.length === 0 && (
            <div className={styles.empty}>
              <p>No tenés reportes todavía.</p>
              <p>¿Perdiste o encontraste una patente?</p>
            </div>
          )}
        </>
      )}

      <button className={styles.fab} onClick={() => navigate("/")}>
        +
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function SkeletonList() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </>
  );
}