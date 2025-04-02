'use server'
import { auth } from "@/auth";
import { getCodeByIdentifier } from "./[identifier]/page";

export async function getInitialCode() {
  const session = await auth();

  if (!session?.user.username) {
    return null;
  }

  const code = await getCodeByIdentifier(session?.user.username);
  return code?.content ?? null;
}