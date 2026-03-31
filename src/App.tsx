/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Rocket, 
  Plane, 
  ChevronRight, 
  Box, 
  PenTool, 
  Terminal, 
  Users, 
  Home, 
  Folder, 
  Layout, 
  Briefcase,
  Mail,
  Send,
  CheckCircle2,
  ChevronLeft,
  ArrowLeft,
  ExternalLink,
  FileText,
  Target,
  BarChart3,
  Share2,
  Download,
  CheckCircle,
  Layers,
  PhoneCall,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type Project = {
  id: string;
  title: string;
  description: string;
  icon: typeof Rocket;
  imageUrl: string;
  simulationId: string;
  specs: { label: string; value: string }[];
  drawings: { title: string; code: string; imageUrl: string }[];
  methodology: string[];
  findings: string[];
};

type Model = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  type: '3d' | 'drawing';
};

type JourneyItem = {
  id: string;
  title: string;
  role: string;
  roleType: 'Engineer' | 'Researcher' | 'Member' | 'Apprentice' | 'Associate';
  period: string;
  location: string;
  category: 'technical' | 'leadership';
  points: string[];
};

// --- Data ---

const PROJECTS: Project[] = [
  {
    id: 'naca-0012',
    title: 'NACA 0012 Airfoil Analysis',
    description: 'Comprehensive CFD investigation of transonic flow characteristics and shock wave formation on a symmetric airfoil. Focused on characterizing the lift-to-drag ratio across variable Mach regimes.',
    icon: Plane,
    imageUrl: '#',  //ADD PIC
    simulationId: 'CFD-0012-TX',
    specs: [
      { label: 'MACH NUMBER', value: '0.75 - 1.2' },
      { label: 'REYNOLDS NUMBER', value: '2.88 × 10⁶' },
      { label: 'SOLVER USED', value: 'ANSYS Fluent' },
      { label: 'MESH DENSITY', value: '1.2M Cells' }
    ],
    drawings: [
      { title: 'ASSEMBLY VIEW', code: 'DWG-A101', imageUrl: 'https://picsum.photos/seed/dwg1/400/400' },
      { title: 'CROSS-SECTION A-A', code: 'DWG-A102', imageUrl: 'https://picsum.photos/seed/dwg2/400/400' },
      { title: 'STRUCTURAL WIREFRAME', code: 'DWG-S201', imageUrl: 'https://picsum.photos/seed/dwg3/400/400' },
      { title: 'CONTROL SURFACE DETAIL', code: 'DWG-D304', imageUrl: 'https://picsum.photos/seed/dwg4/400/400' }
    ],
    methodology: [
      'Generated high-fidelity C-mesh topology using Pointwise, ensuring Y+ < 1 for accurate boundary layer resolution.',
      'Implemented Spalart-Allmaras turbulence model for robust convergence in transonic regimes.',
      'Conducted grid independence study to validate numerical stability and spatial convergence.'
    ],
    findings: [
      'Identified critical Mach number at 0.72 before substantial wave drag increase.',
      'Mapped shock wave migration toward trailing edge at supersonic speeds.'
    ]
  },
  {
    id: 'heatsink',
    title: 'Modular Heatsink Rocket Engine',
    description: 'Thermal management & structural integrity using SolidWorks & ANSYS. Focused on reusable propulsion systems for suborbital vehicles.',
    icon: Rocket,
    imageUrl: 'https://picsum.photos/seed/rocket/800/600',
    simulationId: 'PROP-HS-042',
    specs: [
      { label: 'THRUST', value: '500N' },
      { label: 'BURN TIME', value: '30s' },
      { label: 'COOLING', value: 'Heatsink' },
      { label: 'MATERIAL', value: 'Inconel 718' }
    ],
    drawings: [
      { title: 'CHAMBER ASSEMBLY', code: 'DWG-C101', imageUrl: 'https://picsum.photos/seed/dwg5/400/400' },
      { title: 'NOZZLE PROFILE', code: 'DWG-N102', imageUrl: 'https://picsum.photos/seed/dwg6/400/400' },
      { title: 'INJECTOR PLATE', code: 'DWG-I201', imageUrl: 'https://picsum.photos/seed/dwg7/400/400' },
      { title: 'THERMAL SENSORS', code: 'DWG-T304', imageUrl: 'https://picsum.photos/seed/dwg8/400/400' }
    ],
    methodology: [
      'Optimized modular fin geometry for maximum heat dissipation during 30s steady-state burn.',
      'Conducted transient thermal analysis to predict soak-back temperatures post-shutdown.',
      'Validated structural safety factors under combined pressure and thermal loads.'
    ],
    findings: [
      'Achieved 15% reduction in peak chamber temperature via modular fin optimization.',
      'Confirmed structural integrity under 10G launch acceleration profiles.'
    ]
  }
];

