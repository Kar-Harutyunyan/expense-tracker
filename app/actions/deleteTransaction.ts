"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(transactionId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = auth();

  if (!userId) return { error: "User not found" };

  try {
    await db.transaction.delete({
      where: {
        id: transactionId,
        userId,
      },
    });

    revalidatePath('/');
 
    return { message:"Transaction deleted" };
  } catch (error) {
    return { error: "Couldn't delete user balance" };
  }
}
