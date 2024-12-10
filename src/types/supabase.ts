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
      investor_activity: {
        Row: {
          id: number
          user_id: string
          action: string
          timestamp: string
          details: Json
          created_at: string
        }
        Insert: {
          user_id: string
          action: string
          timestamp: string
          details?: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          action?: string
          timestamp?: string
          details?: Json
          created_at?: string
        }
      }
    }
  }
} 