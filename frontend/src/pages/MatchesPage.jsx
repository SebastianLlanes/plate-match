import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { closeMatch } from "../services/matchesService";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import styles from "./MatchesPage.module.css";

export default function MatchesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { start, done } = useProgress();

  const matchId =
    location.state?.matchId ||
    sessionStorage.getItem("activeMatchId");

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!matchId) {
      navigate("/");
      return;
    }

    start();

    const fetchMatch = async () => {
      try {
        const snap = await getDoc(doc(db, "matches", matchId));

        if (!snap.exists()) {
          sessionStorage.removeItem("activeMatchId");
          done();
          navigate("/");
          return;
        }

        const data = snap.data();

        if (data.status === "closed") {
          sessionStorage.removeItem("activeMatchId");
          done();
          navigate("/");
          return;
        }

        setMatch(data);
        setLoading(false);
        done();
      } catch (error) {
        console.error(error);
        done();
        navigate("/");
      }
    };

    fetchMatch();
  }, [matchId, navigate]);

  useEffect(() => {
    if (!match) return;
    const timer = setTimeout(() => setShowContent(true), 1200);
    return () => clearTimeout(timer);
  }, [match]);

  const myRole = match?.lostUserId === user?.uid ? "lost" : "found";
  const otherContact =
    myRole === "lost" ? match?.contactFound : match?.contactLost;
  const otherRole =
    myRole === "lost" ? "quien la encontró" : "el dueño";

  const handleCopy = async () => {
    if (!otherContact) return;
    await navigator.clipboard.writeText(otherContact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = async () => {
    if (closing) return;
    setClosing(true);
    start();

    try {
      await closeMatch(matchId);
      sessionStorage.removeItem("activeMatchId");
      done();
      navigate("/");
    } catch (error) {
      console.error("Error closing match:", error);
      done();
      setClosing(false);
    }
  };

  if (loading || !match || !showContent) {
    return (
      <div className={styles.loader}>
        <div className={styles.loaderTrack}>
          <div className={styles.loaderBar} />
        </div>
        <p>Buscando coincidencia...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} ${styles.fadeIn}`}>
        <h2 className={styles.title}>¡Coincidencia encontrada!</h2>

        <div className={styles.badge}>MATCH CONFIRMADO</div>

        <div className={styles.infoBlock}>
          <span className={styles.label}>Patente</span>
          <span className={styles.value}>{match.plateNormalized}</span>
        </div>

        {match.city && match.province && (
          <div className={styles.infoBlock}>
            <span className={styles.label}>Ubicación</span>
            <span className={styles.value}>
              {match.city}, {match.province}
            </span>
          </div>
        )}

        <p className={styles.instruction}>
          Comunicate con {otherRole} para coordinar la devolución.
        </p>

        <div className={styles.contactBox}>
          {otherContact}
        </div>

        <button onClick={handleCopy} className={styles.primaryButton}>
          {copied ? "Copiado ✔" : "Copiar contacto"}
        </button>

        <button
          onClick={handleClose}
          disabled={closing}
          className={styles.secondaryButton}
        >
          {closing ? "Cerrando..." : "Ya coordiné la devolución"}
        </button>
      </div>
    </div>
  );
}