import { auth } from "@/lib/auth";
import { db, entries as entriesTable } from "@reflekt/db";
import { endOfDay, startOfDay } from "date-fns";
import { and, eq, gte, lte } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const userId = Number(session.user.id);

  // 1. Check if an entry exists for today for this user
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const todayEntry = await db.query.entries.findFirst({
    where: and(
      eq(entriesTable.userId, userId),
      gte(entriesTable.createdAt, todayStart),
      lte(entriesTable.createdAt, todayEnd)
    )
  });

  if (todayEntry) {
    redirect(`/entry/${todayEntry.id}`);
  }

  // 2. If not, redirect to /entry/new
  redirect('/entry/new');
}
