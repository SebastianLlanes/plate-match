import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { start, done } = useProgress();

  const handleLogout = async () => {
    start();
    await signOut(auth);
    done();
    navigate("/login");
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.avatar}>{initial}</div>

        <h2 className={styles.email}>{user?.email}</h2>

        <div className={styles.divider} />

        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>Cuenta</span>
          <span className={styles.infoValue}>
            {user?.providerData?.[0]?.providerId === "google.com"
              ? "Google"
              : "Email y contraseña"}
          </span>
        </div>

        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>Miembro desde</span>
          <span className={styles.infoValue}>
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </span>
        </div>

        <div className={styles.divider} />

        <button className={styles.logoutButton} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}