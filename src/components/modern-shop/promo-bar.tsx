import React from 'react';

const PromoBar: React.FC = () => {
  return (
    <div className="bg-emerald-600 text-white py-2 px-4 text-center text-sm font-medium">
      <span className="inline-block animate-pulse mr-2">🚚</span>
      Ingyenes szállítás 50 palacktól! Friss, nyers, egészséges.
      <span className="inline-block animate-pulse ml-2">🥤</span>
    </div>
  );
};

export default PromoBar;
