"use server";
import { files, folders, workspaces } from "../../../migrations/schema";
import { validate } from "uuid";
import db from "./db";
import { Folder, Subscription, workspace } from "./supabase.types";
import { eq } from "drizzle-orm";

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
