import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db, auth } from "./firebase";
 
export async function createReport({
  plate,
  normalizedPlate,
  type,
  province,
  city,
  contact, // found: ingresado manualmente
  phone,   // lost: teléfono opcional
}) {
  // 🔐 1️⃣ Validación de usuario
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const userId = currentUser.uid;
  const userEmail = currentUser.email;

  // 🔒 VALIDACIONES DE DOMINIO
  if (!plate || !normalizedPlate || !type) {
    throw new Error("Datos incompletos.");
  }

  if (type !== "lost" && type !== "found") {
    throw new Error("Tipo inválido.");
  }

  if (type === "found" && !contact) {
    throw new Error("El contacto es obligatorio.");
  }

  if (type === "found" && (!province || !city)) {
    throw new Error("Ubicación incompleta.");
  }

  // Contacto resuelto según tipo:
  // - found: lo que ingresó manualmente
  // - lost:  email del auth + teléfono opcional
  const resolvedContact =
    type === "found"
      ? contact
      : phone?.trim()
        ? `${userEmail} / ${phone.trim()}`
        : userEmail;

  // 🔎 2️⃣ Verificar si ya existe match activo
  const existingMatchQuery = query(
    collection(db, "matches"),
    where("plateNormalized", "==", normalizedPlate),
    where("status", "==", "active"),
  );

  const existingMatch = await getDocs(existingMatchQuery);

  if (!existingMatch.empty) {
    return { matched: true, matchId: existingMatch.docs[0].id };
  }

  // Evitar duplicados activos del mismo usuario
  const duplicateQuery = query(
    collection(db, "reports"),
    where("plateNormalized", "==", normalizedPlate),
    where("userId", "==", userId),
    where("status", "==", "active"),
  );

  const duplicateSnapshot = await getDocs(duplicateQuery);

  if (!duplicateSnapshot.empty) {
    throw new Error("Ya tenés un reporte activo para esta patente.");
  }

  // 📝 3️⃣ Pre-generar ref del reporte (sin escribir aún)
  const reportRef = doc(collection(db, "reports"));

  const reportData = {
    userId,
    plate,
    plateNormalized: normalizedPlate,
    type,
    contact: resolvedContact,
    status: "active",
    createdAt: serverTimestamp(),
    ...(type === "found" && { province, city }),
  };

  // 🔄 4️⃣ Buscar reporte opuesto
  const oppositeType = type === "lost" ? "found" : "lost";

  const q = query(
    collection(db, "reports"),
    where("plateNormalized", "==", normalizedPlate),
    where("type", "==", oppositeType),
    where("status", "==", "active"),
  );

  const snapshot = await getDocs(q);

  // ✅ Sin match: guardar reporte y listo
  if (snapshot.empty) {
    await setDoc(reportRef, reportData);
    return { matched: false };
  }

  const matchedDoc = snapshot.docs[0];
  const matchedData = matchedDoc.data();

  // 🔒 5️⃣ Segunda verificación anti race-condition
  const existingMatchQuery2 = query(
    collection(db, "matches"),
    where("plateNormalized", "==", normalizedPlate),
    where("status", "==", "active"),
  );

  const existingMatchSnapshot2 = await getDocs(existingMatchQuery2);

  if (!existingMatchSnapshot2.empty) {
    return { matched: true, matchId: existingMatchSnapshot2.docs[0].id };
  }

  // 🤝 6️⃣ Crear report + match atómicamente
  const matchRef = doc(collection(db, "matches"));

  const contactLost = type === "lost" ? resolvedContact : matchedData.contact;
  const contactFound = type === "found" ? resolvedContact : matchedData.contact;

  await runTransaction(db, async (transaction) => {
    // Reporte nuevo entra en la transacción directamente como "matched"
    transaction.set(reportRef, {
      ...reportData,
      status: "matched",
      matchId: matchRef.id,
    });

    transaction.set(matchRef, {
      plateNormalized: normalizedPlate,
      lostReportId: type === "lost" ? reportRef.id : matchedDoc.id,
      foundReportId: type === "found" ? reportRef.id : matchedDoc.id,
      lostUserId: type === "lost" ? userId : matchedData.userId,
      foundUserId: type === "found" ? userId : matchedData.userId,
      contactLost, // contacto de quien perdió
      contactFound, // contacto de quien encontró
      province: type === "found" ? province : matchedData.province,
      city: type === "found" ? city : matchedData.city,
      status: "active",
      createdAt: serverTimestamp(),
    });

    transaction.update(doc(db, "reports", matchedDoc.id), {
      status: "matched",
      matchId: matchRef.id,
    });
  });
  
  await notifyMatch({
    plate: normalizedPlate,
    contactLost,
    contactFound,
    city: type === "found" ? city : matchedData.city,
    province: type === "found" ? province : matchedData.province,
  });
  return { matched: true, matchId: matchRef.id };
}


 
export async function getUserReports(userId) {
  const q = query(
    collection(db, "reports"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
 
  const snapshot = await getDocs(q);
 
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}
 
export function subscribeToUserReports(userId, callback) {
  const q = query(
    collection(db, "reports"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
 
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(reports);
  });
}
 
export async function closeReport(reportId) {
  await updateDoc(doc(db, "reports", reportId), { status: "closed" });
}

// Al final de reportsService.js
async function notifyMatch({ plate, contactLost, contactFound, city, province }) {
  try {
    await fetch("/api/notify-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plate, contactLost, contactFound, city, province }),
    });
  } catch (error) {
    // No bloqueamos el flujo si el email falla
    console.error("Error enviando notificación:", error);
  }
}