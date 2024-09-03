import React, { useState } from 'react';

const AlertSettings: React.FC = () => {
  const [priceThreshold, setPriceThreshold] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the alert settings to a backend service
    console.log(`Alert set for price: $${priceThreshold}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="price-threshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Price Threshold ($)
        </label>
        <input
          type="number"
          id="price-threshold"
          value={priceThreshold}
          onChange={(e) => setPriceThreshold(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Enter price threshold"
          step="0.01"
          min="0"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Set Alert
      </button>
    </form>
  );
};

export default AlertSettings;