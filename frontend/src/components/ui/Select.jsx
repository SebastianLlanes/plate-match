import styles from "./Select.module.css";

export default function Select({
  label,
  value,
  onChange,
  options,
  error,
}) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <select
        className={`${styles.select} ${error ? styles.errorSelect : ""}`}
        value={value}
        onChange={onChange}
      >
        <option value="">Seleccionar</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}