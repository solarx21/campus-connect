'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  year: string;
  branch: string;
  bio?: string;
  interests: string[];
  coolVotesCount: number;
}

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteCool = async (userId: string) => {
    setActionLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${userId}/cool`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Cool vote recorded! 🌟');
        // Update the user's cool count in the results
        setSearchResults(results =>
          results.map(user =>
            user.id === userId
              ? { ...user, coolVotesCount: user.coolVotesCount + 1 }
              : user
          )
        );
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error voting. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdmire = async (userId: string) => {
    setActionLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${userId}/admire`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        if (data.mutual) {
          setMessage('🎉 Mutual admiration match! Check your email for details.');
        } else {
          setMessage('Admiration sent! 💕');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error sending admiration. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Find Students</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name, interests, or skills..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') || message.includes('limit') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((user) => (
              <div key={user.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-gray-600 text-sm">{user.year} • {user.branch}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                      {user.coolVotesCount} cool
                    </span>
                  </div>
                </div>

                {user.bio && <p className="text-gray-700 text-sm mb-3">{user.bio}</p>}

                <div className="flex flex-wrap gap-1 mb-4">
                  {user.interests.map((interest, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleVoteCool(user.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    🌟 Cool
                  </button>
                  <button
                    onClick={() => handleAdmire(user.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-pink-600 text-white px-3 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    💕 Admire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && searchQuery && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">No students found matching your search.</p>
        </div>
      )}
    </div>
  );
}