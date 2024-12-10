import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ActivityTable from './ActivityTable'

export default async function ActivityPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: activity } = await supabase
    .from('investor_activity')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100)

  return <ActivityTable activity={activity || []} />
} 