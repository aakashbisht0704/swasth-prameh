"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  FileText, 
  Calendar,
  Search,
  Eye,
  Download,
  Filter
} from 'lucide-react';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { UserDetailsModal } from './UserDetailsModal';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  onboarding_completed: boolean;
  created_at: string;
  user_profiles: {
    gender: string;
    dob: string | null;
  } | null;
  onboarding: {
    age: number;
    diabetes_type: string;
    diagnosis_date: string;
    medical_history: string | null;
    report_url: string | null;
    created_at: string;
  } | null;
}

interface AdminDashboardProps {
  users: User[];
  adminId: string;
}

export function AdminDashboard({ users: initialUsers, adminId }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  // Filter users based on search and filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && user.onboarding_completed) ||
                         (filter === 'incomplete' && !user.onboarding_completed);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    completed: users.filter(u => u.onboarding_completed).length,
    incomplete: users.filter(u => !u.onboarding_completed).length,
    withReports: users.filter(u => u.onboarding?.report_url).length
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-400">
          Manage users and monitor platform activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <FileText className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Incomplete</p>
                <p className="text-2xl font-bold text-orange-400">{stats.incomplete}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">With Reports</p>
                <p className="text-2xl font-bold text-purple-400">{stats.withReports}</p>
              </div>
              <Download className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-blue-600' : 'border-white/30 text-white hover:bg-white/20'}
            >
              All
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'bg-green-600' : 'border-white/30 text-white hover:bg-white/20'}
            >
              Completed
            </Button>
            <Button
              variant={filter === 'incomplete' ? 'default' : 'outline'}
              onClick={() => setFilter('incomplete')}
              className={filter === 'incomplete' ? 'bg-orange-600' : 'border-white/30 text-white hover:bg-white/20'}
            >
              Incomplete
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left p-4 text-white font-medium">User</th>
                  <th className="text-left p-4 text-white font-medium">Status</th>
                  <th className="text-left p-4 text-white font-medium">Diabetes Type</th>
                  <th className="text-left p-4 text-white font-medium">Joined</th>
                  <th className="text-left p-4 text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {user.full_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{user.full_name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={user.onboarding_completed ? "default" : "secondary"}
                        className={user.onboarding_completed ? "bg-green-600" : "bg-orange-600"}
                      >
                        {user.onboarding_completed ? 'Complete' : 'Incomplete'}
                      </Badge>
                    </td>
                    <td className="p-4 text-white">
                      {user.onboarding?.diabetes_type || 'N/A'}
                    </td>
                    <td className="p-4 text-gray-400">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewUser(user)}
                          className="border-white/30 text-white hover:bg-white/20"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <ChatWidget 
                          userId={user.id} 
                          isAdmin={true} 
                          adminId={adminId}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={showUserDetails}
          onClose={() => setShowUserDetails(false)}
        />
      )}
    </div>
  );
}
