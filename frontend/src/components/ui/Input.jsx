import styles from "./Input.module.css";

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <input
        className={`${styles.input} ${error ? styles.errorInput : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}