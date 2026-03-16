import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../context/ProgressContext";
import { closeReport } from "../../services/reportsService";
import styles from "./ReportCard.module.css";

export default function ReportCard({ report }) {
  const { plate, type, status, province, city, id, matchId } = report;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { start, done } = useProgress();
  const [closing, setClosing] = useState(false);

  const typeLabel = type === "lost" ? "Perdida" : "Encontrada";
  const statusLabel = {
    active:  "Activo",
    matched: "¡Match!",
    closed:  "Cerrado",
  }[status] ?? status;

  async function handleClose() {
    if (closing) return;
    setClosing(true);
    start();
    try {
      await closeReport(id);
      done();
    } catch (e) {
      console.error(e);
      done();
      setClosing(false);
    }
  }

  function handleViewMatch() {
    sessionStorage.setItem("activeMatchId", matchId);
    navigate("/matches", { state: { matchId } });
  }

  return (
    <div className={`${styles.card} ${styles[status]}`}>
      <div className={styles.header}>
        <span className={styles.plate}>{plate}</span>
        <span className={styles.badge}>{typeLabel}</span>
      </div>

      {(city || province) && (
        <div className={styles.location}>
          {[city, province].filter(Boolean).join(", ")}
        </div>
      )}

      <div className={styles.status}>
        Estado: <strong>{statusLabel}</strong>
      </div>

      {status === "matched" && matchId && (
        <button className={styles.matchBtn} onClick={handleViewMatch}>
          Ver datos de contacto
        </button>
      )}

      {status === "active" && (
        <button
          className={styles.closeBtn}
          onClick={handleClose}
          disabled={closing}
        >
          {closing ? "Cerrando..." : "Cerrar reporte"}
        </button>
      )}
    </div>
  );
}