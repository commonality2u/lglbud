export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          title: string
          content: string | null
          type: 'audio_transcript' | 'email' | 'text_message' | 'court_document' | 'legal_filing'
          status: 'pending' | 'processing' | 'completed' | 'error'
          case_number: string | null
          size: string | null
          file_path: string | null
          metadata: Json
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          type: 'audio_transcript' | 'email' | 'text_message' | 'court_document' | 'legal_filing'
          status?: 'pending' | 'processing' | 'completed' | 'error'
          case_number?: string | null
          size?: string | null
          file_path?: string | null
          metadata?: Json
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          type?: 'audio_transcript' | 'email' | 'text_message' | 'court_document' | 'legal_filing'
          status?: 'pending' | 'processing' | 'completed' | 'error'
          case_number?: string | null
          size?: string | null
          file_path?: string | null
          metadata?: Json
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_status: 'pending' | 'processing' | 'completed' | 'error'
      document_type: 'audio_transcript' | 'email' | 'text_message' | 'court_document' | 'legal_filing'
    }
  }
} 
} 