'use server';

import { auth } from "@/lib/auth";
import { db, entries } from "@reflekt/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveEntry(data: { id?: number | 'new', title: string, content: string }) {
    // Check for "empty" content (stripping basic HTML tags)
    const cleanContent = data.content?.replace(/<[^>]*>/g, '').trim();
    if (!data.title?.trim() && !cleanContent) {
        return { success: false, message: 'Empty' };
    }

    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    const userId = Number(session.user.id);

    try {
        if (data.id === 'new' || !data.id) {
            // Create New
            const result = await db.insert(entries).values({
                title: data.title || 'Untitled',
                content: data.content,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();

            revalidatePath('/');
            revalidatePath('/entries'); // Update archive
            return { success: true, entry: result[0] };
        } else {
            // Update Existing
            const result = await db.update(entries)
                .set({
                    title: data.title,
                    content: data.content,
                    updatedAt: new Date(),
                })
                .where(eq(entries.id, Number(data.id)))
                .returning();

            revalidatePath('/');
            revalidatePath('/entries');
            revalidatePath(`/entry/${data.id}`);
            return { success: true, entry: result[0] };
        }
    } catch (error) {
        console.error('Failed to save entry:', error);
        return { success: false, error };
    }
}

export async function deleteEntry(id: number) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        await db.delete(entries).where(eq(entries.id, id));
        revalidatePath('/');
        revalidatePath('/entries');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete entry:', error);
        return { success: false, error };
    }
}
