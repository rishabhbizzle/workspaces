import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import { cookies } from 'next/headers'
import db from '@/lib/supabase/db'
import DashboardSetup from '@/components/dashboard/dashboard-setup'
import { getUserSubscriptionStatus } from '@/lib/supabase/queries'

const Dashboard = async () => {
  const supabase = createServerComponentClient( { cookies })
  const {data : { user }} = await supabase?.auth?.getUser()

  if (!user) return;

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id)
  })

  const  { data: subscription, error: subscriptionError } = await getUserSubscriptionStatus(user.id)

  if (subscriptionError) return;

  if (!workspace) return(
    <div
    className='bg-background h-screen w-screen flex justify-center items-center'
    >
      <DashboardSetup user={user} subscription={subscription}></DashboardSetup>
    </div>


  )


  return (
    <div>age</div>
  )
}

export default Dashboard