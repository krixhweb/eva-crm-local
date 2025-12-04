import { 
  useMotionValue, 
  useTransform, 
  useSpring, 
  useVelocity, 
  animate 
} from "framer-motion";

export function useKanbanCardAnimation() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const zIndex = useMotionValue(0);
  const scale = useMotionValue(1);
  
  // Initialize with a value matching Tailwind's 'shadow-sm' to prevent layout shift
  // shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
  const boxShadow = useMotionValue("0px 1px 2px 0px rgba(0,0,0,0.05)");

  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);
  
  // KDE Plasma-like wobble effect
  // We inverse the skew to create an inertia effect
  const skewXRaw = useTransform(velocityX, [-1000, 1000], [10, -10]);
  const skewYRaw = useTransform(velocityY, [-1000, 1000], [10, -10]);
  
  const springConfig = { stiffness: 400, damping: 15 };
  const skewX = useSpring(skewXRaw, springConfig);
  const skewY = useSpring(skewYRaw, springConfig);

  const onDragStart = () => {
    zIndex.set(50);
    animate(scale, 1.05, { duration: 0.2 });
    // Lift effect: deeper shadow (approx shadow-xl)
    animate(boxShadow, "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)", { duration: 0.2 });
  };

  const onDragEnd = () => {
    zIndex.set(0);
    animate(scale, 1, { duration: 0.2 });
    // Return to resting shadow
    animate(boxShadow, "0px 1px 2px 0px rgba(0,0,0,0.05)", { duration: 0.2 });
  };

  return {
    style: { x, y, zIndex, scale, skewX, skewY, boxShadow, cursor: "grab" },
    onDragStart,
    onDragEnd
  };
}