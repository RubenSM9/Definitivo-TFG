import { db } from './firebaseConfig';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from 'firebase/firestore';

// Operaciones de usuario
export const createUserProfile = async (userId: string, userData: any) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al crear perfil de usuario:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    throw error;
  }
};

// Operaciones de tarjetas
export const createCard = async (userId: string, cardData: any) => {
  try {
    const cardId = crypto.randomUUID();
    await setDoc(doc(db, 'cards', cardId), {
      ...cardData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return cardId;
  } catch (error) {
    console.error('Error al crear tarjeta:', error);
    throw error;
  }
};

export const getUserCards = async (userId: string) => {
  try {
    const cardsQuery = query(collection(db, 'cards'), where('userId', '==', userId));
    const querySnapshot = await getDocs(cardsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener tarjetas del usuario:', error);
    throw error;
  }
};

export const updateCard = async (cardId: string, cardData: any) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      ...cardData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar tarjeta:', error);
    throw error;
  }
};

export const deleteCard = async (cardId: string) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await deleteDoc(cardRef);
  } catch (error) {
    console.error('Error al eliminar tarjeta:', error);
    throw error;
  }
};

// Operaciones de tareas
export const addTask = async (cardId: string, taskData: any) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      tareas: arrayUnion({
        id: crypto.randomUUID(),
        ...taskData,
        createdAt: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Error al añadir tarea:', error);
    throw error;
  }
};

export const updateTask = async (cardId: string, taskId: string, taskData: any) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data();
      const tasks = card.tareas.map((task: any) => 
        task.id === taskId ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task
      );
      await updateDoc(cardRef, { tareas: tasks });
    }
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    throw error;
  }
};

export const deleteTask = async (cardId: string, taskId: string) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data();
      const taskToRemove = card.tareas.find((task: any) => task.id === taskId);
      if (taskToRemove) {
        await updateDoc(cardRef, {
          tareas: arrayRemove(taskToRemove)
        });
      }
    }
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    throw error;
  }
};

// Operaciones de subtareas
export const addSubtask = async (cardId: string, taskId: string, subtaskData: any) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data();
      const tareas = card.tareas.map((tarea: any) => {
        if (tarea.id === taskId) {
          return {
            ...tarea,
            subtareas: [...(tarea.subtareas || []), {
              id: crypto.randomUUID(),
              ...subtaskData,
              createdAt: new Date().toISOString()
            }]
          };
        }
        return tarea;
      });
      await updateDoc(cardRef, { tareas });
    }
  } catch (error) {
    console.error('Error al añadir subtarea:', error);
    throw error;
  }
};

export const updateSubtask = async (cardId: string, taskId: string, subtaskId: string, subtaskData: any) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data();
      const tareas = card.tareas.map((tarea: any) => {
        if (tarea.id === taskId) {
          return {
            ...tarea,
            subtareas: tarea.subtareas.map((subtarea: any) =>
              subtarea.id === subtaskId
                ? { ...subtarea, ...subtaskData, updatedAt: new Date().toISOString() }
                : subtarea
            )
          };
        }
        return tarea;
      });
      await updateDoc(cardRef, { tareas });
    }
  } catch (error) {
    console.error('Error al actualizar subtarea:', error);
    throw error;
  }
};

export const deleteSubtask = async (cardId: string, taskId: string, subtaskId: string) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data();
      const tareas = card.tareas.map((tarea: any) => {
        if (tarea.id === taskId) {
          return {
            ...tarea,
            subtareas: tarea.subtareas.filter((subtarea: any) => subtarea.id !== subtaskId)
          };
        }
        return tarea;
      });
      await updateDoc(cardRef, { tareas });
    }
  } catch (error) {
    console.error('Error al eliminar subtarea:', error);
    throw error;
  }
};

// Operaciones de comentarios
export const addComment = async (cardId: string, taskId: string, subtaskId: string, commentData: any) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data();
      const tasks = card.tareas.map((task: any) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtareas: task.subtareas.map((subtask: any) => {
              if (subtask.id === subtaskId) {
                return {
                  ...subtask,
                  comments: [...(subtask.comments || []), {
                    id: crypto.randomUUID(),
                    ...commentData,
                    createdAt: new Date().toISOString()
                  }]
                };
              }
              return subtask;
            })
          };
        }
        return task;
      });
      await updateDoc(cardRef, { tareas: tasks });
    }
  } catch (error) {
    console.error('Error al añadir comentario:', error);
    throw error;
  }
};

// Obtener todos los correos de usuarios registrados
export const getAllUserEmails = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => doc.data().email).filter(Boolean);
  } catch (error) {
    console.error('Error al obtener los correos de usuarios:', error);
    throw error;
  }
}

// Obtener tarjetas compartidas con un correo
export const getCardsSharedWithEmail = async (email) => {
  try {
    const cardsQuery = query(collection(db, 'cards'), where('compartidoCon', 'array-contains', email));
    const querySnapshot = await getDocs(cardsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener tarjetas compartidas:', error);
    throw error;
  }
};

// Obtener una tarjeta por su ID
export const getCardById = async (cardId) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardSnap = await getDoc(cardRef);
    if (cardSnap.exists()) {
      return { id: cardSnap.id, ...cardSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener la tarjeta por ID:', error);
    throw error;
  }
}; 