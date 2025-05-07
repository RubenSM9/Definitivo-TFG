// services/firebaseEmail.ts
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Asegúrate de que tienes exportado "db"

export async function createTaskAndSendEmail(taskTitle: string, taskDescription: string, userEmail: string) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      title: taskTitle,
      description: taskDescription,
      email: userEmail,
      createdAt: new Date(),
    });

    console.log("Tarea creada correctamente:", docRef.id);
    // Si tienes configurada la Extension de Firebase "Email on Firestore write", el email se enviará automáticamente al guardar esta tarea
  } catch (error) {
    console.error("Error creando la tarea:", error);
  }
}
