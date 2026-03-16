import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}