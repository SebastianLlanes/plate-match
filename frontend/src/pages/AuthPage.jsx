import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 🔹 IMPORT CORRECTO
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const { user, authLoading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

 // 🔐 Protección: usuario ya autenticado
  if (authLoading) return null;

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

       navigate("/", {
        state: { authMessage: "Sesión iniciada correctamente." },
      });
    } catch (err) {
      setError("Hubo un problema. Verificá los datos e intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      navigate("/", {
        state: { authMessage: "Sesión iniciada correctamente." },
      });
    } catch (err) {
      setError("No se pudo iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
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
            minLength={6}
          />

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
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Registrate" : " Iniciá sesión"}
          </span>
        </p>
      </div>
    </div>
  );
}