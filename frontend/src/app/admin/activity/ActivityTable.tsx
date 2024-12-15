'use client'

import React from 'react'
import { Database } from '@/types/supabase'

type Activity = Database['public']['Tables']['investor_activity']['Row']

interface ActivityTableProps {
  activity: Activity[]
}

export default function ActivityTable({ activity }: ActivityTableProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Investor Activity</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item) => (
              <tr key={item.id}>
                <td>{item.user_id}</td>
                <td>{item.action}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                <td>{JSON.stringify(item.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 