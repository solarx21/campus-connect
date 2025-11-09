'use client';

import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

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

interface Message {
  _id: string;
  content: string;
  sender: {
    name: string;
  };
  createdAt: string;
}

interface RoomsProps {
  user: any;
}

export default function Rooms({ user }: RoomsProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    interests: ''
  });

  useEffect(() => {
    fetchRooms();

    // Initialize socket connection
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('receive-message', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          interests: formData.interests.split(',').map(i => i.trim()).filter(i => i)
        })
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ title: '', description: '', interests: '' });
        fetchRooms();
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchRooms();
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rooms/${roomId}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchRooms();
        if (selectedRoom?._id === roomId) {
          setSelectedRoom(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleRoomClick = async (room: Room) => {
    setSelectedRoom(room);

    // Leave previous room
    if (socket && selectedRoom) {
      socket.emit('leave-room', selectedRoom._id);
    }

    // Join new room
    if (socket) {
      socket.emit('join-room', room._id);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rooms/${room._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || !socket) return;

    const messageData = {
      roomId: selectedRoom._id,
      content: newMessage,
      sender: { name: user.name },
      createdAt: new Date().toISOString()
    };

    // Emit message via socket
    socket.emit('send-message', messageData);

    setNewMessage('');
  };

  const isMember = (room: Room) => {
    return room.members.some(member => member.toString() === user.id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🏠 Rooms & Groups</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {showCreateForm ? 'Cancel' : '+ Create Room'}
        </button>
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Room</h3>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Room Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Room Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Interests/Tags (comma separated)"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rooms List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rooms</h3>
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => handleRoomClick(room)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedRoom?._id === room._id
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{room.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{room.members.length} members</span>
                    {isMember(room) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveRoom(room._id);
                        }}
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Leave
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinRoom(room._id);
                        }}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Join
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {room.interests.slice(0, 2).map((interest, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedRoom ? (
            <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">{selectedRoom.title}</h3>
                <p className="text-sm text-gray-600">{selectedRoom.description}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message._id} className="flex items-start space-x-3">
                    <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-800">
                        {message.sender.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{message.sender.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isMember(selectedRoom) && (
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p>Select a room to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}