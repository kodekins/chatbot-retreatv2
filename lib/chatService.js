import { supabase } from './supabase'

export class ChatService {
  // Create a new chat session
  static async createSession(userId, sessionName = 'New Chat') {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          session_name: sessionName
        })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get all chat sessions for a user
  static async getSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get messages for a specific session
  static async getMessages(sessionId) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Save a message to the database
  static async saveMessage(sessionId, userId, messageType, content, metadata = {}) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          user_id: userId,
          message_type: messageType,
          content: content,
          metadata: metadata
        })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Save retreat results to the database
  static async saveRetreats(userId, sessionId, retreats) {
    try {
      const retreatsToInsert = retreats.map(retreat => ({
        user_id: userId,
        session_id: sessionId,
        title: retreat.title,
        location: retreat.location,
        date: retreat.date,
        link: retreat.link,
        image_url: retreat.image
      }))

      const { data, error } = await supabase
        .from('user_retreats')
        .insert(retreatsToInsert)
        .select()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Get retreats for a specific session
  static async getRetreats(sessionId) {
    try {
      const { data, error } = await supabase
        .from('user_retreats')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Update session name
  static async updateSessionName(sessionId, sessionName) {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .update({ session_name: sessionName })
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Delete a session and all its messages
  static async deleteSession(sessionId) {
    try {
      // Delete messages first (due to foreign key constraint)
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)

      if (messagesError) throw messagesError

      // Delete retreats
      const { error: retreatsError } = await supabase
        .from('user_retreats')
        .delete()
        .eq('session_id', sessionId)

      if (retreatsError) throw retreatsError

      // Delete session
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      if (sessionError) throw sessionError

      return { data: true, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
} 