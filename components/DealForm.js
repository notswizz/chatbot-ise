// components/DealForm.js
import React from 'react';

export default function DealForm({ formData, handleChange }) {
  return (
    <>
      <div>
        <label htmlFor="school" className="block text-sm font-medium text-gray-700">School</label>
        <input
          type="text"
          id="school"
          name="school"
          value={formData.school}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="sport" className="block text-sm font-medium text-gray-700">Sport</label>
        <select
          id="sport"
          name="sport"
          value={formData.sport}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length (years)</label>
        <input
          type="number"
          id="length"
          name="length"
          value={formData.length}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="annualAmount" className="block text-sm font-medium text-gray-700">Annual Amount ($)</label>
        <input
          type="number"
          id="annualAmount"
          name="annualAmount"
          value={formData.annualAmount}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
    </>
  );
}