import { supabase } from './config'
import { Database } from '@/types/supabase'

type InvestorActivity = Database['public']['Tables']['investor_activity']['Insert']

export const trackInvestorLogin = async (userId: string) => {
  const { data, error } = await supabase
    .from('investor_activity')
    .insert<InvestorActivity>([
      {
        user_id: userId,
        action: 'login',
        timestamp: new Date().toISOString(),
        details: {
          ip: '',  // Will be filled by RLS
          user_agent: navigator.userAgent
        }
      }
    ])

  if (error) {
    console.error('Failed to track login:', error)
  }
  
  return { data, error }
} 