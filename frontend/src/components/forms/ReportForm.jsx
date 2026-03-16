import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizePlate } from "../../utils/normalizePlate";
import { createReport } from "../../services/reportsService";
import { useProgress } from "../../context/ProgressContext";

import Input from "../ui/Input";
import Button from "../ui/Button";
import styles from "./ReportForm.module.css";

export default function ReportForm({ type }) {
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { start, done } = useProgress();

  const validate = () => {
    const newErrors = {};
    if (!plate.trim()) {
      newErrors.plate = "Ingresá la patente.";
    } else if (normalizePlate(plate).length < 6) {
      newErrors.plate = "La patente parece inválida.";
    }
    if (type === "found") {
      if (!province.trim()) newErrors.province = "Ingresá la provincia.";
      if (!city.trim()) newErrors.city = "Ingresá la ciudad donde la encontraste.";
      if (!contact.trim()) newErrors.contact = "Ingresá un medio de contacto.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    start();

    try {
      const normalizedPlate = normalizePlate(plate);

      const result = await createReport({
        plate,
        normalizedPlate,
        type,
        province: type === "found" ? province : null,
        city:     type === "found" ? city     : null,
        contact:  type === "found" ? contact  : null,
        phone:    type === "lost"  ? phone    : null,
      });

      done();

      if (result.matched) {
        sessionStorage.setItem("activeMatchId", result.matchId);
        navigate("/matches", { state: { matchId: result.matchId } });
      } else {
        navigate(`/success?type=${type}`);
      }
    } catch (err) {
      console.error(err);
      done();
      setErrors({ general: err.message || "Ocurrió un error al enviar el reporte." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>
        {type === "lost"
          ? "Reportar patente perdida"
          : "Reportar patente encontrada"}
      </h2>

      {type === "lost" && (
        <p className={styles.hint}>
          Tu email de cuenta se compartirá automáticamente si hay un match.
          Podés sumar tu teléfono para facilitar el contacto.
        </p>
      )}

      <Input
        label="Patente"
        value={plate}
        onChange={(e) => setPlate(e.target.value.toUpperCase())}
        placeholder="ABC123"
        error={errors.plate}
      />

      {type === "lost" && (
        <Input
          label="Teléfono (opcional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 3492 123456"
          type="tel"
          error={errors.phone}
        />
      )}

      {type === "found" && (
        <>
          <Input
            label="Provincia"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="Ej: Santa Fe"
            error={errors.province}
          />
          <Input
            label="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ej: San Carlos Centro"
            error={errors.city}
          />
          <Input
            label="Email o Teléfono de contacto"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Para que el dueño pueda comunicarse"
            error={errors.contact}
          />
        </>
      )}

      {errors.general && (
        <p className={styles.error}>{errors.general}</p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}