import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { getFolders, getUserSubscriptionStatus } from '@/lib/supabase/queries'

interface SidebarProps {
    params: { workspaceId: string },
    className?: string
}

const Sidebar = async ({ params, className}: SidebarProps) => {
    const supabase = createServerComponentClient({cookies})

    //user
    const { data: { user }} = await supabase?.auth?.getUser()
    if (!user) return

// subscription
const { data: subscription, error: subscriptionError } = await getUserSubscriptionStatus(user.id)

if (subscriptionError) return

// folders

const { data: folders, error: foldersError } = await getFolders(params.workspaceId)

if (foldersError) return



  return (
    <div>Sidebar</div>
  )
}

export default Sidebar