import styles from "./AuthLoading.module.css";

export default function AuthLoading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div className={styles.bar} />
      </div>
      <div className={styles.logo}>TuLogo</div>
    </div>
  );
}