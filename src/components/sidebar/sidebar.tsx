import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";
import WorkspaceDropdown from "./workspace-dropdown";

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar = async ({ params, className }: SidebarProps) => {
  const supabase = createServerComponentClient({ cookies });

  //user
  const {
    data: { user },
  } = await supabase?.auth?.getUser();
  if (!user) return;

  // subscription
  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  if (subscriptionError) return;

  // folders

  const { data: folders, error: foldersError } = await getFolders(
    params.workspaceId
  );

  if (foldersError) return;

    const privateWorkspaces = await getPrivateWorkspaces(user.id);
    const sharedWorkspaces = await getSharedWorkspaces(user.id);
    const collaboratingWorkspaces = await getCollaboratingWorkspaces(user.id);

    console.log(privateWorkspaces, sharedWorkspaces, collaboratingWorkspaces);
  

  return <aside
  className={cn(
    'hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between',
    className
  )}
>
  <div>
    <WorkspaceDropdown
      privateWorkspaces={privateWorkspaces}
      sharedWorkspaces={sharedWorkspaces}
      collaboratingWorkspaces={collaboratingWorkspaces}
      defaultValue={[
        ...privateWorkspaces,
        ...collaboratingWorkspaces,
        ...sharedWorkspaces,
      ].find((workspace) => workspace.id === params.workspaceId)}
    />
    </div>
    
</aside>
};

export default Sidebar;
