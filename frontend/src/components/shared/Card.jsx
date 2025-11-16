import clsx from 'clsx';

/**
 * Card Component
 * כרטיס מעוצב לתוכן
 */
function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={clsx(
        'bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8',
        'min-h-screen md:min-h-0',
        'animate-slide-in',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
