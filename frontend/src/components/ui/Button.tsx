import type { ButtonHTMLAttributes, FC } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline';
};

export const Button: FC<ButtonProps> = ({ variant = 'default', className = '', children, ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium';
  const styles =
    variant === 'outline'
      ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
      : 'bg-indigo-600 text-white hover:bg-indigo-700';

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
