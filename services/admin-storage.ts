import { getFirebaseApp } from './firebaseConfig';
import { 
  collection, doc, setDoc, deleteDoc, 
  query, orderBy, getCountFromServer, where, getFirestore, getDocs
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { Project, Testimonial, ContactSubmission, AdminStats } from '../types';
import { getSafeOptionalUrl, normalizeOptionalUrl } from '../utils/urls';

// Helpers
const getDB = () => getFirestore(getFirebaseApp());
const getAuthInstance = () => getAuth(getFirebaseApp());

// --- ADMIN PROJECTS ---
export const getAllProjects = async (): Promise<Project[]> => {
  const projectsRef = collection(getDB(), 'projects');
  const snapshot = await getDocs(projectsRef);

  const projects = snapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      technologies: data.technologies || [],
      demoUrl: getSafeOptionalUrl(data.demoUrl),
      githubUrl: getSafeOptionalUrl(data.githubUrl),
      category: data.category,
      isVisible: data.isVisible,
      updatedAt: data.updatedAt
    } as Project;
  });

  return projects.sort((a: Project, b: Project) => {
    const timeA = a.updatedAt || a.id;
    const timeB = b.updatedAt || b.id;
    return String(timeB).localeCompare(String(timeA));
  });
};

export const saveProject = async (project: Project): Promise<void> => {
  const projectRef = doc(getDB(), 'projects', project.id);
  const payload = {
    title: project.title,
    description: project.description,
    technologies: project.technologies,
    demoUrl: normalizeOptionalUrl(project.demoUrl),
    githubUrl: normalizeOptionalUrl(project.githubUrl),
    category: project.category,
    isVisible: project.isVisible,
    updatedAt: new Date().toISOString()
  };
  await setDoc(projectRef, payload, { merge: true });
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(getDB(), 'projects', id));
};

// --- ADMIN TESTIMONIALS ---
export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const ref = collection(getDB(), 'testimonials');
  const snapshot = await getDocs(ref);

  const testimonials = snapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: doc.id,
      clientName: data.clientName,
      companyName: data.companyName,
      text: data.text,
      rating: data.rating,
      isVisible: data.isVisible,
      isFeatured: data.isFeatured,
      updatedAt: data.updatedAt,
      avatarSeed: data.avatarSeed
    } as Testimonial;
  });

  return testimonials.sort((a: Testimonial, b: Testimonial) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    const timeA = a.updatedAt || a.id;
    const timeB = b.updatedAt || b.id;
    return String(timeB).localeCompare(String(timeA));
  });
};

export const saveTestimonial = async (item: Testimonial): Promise<void> => {
  const testimonialRef = doc(getDB(), 'testimonials', item.id);
  const payload = {
    clientName: item.clientName ?? null,
    companyName: item.companyName ?? null,
    text: item.text,
    rating: item.rating,
    isVisible: item.isVisible,
    isFeatured: item.isFeatured,
    updatedAt: new Date().toISOString(),
    avatarSeed: item.avatarSeed ?? null
  };
  await setDoc(testimonialRef, payload, { merge: true });
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await deleteDoc(doc(getDB(), 'testimonials', id));
};

// --- ADMIN MESSAGES ---
export const getMessages = async (): Promise<ContactSubmission[]> => {
  const ref = collection(getDB(), 'messages');
  const q = query(ref, orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: any) => {
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

export const markMessageRead = async (id: string): Promise<void> => {
  const ref = doc(getDB(), 'messages', id);
  await setDoc(ref, { status: 'read' }, { merge: true });
};

export const deleteMessage = async (id: string): Promise<void> => {
  await deleteDoc(doc(getDB(), 'messages', id));
};

// --- ADMIN STATS ---
export const getStats = async (): Promise<AdminStats> => {
  try {
    const db = getDB();
    const projectsColl = collection(db, 'projects');
    const testimonialsColl = collection(db, 'testimonials');
    const messagesColl = collection(db, 'messages');
    
    const pSnapshot = await getCountFromServer(projectsColl);
    const tSnapshot = await getCountFromServer(testimonialsColl);
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
    return { totalProjects: 0, totalTestimonials: 0, unreadMessages: 0, lastLogin: new Date().toISOString() };
  }
};

// --- AUTH ---
const userHasAdminClaim = async (user: NonNullable<ReturnType<typeof getAuthInstance>['currentUser']>): Promise<boolean> => {
  const token = await getIdTokenResult(user, true);
  return token.claims.admin === true;
};

export const loginUser = async (email: string, pass: string): Promise<boolean> => {
  try {
    const credential = await signInWithEmailAndPassword(getAuthInstance(), email, pass);
    const isAdmin = await userHasAdminClaim(credential.user);

    if (!isAdmin) {
      await signOut(getAuthInstance());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Login Error:", error);
    return false;
  }
};

export const logoutUser = async () => {
  await signOut(getAuthInstance());
};

export const checkSession = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuthInstance(), async (user: any) => {
      unsubscribe();

      if (!user) {
        resolve(false);
        return;
      }

      try {
        resolve(await userHasAdminClaim(user));
      } catch (error) {
        console.error('Admin claim check failed:', error);
        resolve(false);
      }
    });
  });
};
