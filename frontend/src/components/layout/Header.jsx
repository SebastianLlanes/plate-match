import { useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import styles from "./Header.module.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <Logo variant="full" size="md" />
        <p className={styles.catchphrase}>Alguien la tiene. Nosotros los conectamos.</p>
      </div>
    </header>
  );
}