const MODELS: Model[] = [
  {
    id: 'impeller',
    title: 'Centrifugal Impeller - Curved',
    subtitle: '3D MODEL • NX',
    imageUrl: '/public/Portfolio/Centrifugal_curved.png',  //ADD PIC
    type: '3d',
  },
  {
    id: 'gyroscope',
    title: 'Gyroscope Rotor',
    subtitle: 'DRAWING • NX',
    imageUrl: '/public/Portfolio/Drawings/gyro_rotor_drawing.png',  //ADD PIC
    type: 'drawing',
  },
  {
    id: 'impeller',
    title: 'Centrifugal Impeller - Splitters',
    subtitle: '3D MODEL • NX',
    imageUrl: '/public/Portfolio/Centrifugal_splitters.png',  //ADD PIC
    type: '3d',
  },
  {
    id: 'wheelrim',
    title: 'Wheelrim',
    subtitle: '3D MODEL • NX',
    imageUrl: '/public/Portfolio/Wheelrim-iso.png',  //ADD PIC
    type: '3d',
  },
  {
    id: 'gyroscope',
    title: 'Gyroscope',
    subtitle: '3D MODEL • NX',
    imageUrl: '/public/Portfolio/Gyroscope_assembly_pdubal_2.jpg',  //ADD PIC
    type: '3d',
  },
  {
    id: 'structural',
    title: 'Double Bearing Support',
    subtitle: 'DRAWING • NX',
    imageUrl: '/public/Portfolio/Drawings/doublebearing_assembly.png',  //ADD PIC
    type: 'drawing',
  },
];

const JOURNEY: JourneyItem[] = [
  {
    id: 'purpl',
    title: 'Purdue Propulsion Lab (PURPL)',
    role: 'Engineer',
    roleType: 'Engineer',
    period: 'Aug 2025 – Present',
    location: 'West Lafayette, IN',
    category: 'technical',
    points: [
      'Modular heatsink rocket engine architecture development',
      'Secondary Injection Thrust Vectoring Control research',
    ],
  },
  {
    id: 'purt',
    title: 'PURT-UAVs',
    role: 'Researcher',
    roleType: 'Researcher',
    period: 'Aug 2024 – Sept 2025',
    location: 'West Lafayette, IN',
    category: 'technical',
    points: [
      'Modeled structural components using SolidWorks and Fusion 360',
      'Optimized CFD parameters improving top speed by 33%',
    ],
  },
  {
    id: 'sec',
    title: 'Student Engineering Council',
    role: 'Member',
    roleType: 'Member',
    period: 'Jan 2024 – Present',
    location: 'West Lafayette, IN',
    category: 'leadership',
    points: [
      'Managed cross-disciplinary teams for college-wide career symposiums',
      'Coordinated with industry partners to secure project funding',
      'Currently organizing Purdue\'s first ever International Career Fair with 10+ Global Aerospace Companies',
    ],
  },
  {
    id: 'mml',
    title: 'Materials & Manufacturing Lab',
    role: 'Apprentice',
    roleType: 'Apprentice',
    period: 'Dec 2025 – Present',
    location: 'West Lafayette, IN',
    category: 'technical',
    points: [
      'Trained on operational procedures for Powder and Wire Feed Directed Energy Deposition systems and 5-axis CNC machines.',
      'Assisted in machine setup, calibration, and parameter selection for additive and subtractive manufacturing processes.',
      'Developed working knowledge of equipment capabilities, operability constraints, and post-processing workflows.',
    ],
  },
  {
    id: 'purpl-ec',
    title: 'PURPL - Event Coordinator Associate',
    role: 'Event Coordinator Associate',
    roleType: 'Associate',
    period: 'Aug 2023 – May 2024',
    location: 'West Lafayette, IN',
    category: 'leadership',
    points: [
      'Coordinated logistics for high-attendance campus events, ensuring seamless execution through collaboration with university departments.',
      'Driven member engagement and brand awareness by executing strategic campaigns and managing event budgets to maximize growth.',
    ],
  },
];

