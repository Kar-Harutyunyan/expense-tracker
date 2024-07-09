"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface TransactionData {
  text: String;
  amount: Number;
}

interface TransactionResult {
  data?: TransactionData;
  error?: string;
}

export async function addTransaction(
  formData: FormData
): Promise<TransactionResult> {
  const textValue = formData.get("text");
  const amountValue = formData.get("amount");

  // Get logged in user
  const { userId } = auth();

  // Check for user
  if (!userId) return { error: "User not found" };

  if (!textValue || textValue === "" || !amountValue) {
    return { error: "Text or amount is missing" };
  }

  const text: string = textValue.toString(); // ensure text is string
  const amount: number = parseFloat(amountValue.toString());

  try {
    const transactionData: TransactionData = await db.transaction.create({
      data: {
        text,
        amount,
        userId,
      },
    });
    revalidatePath("/");
    return { data: transactionData };
  } catch (error) {
    return { error: "Transaction not added" };
  }
}
