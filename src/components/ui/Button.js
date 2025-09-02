// src/components/ui/Button.js
import React from 'react';
import Icons from './Icons';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  icon = null,
  iconPosition = 'left',
  className = '',
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size variants
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };

  // Color variants
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white shadow-sm hover:shadow-md',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white shadow-sm hover:shadow-md',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white shadow-sm hover:shadow-md',
    
    // Outline variants
    'outline-primary': 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:ring-indigo-500',
    'outline-secondary': 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500',
    'outline-success': 'border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500',
    'outline-danger': 'border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500',
    'outline-warning': 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 focus:ring-yellow-500',
    'outline-info': 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-500',
    
    // Ghost variants
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500',
    'ghost-primary': 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 focus:ring-indigo-500',
    'ghost-success': 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500',
    'ghost-danger': 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500',
    
    // Link variant
    link: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline hover:no-underline focus:ring-indigo-500',
  };

  // Loading spinner component
  const LoadingSpinner = ({ size }) => {
    const spinnerSize = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-5 h-5',
    };

    return (
      <svg className={`animate-spin ${spinnerSize[size]}`} fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  };

  // Render icon
  const renderIcon = (position) => {
    if (loading && position === 'left') {
      return <LoadingSpinner size={size} />;
    }
    
    if (icon && iconPosition === position) {
      return React.cloneElement(icon, {
        className: `${size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`,
      });
    }
    
    return null;
  };

  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    loading ? 'cursor-wait' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderIcon('left')}
      
      <span className={`${(icon && iconPosition === 'left') || loading ? 'ml-2' : ''} ${icon && iconPosition === 'right' ? 'mr-2' : ''}`}>
        {loading && loadingText ? loadingText : children}
      </span>
      
      {renderIcon('right')}
    </button>
  );
};

// Convenience component exports
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const WarningButton = (props) => <Button variant="warning" {...props} />;
export const InfoButton = (props) => <Button variant="info" {...props} />;

export const OutlinePrimaryButton = (props) => <Button variant="outline-primary" {...props} />;
export const OutlineSecondaryButton = (props) => <Button variant="outline-secondary" {...props} />;
export const OutlineSuccessButton = (props) => <Button variant="outline-success" {...props} />;
export const OutlineDangerButton = (props) => <Button variant="outline-danger" {...props} />;

export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const GhostPrimaryButton = (props) => <Button variant="ghost-primary" {...props} />;
export const GhostSuccessButton = (props) => <Button variant="ghost-success" {...props} />;
export const GhostDangerButton = (props) => <Button variant="ghost-danger" {...props} />;

export const LinkButton = (props) => <Button variant="link" {...props} />;

// Icon buttons
export const IconButton = ({ children, ...props }) => (
  <Button {...props} className={`p-2 ${props.className || ''}`}>
    {children}
  </Button>
);

// Button group component
export const ButtonGroup = ({ children, className = '', ...props }) => (
  <div className={`inline-flex rounded-lg shadow-sm ${className}`} {...props}>
    {React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      const isFirst = index === 0;
      const isLast = index === React.Children.count(children) - 1;
      
      return React.cloneElement(child, {
        className: `${child.props.className || ''} ${
          isFirst ? 'rounded-r-none' : isLast ? 'rounded-l-none' : 'rounded-none'
        } ${!isFirst ? 'border-l-0' : ''}`.trim(),
      });
    })}
  </div>
);

export default Button;