// --- Components ---

const SectionHeader = ({ title }: { title: string }) => (
  <div className="px-4 pt-10 pb-4">
    <h3 className="text-gray-400 text-xs font-bold leading-tight tracking-widest-extra uppercase">
      {title}
    </h3>
  </div>
);

const Carousel = ({ items }: { items: Model[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + items.length) % items.length);
  };

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-gray-800 border border-gray-700">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={items[currentIndex].imageUrl}
            alt={items[currentIndex].title}
            className="w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-lg font-bold">{items[currentIndex].title}</p>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider">{items[currentIndex].subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-primary transition-colors"
        onClick={() => paginate(-1)}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-primary transition-colors"
        onClick={() => paginate(1)}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center flex flex-col items-center gap-4"
      >
        <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h4 className="text-xl font-bold">Message Sent!</h4>
          <p className="text-[#92adc9] mt-2">Thank you for reaching out. I'll get back to you soon.</p>
        </div>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-primary font-bold uppercase tracking-widest text-xs hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`bg-gray-800/50 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm`}
          placeholder="Your Name"
        />
        {errors.name && <span className="text-[10px] text-red-500 ml-1">{errors.name}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm`}
          placeholder="your@email.com"
        />
        {errors.email && <span className="text-[10px] text-red-500 ml-1">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Message</label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`bg-gray-800/50 border ${errors.message ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm resize-none`}
          placeholder="How can I help you?"
        />
        {errors.message && <span className="text-[10px] text-red-500 ml-1">{errors.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {isSubmitting ? 'Sending...' : (
          <>
            Send Message
            <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
};

const ProjectDetail = ({ project, onBack }: { project: Project; onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[100] bg-background-dark overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto min-h-screen bg-background-dark border-x border-gray-800 relative">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-gray-800/50 px-4 sm:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="text-white hover:text-primary transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Project Details</h2>
          <button className="text-white hover:text-primary transition-colors">
            <Share2 size={24} />
          </button>
        </header>

        {/* Hero Image */}
        <div className="relative w-full aspect-[4/3] md:aspect-video overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
          <div className="absolute bottom-6 left-4 md:left-8">
            <div className="bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1.5 rounded text-[10px] font-bold text-primary tracking-widest uppercase">
              SIMULATION ID: {project.simulationId}
            </div>
          </div>
          {/* Decorative Sine Wave Overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 300">
            <path d="M0 150 Q 100 50, 200 150 T 400 150" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
            <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-gray-600" />
          </svg>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 pb-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-8 mb-6">{project.title}</h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-12">
              {project.description}
            </p>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                {/* Technical Specs */}
                <div className="mb-12">
                  <h4 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-6">Technical Specifications</h4>
                  <div className="grid grid-cols-2 border border-gray-800 rounded-xl overflow-hidden">
                    {project.specs.map((spec, i) => (
                      <div key={i} className={`p-5 border-gray-800 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''}`}>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">{spec.label}</p>
                        <p className="text-lg font-bold text-white">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Methodology */}
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="h-px w-8 bg-primary/50" />
                    <h4 className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Methodology</h4>
                  </div>
                  <div className="space-y-8">
                    {project.methodology.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-primary font-bold text-sm leading-none mt-1">0{i + 1}</span>
                        <p className="text-gray-400 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {/* Technical Drawings */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-px w-8 bg-primary/50" />
                      <h4 className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Technical Drawings</h4>
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{project.drawings.length} SHEETS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {project.drawings.map((drawing, i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="aspect-square bg-gray-900 rounded-lg border border-gray-800 overflow-hidden relative mb-2">
                          {/* Blueprint Grid Background */}
                          <div className="absolute inset-0 opacity-10" style={{ 
                            backgroundImage: 'linear-gradient(#137fec 1px, transparent 1px), linear-gradient(90deg, #137fec 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                          }} />
                          <img src={drawing.imageUrl} alt={drawing.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[10px] font-bold text-white uppercase leading-tight">{drawing.title}</p>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{drawing.code}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Findings */}
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="h-px w-8 bg-primary/50" />
                    <h4 className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Key Findings</h4>
                  </div>
                  <div className="space-y-4">
                    {project.findings.map((finding, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border-l-2 border-primary rounded-r-xl">
                        <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          <CheckCircle size={14} />
                        </div>
                        <p className="text-white text-sm font-medium leading-snug">{finding}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            {/* <div className="mt-12">
              <button className="w-full md:w-auto md:px-12 bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                <FileText size={18} />
                Download Full Report (PDF)
              </button>
            </div> */}

            {/* Footer */}
            <div className="mt-20 pt-8 border-t border-gray-800 text-center">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Engineering Archive © 2024</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [filter, setFilter] = useState<'all' | 'technical' | 'leadership'>('all');
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredJourney = JOURNEY.filter(item => 
    filter === 'all' || item.category === filter
  );

  // Scroll spy to update active section in bottom nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'cad-models', 'gallery', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans selection:bg-primary/30">
      <div className="max-w-5xl mx-auto pb-24 relative bg-background-dark min-h-screen">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-gray-800/50 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full border-2 border-primary overflow-hidden shrink-0">
              <img 
                src="#"  //ADD PIC
                alt="Parth K Dubal" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-widest hidden sm:block">Portfolio</h2>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'projects', label: 'Projects' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'experience', label: 'Journey' },
              { id: 'contact', label: 'Contact' },
            ].map((nav) => (
              <a 
                key={nav.id}
                href={`#${nav.id}`}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeSection === nav.id ? 'text-primary' : 'text-[#92adc9] hover:text-white'
                }`}
              >
                {nav.label}
              </a>
            ))}
          </nav>

          <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-transform" onClick={() => window.open('https://drive.google.com/file/d/1q9PFceM42K-O89J8sjC73Su9W7bNMt1s/view?usp=sharing', '_blank')}>
            Resume
          </button>
        </header>

        {/* Hero Section */}
        <section id="home" className="px-4 sm:px-8 pt-12 md:pt-20 pb-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[32px] sm:text-[48px] lg:text-[56px] font-bold leading-[1.1] tracking-tight"
            >
              Parth K Dubal, <br />
              <span className="text-primary">Aeronautical and Astronautical Engineering</span> at Purdue University.
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 border-l-2 border-primary pl-6"
            >
              <p className="text-[#92adc9] text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
                Build what doesn’t exist yet—and make it fly.
              </p>
            </motion.div>

            <div className="mt-8 flex flex-wrap gap-3 pl-6">
              {['SOLIDWORKS', 'NX', 'ANSYS', 'MATLAB', 'PYTHON', 'C++', 'GD&T'].map((skill, idx) => (
                <motion.span 
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="text-[11px] text-gray-400 font-bold uppercase tracking-widest bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        <div className="px-4 sm:px-8 py-4">
          <div className="h-px w-full bg-gray-800/50"></div>
        </div>

        {/* Engineering Projects */}
        <section id="projects" className="scroll-mt-24 px-4 sm:px-8">
          <SectionHeader title="Engineering Projects" />
          <div className="grid md:grid-cols-2 gap-4">
            {PROJECTS.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-gray-800/50 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                  <project.icon size={36} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{project.title}</p>
                  <p className="text-[#92adc9] text-sm mt-1 font-normal leading-snug">{project.description}</p>
                </div>
                <ChevronRight className="text-white/20 group-hover:text-primary transition-colors" size={24} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CAD Models */}
        <section id="cad-models" className="scroll-mt-24 px-4 sm:px-8">
          <SectionHeader title="CAD Models & Technical Drawings" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MODELS.map((model, idx) => (
              <motion.div 
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col gap-3 cursor-pointer"
              >
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 relative">
                  <img 
                    src={model.imageUrl} 
                    alt={model.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 size-10 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {model.type === '3d' ? <Box size={20} /> : <PenTool size={20} />}
                  </div>
                </div>
                <div className="px-1">
                  <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{model.title}</p>
                  <p className="text-[#92adc9] text-[10px] font-bold uppercase tracking-widest mt-1">{model.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gallery Carousel */}
        <section id="gallery" className="scroll-mt-24 px-4 sm:px-8">
          <SectionHeader title="Featured Gallery" />
          <div className="max-w-4xl mx-auto" >
            <Carousel items={MODELS} />
          </div>
        </section>

        {/* Professional Journey */}
        <section id="experience" className="scroll-mt-24 px-4 sm:px-8">
          <SectionHeader title="My Professional Journey" />
          
          <div className="mb-10">
            <div className="flex p-1 bg-white/5 rounded-2xl max-w-md">
              {(['all', 'technical', 'leadership'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 text-center py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                    filter === t ? 'bg-primary text-white shadow-lg' : 'text-[#92adc9] hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'All' : t === 'technical' ? 'Technical' : 'Leadership'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <AnimatePresence mode="popLayout">
              {filteredJourney.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col group p-6 rounded-3xl bg-white/[0.02] border border-transparent hover:border-gray-800 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border uppercase shrink-0 ${
                      item.category === 'technical' 
                        ? 'text-primary bg-primary/10 border-primary/20' 
                        : 'text-orange-400 bg-orange-400/10 border-orange-400/20'
                    }`}>
                      {item.roleType}
                    </span>
                  </div>
                  <p className="text-[#92adc9] text-xs mt-2 uppercase font-bold tracking-widest opacity-80">
                    {item.period} • {item.location}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {item.points.map((point, i) => (
                      <li key={i} className="text-gray-400 text-sm flex gap-4 leading-relaxed">
                        {item.category === 'technical' 
                          ? <Terminal size={16} className="text-primary shrink-0 mt-0.5" />
                          : <Users size={16} className="text-orange-400 shrink-0 mt-0.5" />
                        }
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24 pb-20 px-4 sm:px-8">
          <SectionHeader title="Get In Touch" />
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 border border-gray-800 rounded-[32px] p-8 sm:p-12">
              {/* <div className="grid md:grid-cols-2 gap-12"> */}
                <div>
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Mail size={32} />
                  </div>
                  <h4 className="text-3xl font-bold mb-4">Let's build something incredible.</h4>
                  <p className="text-[#92adc9] text-lg leading-relaxed">
                    I'm currently looking for new opportunities in aerospace engineering and propulsion systems. Whether you have a question or just want to say hi, my inbox is always open!
                  </p>
                  <div className="mt-8 flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Mail size={18} />
                      </div>
                      <span className="text-sm font-medium">kdubalparth@gmail.com</span>
                    </div>
                  </div>
                  <a href="https://www.linkedin.com/in/parthkdubal" target="_blank" rel="noopener noreferrer">
                  <div className="mt-8 flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                          <Linkedin size={18} />
                      </div>
                      <span className="text-sm font-medium">parthkdubal</span>
                    </div>
                  </div>
                  </a>
                </div>
                {/* <ContactForm /> */}
              {/* </div> */}
            </div>
          </div>
        </section>

        {/* Bottom Navigation (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-md border-t border-gray-800 z-50">
          <div className="flex justify-around items-center h-16 px-4">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'projects', label: 'Projects', icon: Folder },
              { id: 'gallery', label: 'Gallery', icon: Layout },
              { id: 'experience', label: 'Journey', icon: Briefcase },
              { id: 'contact', label: 'Contact', icon: Mail },
            ].map((nav) => (
              <a 
                key={nav.id}
                href={`#${nav.id}`}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  activeSection === nav.id ? 'text-primary' : 'text-[#92adc9] hover:text-white'
                }`}
              >
                <nav.icon size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{nav.label}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Project Detail View */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectDetail 
              project={selectedProject} 
              onBack={() => setSelectedProject(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
