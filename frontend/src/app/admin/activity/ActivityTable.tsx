'use client'

import React from 'react'
import { Database } from '@/types/supabase'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table"

type Activity = Database['public']['Tables']['investor_activity']['Row']

interface ActivityTableProps {
  activity: Activity[]
}

export default function ActivityTable({ activity }: ActivityTableProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Investor Activity</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.user_id}</TableCell>
                <TableCell>{item.action}</TableCell>
                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                <TableCell>{JSON.stringify(item.details)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 