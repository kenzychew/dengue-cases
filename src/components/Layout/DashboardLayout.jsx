import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Dengue Cases 🇸🇬
          </h1>
          <p className="text-base-content/70">
            Number of Dengue and Dengue Haemorrhagic Fever (DHF) Cases in Singapore [2014-2018]
          </p>
        </header>
        
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
