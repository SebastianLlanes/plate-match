import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./BottomNav.module.css";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Inicio",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: "/report?type=lost",
    label: "Reportar",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
        <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
      </svg>
    ),
    isAction: true, // botón central destacado
  },
  {
    to: "/dashboard",
    label: "Mis reportes",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "Perfil",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ to, label, icon, isAction }) => {
        const path = to.split("?")[0];
        const isActive = location.pathname === path;

        if (isAction) {
          return (
            <NavLink key={to} to={to} className={styles.actionItem}>
              <div className={styles.actionButton}>
                {icon(false)}
              </div>
              <span className={styles.actionLabel}>{label}</span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={to}
            to={to}
            className={`${styles.item} ${isActive ? styles.active : ""}`}
          >
            <div className={styles.icon}>{icon(isActive)}</div>
            <span className={styles.label}>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}