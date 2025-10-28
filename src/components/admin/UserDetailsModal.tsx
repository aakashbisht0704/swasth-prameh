"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  X, 
  FileText, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  Download,
  Eye
} from 'lucide-react';
import { getUserMessages } from '@/lib/admin-utils';

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
    prakriti_vata: string | null;
    prakriti_pitta: string | null;
    prakriti_kapha: string | null;
    nadi: string | null;
    mutra: string | null;
    mala: string | null;
    jihwa: string | null;
    shabda: string | null;
    sparsha: string | null;
    drik: string | null;
    akriti: string | null;
    diet: string | null;
    exercise: string | null;
    sleep: string | null;
    created_at: string;
  } | null;
}

interface ChatMessage {
  id: string;
  message: string;
  sender_type: 'user' | 'admin';
  created_at: string;
}

interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, user.id]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getUserMessages(user.id);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-white/20 text-white">
                  {user.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - User Info */}
            <div className="space-y-6">
              {/* Basic Info */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Joined:</span>
                    <span className="text-white">{formatDate(user.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">Status:</span>
                    <Badge 
                      variant={user.onboarding_completed ? "default" : "secondary"}
                      className={user.onboarding_completed ? "bg-green-600" : "bg-orange-600"}
                    >
                      {user.onboarding_completed ? 'Profile Complete' : 'Profile Incomplete'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              {user.onboarding && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Medical Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Age:</span>
                        <p className="text-white font-medium">{user.onboarding.age} years</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Gender:</span>
                        <p className="text-white font-medium">{user.user_profiles?.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Diabetes Type:</span>
                        <p className="text-white font-medium">{user.onboarding.diabetes_type}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Diagnosed:</span>
                        <p className="text-white font-medium">{formatDate(user.onboarding.diagnosis_date)}</p>
                      </div>
                    </div>
                    
                    {user.onboarding.medical_history && (
                      <div>
                        <span className="text-gray-400 text-sm">Medical History:</span>
                        <p className="text-white text-sm mt-1">{user.onboarding.medical_history}</p>
                      </div>
                    )}

                    {user.onboarding.report_url && (
                      <div>
                        <span className="text-gray-400 text-sm">Medical Report:</span>
                        <div className="mt-2">
                          <a 
                            href={user.onboarding.report_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-400 hover:text-blue-300"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download Report
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Prakriti Assessment */}
              {user.onboarding && (user.onboarding.prakriti_vata || user.onboarding.prakriti_pitta || user.onboarding.prakriti_kapha) && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Prakriti Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vata:</span>
                      <span className="text-white">{user.onboarding.prakriti_vata || 'Not assessed'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pitta:</span>
                      <span className="text-white">{user.onboarding.prakriti_pitta || 'Not assessed'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kapha:</span>
                      <span className="text-white">{user.onboarding.prakriti_kapha || 'Not assessed'}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Chat History */}
            <div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Chat History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-gray-400">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.sender_type === 'user'
                              ? 'bg-blue-600 text-white ml-4'
                              : 'bg-gray-600 text-white mr-4'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {formatDate(message.created_at)} • {message.sender_type === 'user' ? 'User' : 'Admin'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
