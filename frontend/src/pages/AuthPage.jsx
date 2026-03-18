import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPage.module.css";

const PASSWORD_RULES = [
  { label: "Mínimo 6 caracteres", test: (p) => p.length >= 6 },
  { label: "Una mayúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Un número", test: (p) => /[0-9]/.test(p) },
  { label: "Un carácter especial", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getFirebaseError(code) {
  const errors = {
    "auth/invalid-email": "El email no es válido.",
    "auth/user-not-found": "No existe una cuenta con ese email.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese email.",
    "auth/weak-password": "La contraseña es demasiado débil.",
    "auth/too-many-requests": "Demasiados intentos. Intentá más tarde.",
    "auth/invalid-credential": "Email o contraseña incorrectos.",
  };
  return errors[code] || "Hubo un problema. Verificá los datos e intentá nuevamente.";
}

export default function AuthPage() {
  const { user, authLoading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  if (authLoading) return null;
  if (user) return <Navigate to="/" replace />;

  const passwordValid = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLogin) {
      if (!passwordValid) {
        setError("La contraseña no cumple los requisitos.");
        return;
      }
      if (!passwordsMatch) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/", { state: { authMessage: "Sesión iniciada correctamente." } });
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/", { state: { authMessage: "Sesión iniciada correctamente." } });
    } catch (err) {
      setError("No se pudo iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isLogin ? "Bienvenido nuevamente" : "Unite a la comunidad"}
        </h1>

        <p className={styles.subtitle}>
          {isLogin
            ? "Ingresá para continuar ayudando."
            : "Creá tu cuenta y ayudá a conectar personas."}
        </p>

        <button
          className={styles.googleButton}
          onClick={handleGoogle}
          disabled={loading}
        >
          Continuar con Google
        </button>

        <div className={styles.divider}>
          <span>o</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Indicador de requisitos — solo en registro */}
          {!isLogin && password.length > 0 && (
            <ul className={styles.rules}>
              {PASSWORD_RULES.map((rule) => (
                <li
                  key={rule.label}
                  className={rule.test(password) ? styles.ruleOk : styles.ruleFail}
                >
                  {rule.test(password) ? "✓" : "✗"} {rule.label}
                </li>
              ))}
            </ul>
          )}

          {/* Confirmación de contraseña — solo en registro */}
          {!isLogin && (
            <input
              type="password"
              placeholder="Repetí la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={
                confirmPassword.length > 0 && !passwordsMatch
                  ? styles.inputError
                  : ""
              }
            />
          )}

          {!isLogin && confirmPassword.length > 0 && !passwordsMatch && (
            <p className={styles.errorInline}>Las contraseñas no coinciden.</p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? "Procesando..."
              : isLogin
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </button>
        </form>

        <p className={styles.toggle}>
          {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}
          <span onClick={handleToggle}>
            {isLogin ? " Registrate" : " Iniciá sesión"}
          </span>
        </p>
      </div>
    </div>
  );
}