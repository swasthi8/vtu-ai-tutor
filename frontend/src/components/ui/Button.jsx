import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Button({ children, variant = 'primary', className, ...props }) {
  const base = 'rounded-2xl px-6 py-3 font-semibold shadow-lg';

  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white',
    ghost: 'bg-transparent border border-white/10 text-white',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -3 }}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
