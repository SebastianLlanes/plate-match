import {
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { db, auth } from "./firebase";
 
export async function getMatchById(matchId) {
  const snap = await getDoc(doc(db, "matches", matchId));
 
  if (!snap.exists()) return null;
 
  return { id: snap.id, ...snap.data() };
}
 
export async function closeMatch(matchId) {
  const currentUser = auth.currentUser;
 
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
 
  const matchRef = doc(db, "matches", matchId);
 
  await runTransaction(db, async (transaction) => {
    const matchSnap = await transaction.get(matchRef);
 
    if (!matchSnap.exists()) {
      throw new Error("Match no existe.");
    }
 
    const matchData = matchSnap.data();
 
    if (matchData.status !== "active") {
      throw new Error("El match ya está cerrado.");
    }
 
    if (
      matchData.lostUserId !== currentUser.uid &&
      matchData.foundUserId !== currentUser.uid
    ) {
      throw new Error("No autorizado.");
    }
 
    const lostReportRef  = doc(db, "reports", matchData.lostReportId);
    const foundReportRef = doc(db, "reports", matchData.foundReportId);
 
    transaction.update(matchRef,       { status: "closed" });
    transaction.update(lostReportRef,  { status: "closed" });
    transaction.update(foundReportRef, { status: "closed" });
  });
}