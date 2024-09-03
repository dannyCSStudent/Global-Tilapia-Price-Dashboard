import React from 'react';
import Head from 'next/head';

const Dashboard: React.FC = () => {
  return (
    <>
      <Head>
        <title>Global Tilapia Price Dashboard</title>
        <meta name="description" content="Real-time tilapia price tracking and market analysis" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Global Tilapia Price Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Real-Time Prices</h2>
            {/* We'll add the PriceChart component here later */}
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Market News</h2>
            {/* We'll add the NewsWidget component here later */}
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Price Alerts</h2>
            {/* We'll add the AlertSettings component here later */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;