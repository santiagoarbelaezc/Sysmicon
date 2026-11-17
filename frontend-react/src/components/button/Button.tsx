import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

export interface ButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  path?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
  showIcon?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  label = 'Continuar',
  variant = 'primary',
  path,
  type = 'button',
  disabled = false,
  fullWidth = false,
  showIcon = false,
  onClick,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const classes = ['btn', `btn-${variant}`, fullWidth ? 'btn-full' : '', disabled ? 'disabled' : '']
    .filter(Boolean)
    .join(' ');

  if (path) {
    return (
      <Link to={path} className={classes}>
        <span>{label}</span>
        {showIcon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        )}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={handleClick} className={classes}>
      <span>{label}</span>
      {showIcon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      )}
    </button>
  );
};

export default Button;
