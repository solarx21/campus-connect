'use client';

import { useState, useEffect } from 'react';
import ReportModal from './ReportModal';
import CommunityGuidelines from './CommunityGuidelines';

interface User {
  id: string;
  name: string;
  year: string;
  branch: string;
  bio?: string;
  interests: string[];
  coolVotesCount: number;
}

interface Room {
  _id: string;
  title: string;
  description: string;
  interests: string[];
  creator: {
    name: string;
  };
  members: any[];
}

export default function TrendingDashboard() {
  const [trendingUsers, setTrendingUsers] = useState<User[]>([]);
  const [trendingRooms, setTrendingRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    targetType: 'user' | 'room';
    targetId: string;
    targetName: string;
  }>({
    isOpen: false,
    targetType: 'user',
    targetId: '',
    targetName: ''
  });

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, roomsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users/trending', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/rooms/trending', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setTrendingUsers(usersData);
      }

      if (roomsRes.ok) {
        const roomsData = await roomsRes.json();
        setTrendingRooms(roomsData);
      }
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleReport = (targetType: 'user' | 'room', targetId: string, targetName: string) => {
    setReportModal({
      isOpen: true,
      targetType,
      targetId,
      targetName
    });
  };

  const handleReportSubmit = async (reportData: { reason: string; description: string }) => {
    try {
      const token = localStorage.getItem('token');
      const reportPayload = {
        reason: reportData.reason,
        description: reportData.description,
        ...(reportModal.targetType === 'user'
          ? { reportedUser: reportModal.targetId }
          : { reportedRoom: reportModal.targetId }
        )
      };

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reportPayload)
      });

      if (response.ok) {
        alert('Report submitted successfully');
      } else {
        alert('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report');
    }
  };

  return (
    <div className="space-y-8">
      {/* Community Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📋</span>
            <span className="text-blue-800 font-medium">Help keep our community safe!</span>
          </div>
          <CommunityGuidelines />
        </div>
      </div>

      {/* Cool People This Week */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🌟 Cool People This Week</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingUsers.map((user) => (
            <div key={user.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                  {user.coolVotesCount} cool votes
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{user.year} • {user.branch}</p>
              {user.bio && <p className="text-gray-700 text-sm">{user.bio}</p>}
              <div className="flex flex-wrap gap-1 mt-2">
                {user.interests.slice(0, 3).map((interest, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {interest}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleReport('user', user.id, user.name)}
                className="mt-2 text-xs text-red-600 hover:text-red-800"
              >
                Report user
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Rooms */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🏠 Popular Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingRooms.map((room) => (
            <div key={room._id} className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">{room.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{room.description}</p>
              <p className="text-gray-500 text-xs mb-2">Created by {room.creator.name}</p>
              <div className="flex items-center justify-between">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {room.members.length} members
                </span>
                <div className="flex flex-wrap gap-1">
                  {room.interests.slice(0, 2).map((interest, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleReport('room', room._id, room.title)}
                className="mt-2 text-xs text-red-600 hover:text-red-800"
              >
                Report room
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ ...reportModal, isOpen: false })}
        onSubmit={handleReportSubmit}
        targetType={reportModal.targetType}
        targetName={reportModal.targetName}
      />
    </div>
  );
}