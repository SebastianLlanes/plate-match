import { useEffect, useState } from "react";
import { useProgress } from "../../context/ProgressContext";
import styles from "./ProgressBar.module.css";

export default function ProgressBar() {
  const { active } = useProgress();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval;

    if (active) {
      setVisible(true);
      setWidth(0);

      // Arranca rápido y luego desacelera (nunca llega a 100 solo)
      setTimeout(() => setWidth(30), 50);
      setTimeout(() => setWidth(55), 300);
      setTimeout(() => setWidth(72), 700);
      setTimeout(() => setWidth(85), 1400);
      setTimeout(() => setWidth(100), 2500);
    } else {
      // Al terminar: completa al 100 y desaparece
      setWidth(110);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
      return () => clearTimeout(hideTimer);
    }

    return () => clearInterval(interval);
  }, [active]);

  if (!visible) return null;

  return (
    <div className={styles.track}>
      <div
        className={styles.bar}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}