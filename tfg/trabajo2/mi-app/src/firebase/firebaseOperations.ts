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
import { v4 as uuidv4 } from 'uuid';

// Types
export interface UserData {
  displayName: string;
  email: string;
  photoURL: string | null;
  role: 'god' | 'gratis' | 'pro' | 'premium';
  settings: {
    theme: string;
    notifications: boolean;
  };
  isBlocked?: boolean;
  proStartDate?: string;
  premiumStartDate?: string;
}

export interface CardData {
  id?: string;
  nombre: string;
  prioridad: string;
  tareas: Task[];
  userId: string;
  compartidoCon?: string[];
}

export interface Task {
  id: string;
  titulo: string;
  nombre: string;
  descripcion: string;
  completada: boolean;
  subtareas: Subtask[];
  createdAt: string;
  updatedAt?: string;
  imagen?: string;
  fechaLimite?: string;
  prioridad: string;
  asignado?: string;
  extraFiles?: string[];
  horasDedicadas?: number;
  newHoursInput?: string;
}

export interface Subtask {
  id: string;
  titulo: string;
  nombre: string;
  completada: boolean;
  completedByUserId?: string | null;
  comments: Comment[];
  createdAt: string;
  updatedAt?: string;
  prioridad: string;
  fechaLimite?: string;
}

export interface Comment {
  id: string;
  texto: string;
  userId: string;
  createdAt: string;
  fecha: string;
}

// Operaciones de usuario
export const createUserProfile = async (userId: string, userData: UserData) => {
  try {
    const dataToSet: any = {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Set start dates based on initial role
    if (userData.role === 'pro') {
      dataToSet.proStartDate = new Date().toISOString();
    } else if (userData.role === 'premium') {
      dataToSet.premiumStartDate = new Date().toISOString();
    }

    await setDoc(doc(db, 'users', userId), dataToSet);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log(`Fetched profile for userId ${userId}:`, userData); // <-- Add this log
      return userData as UserData;
    }
    console.log(`Profile not found for userId: ${userId}`); // <-- Add this log
    return null;
  } catch (error) {
    console.error(`Error getting user profile for userId ${userId}:`, error); // <-- Modify this log
    throw error;
  }
};

// Operaciones de tarjetas
export const createCard = async (userId: string, cardData: Omit<CardData, 'userId'>) => {
  try {
    const cardId = uuidv4();
    await setDoc(doc(db, 'cards', cardId), {
      ...cardData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return cardId;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

export const getUserCards = async (userId: string): Promise<CardData[]> => {
  try {
    const cardsQuery = query(collection(db, 'cards'), where('userId', '==', userId));
    const querySnapshot = await getDocs(cardsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as unknown as CardData));
  } catch (error) {
    console.error('Error getting user cards:', error);
    throw error;
  }
};

export const updateCard = async (cardId: string, cardData: Partial<CardData>) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      ...cardData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const addEmailsToCardSharedWith = async (cardId: string, emails: string[]) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      compartidoCon: arrayUnion(...emails),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error adding emails to sharedWith for card ${cardId}:`, error);
    throw error;
  }
};

export const deleteCard = async (cardId: string): Promise<void> => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await deleteDoc(cardRef);
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

// Operaciones de tareas
export const addTask = async (cardId: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      tareas: arrayUnion({
        id: uuidv4(),
        ...taskData,
        createdAt: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (cardId: string, taskId: string, taskData: Partial<Task>) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data() as CardData;
      const tasks = card.tareas.map((task: Task) => 
        task.id === taskId ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task
      );
      await updateDoc(cardRef, { tareas: tasks });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (cardId: string, taskId: string): Promise<void> => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data() as CardData;
      const taskToRemove = card.tareas.find((task: Task) => task.id === taskId);
      if (taskToRemove) {
        await updateDoc(cardRef, {
          tareas: arrayRemove(taskToRemove)
        });
      }
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Operaciones de subtareas
export const addSubtask = async (cardId: string, taskId: string, subtaskData: Omit<Subtask, 'id' | 'createdAt'>) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data() as CardData;
      const tareas = card.tareas.map((tarea: Task) => {
        if (tarea.id === taskId) {
          return {
            ...tarea,
            subtareas: [...(tarea.subtareas || []), {
              id: uuidv4(),
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
    console.error('Error adding subtask:', error);
    throw error;
  }
};

export const updateSubtask = async (cardId: string, taskId: string, subtaskId: string, subtaskData: Partial<Subtask>) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data() as CardData;
      const tareas = card.tareas.map((tarea: Task) => {
        if (tarea.id === taskId) {
          return {
            ...tarea,
            subtareas: tarea.subtareas.map((subtarea: Subtask) =>
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
    console.error('Error updating subtask:', error);
    throw error;
  }
};

export const deleteSubtask = async (cardId: string, taskId: string, subtaskId: string): Promise<void> => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data() as CardData;
      const tareas = card.tareas.map((tarea: Task) => {
        if (tarea.id === taskId) {
          return {
            ...tarea,
            subtareas: tarea.subtareas.filter((subtarea: Subtask) => subtarea.id !== subtaskId)
          };
        }
        return tarea;
      });
      await updateDoc(cardRef, { tareas });
    }
  } catch (error) {
    console.error('Error deleting subtask:', error);
    throw error;
  }
};

// Operaciones de comentarios
export const addComment = async (cardId: string, taskId: string, subtaskId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardDoc = await getDoc(cardRef);
    if (cardDoc.exists()) {
      const card = cardDoc.data() as CardData;
      const tasks = card.tareas.map((task: Task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtareas: task.subtareas.map((subtask: Subtask) => {
              if (subtask.id === subtaskId) {
                return {
                  ...subtask,
                  comments: [...(subtask.comments || []), {
                    id: uuidv4(),
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
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Obtener todos los correos de usuarios registrados
export const getAllUserEmails = async (): Promise<string[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => doc.data().email).filter(Boolean);
  } catch (error) {
    console.error('Error getting user emails:', error);
    throw error;
  }
};

// Obtener tarjetas compartidas con un correo
export const getCardsSharedWithEmail = async (email: string) => {
  try {
    const cardsQuery = query(collection(db, 'cards'), where('compartidoCon', 'array-contains', email));
    const querySnapshot = await getDocs(cardsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting shared cards:', error);
    throw error;
  }
};

// Obtener una tarjeta por su ID
export const getCardById = async (cardId: string) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    const cardSnap = await getDoc(cardRef);
    if (cardSnap.exists()) {
      return { id: cardSnap.id, ...cardSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting card by ID:', error);
    throw error;
  }
};

// Operaciones de bloqueo/desbloqueo de usuario
export const updateUserBlockedStatus = async (userId: string, isBlocked: boolean) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBlocked: isBlocked
    });
  } catch (error) {
    console.error(`Error updating block status for user ${userId}:`, error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, role: UserData['role']) => {
  try {
    const userRef = doc(db, 'users', userId);
    const updateData: any = {
      role: role,
      updatedAt: new Date().toISOString(),
    };

    // Manage start dates based on the new role
    if (role === 'pro') {
      updateData.proStartDate = new Date().toISOString();
      updateData.premiumStartDate = null; // Remove premium start date
    } else if (role === 'premium') {
      updateData.premiumStartDate = new Date().toISOString();
      updateData.proStartDate = null; // Remove pro start date
    } else {
      // If role is neither pro nor premium, remove both start dates
      updateData.proStartDate = null;
      updateData.premiumStartDate = null;
    }

    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    throw error;
  }
}; 