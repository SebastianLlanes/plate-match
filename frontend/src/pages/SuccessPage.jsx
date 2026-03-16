import { useSearchParams, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import styles from "./SuccessPage.module.css";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>

        <h2 className={styles.title}>
          {type === "found"
            ? "¡Gracias por reportar la patente!"
            : "Reporte registrado"}
        </h2>

        <p className={styles.message}>
          {type === "found"
            ? "Avisaremos al dueño en cuanto lo encontremos en el sistema. Si hace match, recibirás sus datos de contacto."
            : "Tu reporte está activo. Si alguien cargó o carga la patente en el sistema, te conectamos de inmediato."}
        </p>

        <p className={styles.hint}>
          Podés hacer seguimiento desde tu dashboard.
        </p>

        <div className={styles.actions}>
          <Link to="/dashboard">
            <Button>Ver mis reportes</Button>
          </Link>

          <Link to="/">
            <Button variant="secondary">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}