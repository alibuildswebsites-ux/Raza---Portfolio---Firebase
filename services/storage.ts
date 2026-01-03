import { db, auth } from './firebaseConfig';
import { 
  collection, getDocs, doc, setDoc, deleteDoc, 
  addDoc, query, orderBy, getCountFromServer, where
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Project, Testimonial, ContactSubmission, AdminStats } from '../types';

// --- PROJECTS ---
export const getProjects = async (): Promise<Project[]> => {
  const projectsRef = collection(db, 'projects');
  // Order by 'dateCompleted'
  const q = query(projectsRef, orderBy('dateCompleted', 'desc')); 
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      technologies: data.technologies || [],
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      thumbnailUrl: data.thumbnailUrl,
      category: data.category,
      dateCompleted: data.dateCompleted,
      isVisible: data.isVisible
    } as Project;
  });
};

export const saveProject = async (project: Project): Promise<void> => {
  const projectRef = doc(db, 'projects', project.id);
  
  const payload = {
    title: project.title,
    description: project.description,
    technologies: project.technologies,
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    thumbnailUrl: project.thumbnailUrl,
    category: project.category,
    dateCompleted: project.dateCompleted,
    isVisible: project.isVisible,
    updatedAt: new Date().toISOString()
  };

  // Using setDoc with merge: true handles both creating new documents (with the provided ID)
  // and updating existing ones without overwriting missing fields (though we provide all fields here).
  await setDoc(projectRef, payload, { merge: true });
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'projects', id));
};

// --- TESTIMONIALS ---
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const ref = collection(db, 'testimonials');
  const q = query(ref, orderBy('dateReceived', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      clientName: data.clientName,
      companyName: data.companyName,
      text: data.text,
      photoUrl: data.photoUrl,
      rating: data.rating,
      dateReceived: data.dateReceived,
      isVisible: data.isVisible,
      isFeatured: data.isFeatured
    } as Testimonial;
  });
};

export const saveTestimonial = async (item: Testimonial): Promise<void> => {
  const testimonialRef = doc(db, 'testimonials', item.id);
  
  const payload = {
    clientName: item.clientName,
    companyName: item.companyName,
    text: item.text,
    photoUrl: item.photoUrl,
    rating: item.rating,
    dateReceived: item.dateReceived,
    isVisible: item.isVisible,
    isFeatured: item.isFeatured,
    updatedAt: new Date().toISOString()
  };

  await setDoc(testimonialRef, payload, { merge: true });
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'testimonials', id));
};

// --- MESSAGES ---
export const getMessages = async (): Promise<ContactSubmission[]> => {
  const ref = collection(db, 'messages');
  const q = query(ref, orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: data.status,
      submittedAt: data.submittedAt
    } as ContactSubmission;
  });
};

export const saveMessage = async (msg: Omit<ContactSubmission, 'id' | 'status' | 'submittedAt'>): Promise<void> => {
  // Use addDoc for messages to let Firestore generate the ID
  await addDoc(collection(db, 'messages'), {
    name: msg.name,
    email: msg.email,
    phone: msg.phone,
    message: msg.message,
    status: 'unread',
    submittedAt: new Date().toISOString()
  });
};

export const markMessageRead = async (id: string): Promise<void> => {
  const ref = doc(db, 'messages', id);
  await setDoc(ref, { status: 'read' }, { merge: true });
};

export const deleteMessage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'messages', id));
};

// --- ADMIN STATS ---
export const getStats = async (): Promise<AdminStats> => {
  try {
    const projectsColl = collection(db, 'projects');
    const testimonialsColl = collection(db, 'testimonials');
    const messagesColl = collection(db, 'messages');
    
    // Firestore aggregation queries
    const pSnapshot = await getCountFromServer(projectsColl);
    const tSnapshot = await getCountFromServer(testimonialsColl);
    
    // For unread messages, we need a query first
    const unreadQuery = query(messagesColl, where("status", "==", "unread"));
    const mSnapshot = await getCountFromServer(unreadQuery);

    return {
      totalProjects: pSnapshot.data().count,
      totalTestimonials: tSnapshot.data().count,
      unreadMessages: mSnapshot.data().count,
      lastLogin: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalProjects: 0,
      totalTestimonials: 0,
      unreadMessages: 0,
      lastLogin: new Date().toISOString()
    };
  }
};

// --- AUTH ---
export const loginUser = async (email: string, pass: string): Promise<boolean> => {
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    return true;
  } catch (error) {
    console.error("Login Error:", error);
    return false;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const checkSession = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};