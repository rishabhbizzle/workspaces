"use server";
import { files, folders, users, workspaces } from "../../../migrations/schema";
import { validate } from "uuid";
import db from "./db";
import { Folder, Subscription, User, workspace } from "./supabase.types";
import { and, eq, ilike, notExists } from "drizzle-orm";
import { collaborators } from "./schema";

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db?.query?.subscriptions?.findFirst({
      where: (sub, { eq }) => eq(sub?.userId, userId),
    });
    if (data) {
      return { data: data as Subscription, error: null };
    } else {
      return { data: null, error: null };
    }
  } catch (error) {
    return { data: null, error: `Error: ${error}` };
  }
};

export const createWorkspace = async (workspace: workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const createFolder = async (folder: Folder) => {
  try {
    const results = await db.insert(folders).values(folder);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: 'Error' };
  }
};


export const getFolders = async (workspaceId: string) => {
  try {
    const isValid = validate(workspaceId);
    if (!isValid) return { data: null, error: "Workspace id is not valid" };
    const results: Folder[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId));
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error: ${error}` };
  }
};

export const getFiles = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    const results = (await db
      .select()
      .from(files)
      .orderBy(files.createdAt)
      .where(eq(files.folderId, folderId))) as File[] | [];
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const getPrivateWorkspaces = async (userId: string) => {
  try {
    if (!userId) return [];
    const privateWorkspaces = (await db
      .select({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl,
      })
      .from(workspaces)
      .where(
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        )
      )) as workspace[] | [];
    return privateWorkspaces;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getCollaboratingWorkspaces = async (userId: string) => {
  try {
    if (!userId) return [];
    const collaboratedWorkspaces = (await db
      .select({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl,
      })
      .from(users)
      .innerJoin(collaborators, eq(users.id, collaborators.userId))
      .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
      .where(eq(users.id, userId))) as workspace[];
    return collaboratedWorkspaces;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSharedWorkspaces = async (userId: string) => {
  try {
    if (!userId) return [];
    const sharedWorkspaces = (await db
      .selectDistinct({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl,
      })
      .from(workspaces)
      .orderBy(workspaces.createdAt)
      .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
      .where(eq(workspaces.workspaceOwner, userId))) as workspace[];
    return sharedWorkspaces;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addCollaborators = async (users: User[], workspaceId: string) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (!userExists)
      await db.insert(collaborators).values({ workspaceId, userId: user.id });
  });
};

export const getUsersFromSearch = async (email: string) => {
  if (!email) return [];
  const accounts = db
    .select()
    .from(users)
    .where(ilike(users.email, `${email}%`));
  return accounts;
};