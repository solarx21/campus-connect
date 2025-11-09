'use client';

import { useState } from 'react';

export default function CommunityGuidelines() {
  const [isOpen, setIsOpen] = useState(false);

  const guidelines = [
    "Be respectful and kind to all community members",
    "No harassment, bullying, or discriminatory behavior",
    "Respect privacy - don't share personal information without consent",
    "Keep content appropriate for a college community",
    "No spam or excessive self-promotion",
    "Report any violations to maintain a safe environment",
    "Use the platform for positive social and academic interactions",
    "Respect intellectual property and give credit where due"
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-600 hover:text-gray-800 underline"
      >
        Community Guidelines
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Community Guidelines</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Welcome to Campus Connect! To ensure a positive and safe environment for all students,
                  please follow these guidelines:
                </p>

                <ul className="space-y-3">
                  {guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Report Violations</h3>
                <p className="text-yellow-700 text-sm">
                  If you encounter behavior that violates these guidelines, please report it immediately
                  using the report feature available throughout the platform.
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}