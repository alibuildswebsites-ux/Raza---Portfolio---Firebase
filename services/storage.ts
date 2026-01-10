
import { getFirebaseApp } from './firebaseConfig';
import { 
  collection, getDocs, addDoc, getFirestore
} from 'firebase/firestore';
import { Project, Testimonial, ContactSubmission } from '../types';

// Helper to access lazy instances
const getDB = () => getFirestore(getFirebaseApp());

// --- PROJECTS (Public Read) ---
export const getProjects = async (): Promise<Project[]> => {
  const projectsRef = collection(getDB(), 'projects');
  const querySnapshot = await getDocs(projectsRef);
  
  const projects = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      technologies: data.technologies || [],
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      category: data.category,
      isVisible: data.isVisible,
      updatedAt: data.updatedAt
    } as Project;
  });

  return projects.sort((a, b) => {
    const timeA = a.updatedAt || '';
    const timeB = b.updatedAt || '';
    return timeB.localeCompare(timeA);
  });
};

// --- TESTIMONIALS (Public Read) ---
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const ref = collection(getDB(), 'testimonials');
  const snapshot = await getDocs(ref);

  const testimonials = snapshot.docs.map(doc => {
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

  return testimonials.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    const timeA = a.updatedAt || a.id;
    const timeB = b.updatedAt || b.id;
    return String(timeB).localeCompare(String(timeA));
  });
};

// --- MESSAGES (Public Write) ---
export const saveMessage = async (msg: Omit<ContactSubmission, 'id' | 'status' | 'submittedAt'>): Promise<void> => {
  await addDoc(collection(getDB(), 'messages'), {
    name: msg.name,
    email: msg.email,
    phone: msg.phone,
    message: msg.message,
    status: 'unread',
    submittedAt: new Date().toISOString()
  });
};
