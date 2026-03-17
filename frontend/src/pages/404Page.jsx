import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>
        4<span className={styles.dot}>0</span>4
      </h1>
      <p className={styles.title}>Página no encontrada</p>
      <p className={styles.message}>
        La dirección que ingresaste no existe o fue movida.
      </p>
      <Button onClick={() => navigate("/")}>Volver al inicio</Button>
    </div>
  );
}
