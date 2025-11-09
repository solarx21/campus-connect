'use client';

import { useState, useEffect } from 'react';

interface ProfileProps {
  user: any;
}

export default function Profile({ user }: ProfileProps) {
  const [profile, setProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user.bio || '',
    interests: user.interests || [],
    socialLinks: user.socialLinks || {}
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          bio: data.bio || '',
          interests: data.interests || [],
          socialLinks: data.socialLinks || {}
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interests = e.target.value.split(',').map(i => i.trim()).filter(i => i);
    setFormData({ ...formData, interests });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: { ...formData.socialLinks, [platform]: value }
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900">{profile.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <p className="text-gray-900">{profile.year}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <p className="text-gray-900">{profile.branch}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          ) : (
            <p className="text-gray-700">{profile.bio || 'No bio added yet.'}</p>
          )}
        </div>

        {/* Interests */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Interests & Skills</h3>
          {isEditing ? (
            <input
              type="text"
              value={formData.interests.join(', ')}
              onChange={handleInterestChange}
              placeholder="e.g., Programming, Gaming, Music (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.interests?.map((interest: string, index: number) => (
                <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              )) || <p className="text-gray-500">No interests added yet.</p>}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Social Links</h3>
          {isEditing ? (
            <div className="space-y-3">
              {['linkedin', 'github', 'instagram'].map((platform) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {platform}
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks[platform] || ''}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    placeholder={`https://${platform}.com/yourusername`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 ? (
                Object.entries(profile.socialLinks).map(([platform, url]) => (
                  url && (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-600 hover:text-purple-800 capitalize"
                    >
                      {platform}
                    </a>
                  )
                ))
              ) : (
                <p className="text-gray-500">No social links added yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Cool Rating */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-2">Cool Rating</h3>
          <div className="flex items-center">
            <span className="text-2xl mr-2">🌟</span>
            <span className="text-xl font-bold text-purple-600">{profile.coolVotesCount || 0}</span>
            <span className="text-gray-600 ml-2">cool votes this week</span>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}