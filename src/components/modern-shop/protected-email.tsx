import React, { useState, useEffect } from 'react';

interface ProtectedEmailProps {
  user: string;
  domain: string;
  label?: string;
  subject?: string;
  className?: string;
}

const ProtectedEmail: React.FC<ProtectedEmailProps> = ({
  user,
  domain,
  label,
  subject,
  className = "text-[#0B5D3F] hover:underline font-bold"
}) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(`${user}@${domain}`);
  }, [user, domain]);

  if (!email) {
    return <span className={className}>{label || `${user} [kukac] ${domain}`}</span>;
  }

  const href = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;

  return (
    <a href={href} className={className}>
      {label || email}
    </a>
  );
};

export default ProtectedEmail;
