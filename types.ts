
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  demoUrl: string;
  githubUrl?: string;
  category: 'Web Development' | 'UI Design' | 'Mobile App' | 'Data Science';
  isVisible: boolean;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  clientName?: string;
  companyName?: string;
  text: string;
  rating: number; // 1-5
  isVisible: boolean;
  isFeatured: boolean;
  updatedAt?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'read' | 'unread';
  submittedAt: string;
}

export interface AdminStats {
  totalProjects: number;
  totalTestimonials: number;
  unreadMessages: number;
  lastLogin: string;
}
