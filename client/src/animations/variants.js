// Framer Motion Animation Variants for DevFlow UI

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.99,
    transition: {
      duration: 0.25,
    },
  },
};

export const cardHoverVariants = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)',
  },
  hover: {
    scale: 1.025,
    boxShadow: '0px 20px 45px rgba(99, 102, 241, 0.25)',
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 22,
    },
  },
};

export const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0px 8px 25px rgba(99, 102, 241, 0.4)',
    transition: { type: 'spring', stiffness: 400, damping: 12 },
  },
  tap: {
    scale: 0.95,
  },
};

export const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

export const itemFadeIn = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

export const containerVariants = containerStagger;
export const itemVariants = itemFadeIn;

export const floatVariant = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const pulseScale = {
  animate: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
