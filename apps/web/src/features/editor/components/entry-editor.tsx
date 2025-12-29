'use client';

import { saveEntry } from '@/features/editor/actions';
import { TiptapEditor } from '@/features/editor/components/tiptap-editor';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type Entry = {
    id: number;
    title: string;
    content: string;
}

export function EntryEditor({ initialEntry }: { initialEntry: Entry | null }) {
    const [title, setTitle] = useState(initialEntry?.title || '');
    const [content, setContent] = useState(initialEntry?.content || '');
    const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [entryId, setEntryId] = useState<number | 'new'>(initialEntry?.id || 'new');

    const router = useRouter();
    const debouncedSaveRef = useRef<NodeJS.Timeout | null>(null);

    const performSave = useCallback(async (currentTitle: string, currentContent: string, currentId: number | 'new') => {
        setStatus('saving');
        const result = await saveEntry({
            id: currentId,
            title: currentTitle,
            content: currentContent
        });

        if (result.success && result.entry) {
            setStatus('saved');
            if (currentId === 'new') {
                // If we utilized a new entry, update URL without full refresh if possible
                setEntryId(result.entry.id);
                window.history.replaceState(null, '', `/entry/${result.entry.id}`);
                // Or router.replace(`/entry/${result.entry.id}`) but that might trigger re-mount
            }
        } else {
            setStatus('unsaved'); // Error state
        }
    }, []);

    const handleChange = (newTitle: string, newContent: string) => {
        setTitle(newTitle);
        setContent(newContent);
        setStatus('unsaved');

        if (debouncedSaveRef.current) {
            clearTimeout(debouncedSaveRef.current);
        }

        debouncedSaveRef.current = setTimeout(() => {
            performSave(newTitle, newContent, entryId);
        }, 1000); // 1 second debounce
    };

    // Update internal state if initialEntry changes (e.g. navigation)
    useEffect(() => {
        if (initialEntry) {
            setTitle(initialEntry.title);
            setContent(initialEntry.content);
            setEntryId(initialEntry.id);
        }
    }, [initialEntry]);

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <input
                    type="text"
                    placeholder="Title"
                    className="text-4xl font-bold bg-transparent border-none outline-none w-full text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-700"
                    value={title}
                    onChange={(e) => handleChange(e.target.value, content)}
                />
                <div className="text-xs text-gray-400 font-mono whitespace-nowrap ml-4">
                    {status === 'saving' ? 'Saving...' : status === 'unsaved' ? 'Unsaved' : 'Saved'}
                </div>
            </div>

            <TiptapEditor
                content={content}
                onChange={(newContent) => handleChange(title, newContent)}
            />
        </div>
    );
}
