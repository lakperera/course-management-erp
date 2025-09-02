// src/components/ui/Card.js
import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  rounded = 'lg',
  border = false,
  ...props
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 transition-all duration-200';
  
  // Padding variants
  const paddingClasses = {
    none: '',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Shadow variants
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  // Rounded variants
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  // Border classes
  const borderClasses = border 
    ? 'border border-gray-200 dark:border-gray-700' 
    : '';

  // Hover effect classes
  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' 
    : '';

  const classes = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    borderClasses,
    hoverClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
export const CardHeader = ({ 
  children, 
  className = '',
  border = true,
  padding = 'md',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-5',
  };

  const borderClasses = border 
    ? 'border-b border-gray-200 dark:border-gray-700' 
    : '';

  const classes = [
    'flex items-center justify-between',
    paddingClasses[padding],
    borderClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Body Component
export const CardBody = ({ 
  children, 
  className = '',
  padding = 'md',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = [
    paddingClasses[padding],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter = ({ 
  children, 
  className = '',
  border = true,
  padding = 'md',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-5',
  };

  const borderClasses = border 
    ? 'border-t border-gray-200 dark:border-gray-700' 
    : '';

  const classes = [
    'flex items-center justify-between bg-gray-50 dark:bg-gray-700/50',
    paddingClasses[padding],
    borderClasses,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
export const CardTitle = ({ 
  children, 
  className = '',
  size = 'lg',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-bold',
  };

  const classes = [
    'text-gray-900 dark:text-white',
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
};

// Card Description Component
export const CardDescription = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const classes = [
    'text-gray-600 dark:text-gray-400',
    className,
  ].filter(Boolean).join(' ');

  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};

// Stat Card Component (specialized card for statistics)
export const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  className = '',
  ...props
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className={`${className}`} hover {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {React.cloneElement(icon, { 
              className: 'w-8 h-8 text-gray-600 dark:text-gray-400' 
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

// Info Card Component (for displaying information with icon)
export const InfoCard = ({
  title,
  description,
  icon,
  color = 'blue',
  className = '',
  ...props
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100',
    gray: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100',
  };

  return (
    <div 
      className={`border rounded-lg p-4 ${colorClasses[color]} ${className}`}
      {...props}
    >
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 mr-3">
            {React.cloneElement(icon, { className: 'w-6 h-6' })}
          </div>
        )}
        <div>
          {title && (
            <h4 className="text-sm font-semibold mb-1">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-sm opacity-90">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Action Card Component (card with built-in action buttons)
export const ActionCard = ({
  title,
  description,
  children,
  actions,
  className = '',
  ...props
}) => {
  return (
    <Card className={className} {...props}>
      <CardBody>
        {title && <CardTitle className="mb-2">{title}</CardTitle>}
        {description && <CardDescription className="mb-4">{description}</CardDescription>}
        {children}
      </CardBody>
      {actions && (
        <CardFooter>
          <div className="flex items-center space-x-2 ml-auto">
            {actions}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Card;