import { EntryEditor } from "@/features/editor/components/entry-editor";
import { db, entries as entriesTable } from "@reflekt/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let entry = null;
    if (id !== 'new') {
        const result = await db.select().from(entriesTable).where(eq(entriesTable.id, Number(id)));
        entry = result[0];

        if (!entry) {
            notFound();
        }
    }

    return <EntryEditor initialEntry={entry} />;
}
