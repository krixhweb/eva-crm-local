
// --- Transition Settings ---
export const transition = {
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  subtle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  },
  wobble: {
    type: "spring" as const,
    stiffness: 500,
    damping: 15,
    mass: 1.2,
  }
};

// --- Variants ---

// Container for staggering children
export const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.01
    }
  }
};

// Standard Fade In
export const fadeIn: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } }
};

// Slide Up with Fade (Cards, List Items)
export const slideUp: any = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: transition.subtle
  }
};

// Scale In (Modals, Badges)
export const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: transition.subtle
  }
};

// Hover Effects
export const hoverScale = {
  scale: 1.01,
  y: -2,
  transition: { duration: 0.2 }
};

// Wobble Effect for Kanban Drops or Attention
export const wobbleEffect: any = {
  initial: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.02, 0.98, 1],
    rotate: [0, 1, -1, 0],
    transition: transition.wobble
  }
};
