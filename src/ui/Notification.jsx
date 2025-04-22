import React from 'react';

const Notification = ({ message, type = 'info' }) => {
  if (!message) return null;

  const typeClasses = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  return (
    <div className={`${typeClasses[type]} border px-4 py-3 rounded mb-4`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;