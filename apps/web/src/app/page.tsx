import { db, entries as entriesTable } from "@reflekt/db";
import { endOfDay, startOfDay } from "date-fns";
import { and, gte, lte } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Home() {
  // 1. Check if an entry exists for today
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const todayEntry = await db.query.entries.findFirst({
    where: and(
      gte(entriesTable.createdAt, todayStart),
      lte(entriesTable.createdAt, todayEnd)
    )
  });

  if (todayEntry) {
    redirect(`/entry/${todayEntry.id}`);
  }

  // 2. If not, show the "New Entry" interface (or redirect to /entry/new, but keeping URL clean is nice too)
  // For simplicity, let's redirect to /entry/new which will be handled by the generic page
  // But wait, the PRD says "Entry Orchestrator: If an entry exists for today, load it; otherwise, initialize a blank state."

  // If we redirect to /entry/new, the ID is 'new', which our generic page handles.
  redirect('/entry/new');
}
