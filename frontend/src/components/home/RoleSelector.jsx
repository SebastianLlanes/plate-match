import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import styles from "./RoleSelector.module.css";

export default function RoleSelector() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        ¿Qué querés hacer?
      </h1>

      <p className={styles.subtitle}>
        Elegí una opción para continuar
      </p>

      <div className={styles.buttons}>
        <Button onClick={() => navigate("/report?type=lost")}>
          Perdí mi patente
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate("/report?type=found")}
        >
          Encontré una patente
        </Button>
      </div>
    </div>
  );
}