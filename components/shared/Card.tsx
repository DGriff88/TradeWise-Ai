
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
}

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4 border-b border-[#30363D]">
    <h3 className="text-lg font-semibold text-white">{children}</h3>
  </div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Card: React.FC<CardProps> & { Header: typeof CardHeader; Body: typeof CardBody } = ({ children, className = '', fullWidth = false, onClick }) => {
  return (
    <div onClick={onClick} className={`bg-[#161B22] rounded-lg shadow-xl overflow-hidden border border-[#30363D] ${fullWidth ? 'w-full' : ''} ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;

export default Card;
