export type UserRole = 'user' | 'support' | 'admin'
export type ChatStatus = 'open' | 'closed' | 'pending'
export type SenderRole = 'user' | 'support' | 'admin' | 'system'

export interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface SupportChat {
  id: string
  user_id: string
  title: string | null
  status: ChatStatus
  assigned_to: string | null
  unread_count: number
  last_message_at: string | null
  created_at: string
  updated_at: string
  // Joined data
  user?: UserProfile
  assigned_agent?: UserProfile
  last_message?: SupportMessage
}

export interface SupportMessage {
  id: string
  chat_id: string
  sender_id: string | null
  sender_role: SenderRole
  message: string
  metadata: Record<string, any>
  is_read: boolean
  deleted_at: string | null
  deleted_by: string | null
  flagged: boolean
  flagged_by: string | null
  flagged_at: string | null
  created_at: string
  edited_at: string | null
  // Joined data
  sender?: UserProfile
  attachments?: SupportAttachment[]
}

export interface SupportAttachment {
  id: string
  message_id: string
  url: string
  filename: string
  size: number | null
  content_type: string | null
  created_at: string
}

export interface SupportActivityLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, any>
  created_at: string
  // Joined data
  user?: UserProfile
}

export interface CreateChatRequest {
  title?: string
  initial_message?: string
}

export interface CreateMessageRequest {
  message: string
  attachments?: File[]
  metadata?: Record<string, any>
}

export interface AssignChatRequest {
  assigned_to: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  page_size: number
  has_more: boolean
}

