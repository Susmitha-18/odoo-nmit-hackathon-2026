import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm disabled:bg-indigo-300',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-indigo-500 shadow-sm disabled:text-slate-400 disabled:bg-slate-100',
    outline: 'bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 disabled:text-indigo-300 disabled:border-indigo-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm disabled:bg-red-300',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500 disabled:text-slate-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    disabled ? 'cursor-not-allowed opacity-70' : ''
  } ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {Icon && <Icon className={`mr-2 ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'}`} />}
      {children}
    </button>
  );
};

export default Button;
