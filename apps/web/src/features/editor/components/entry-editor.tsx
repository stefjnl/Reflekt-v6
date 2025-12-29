'use client';

import { saveEntry } from '@/features/editor/actions';
import { TiptapEditor } from '@/features/editor/components/tiptap-editor';
import { format } from 'date-fns';
import { Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type Entry = {
    id: number;
    title: string;
    content: string;
    createdAt?: Date; // Added createdAt to type
}

export function EntryEditor({ initialEntry }: { initialEntry: Entry | null }) {
    // Default title strategy: If existing, use it. If new, use today's date formatted nicely.
    const defaultTitle = initialEntry?.title || format(new Date(), 'EEEE, MMMM d, yyyy');

    const [title, setTitle] = useState(defaultTitle);
    const [content, setContent] = useState(initialEntry?.content || '');
    const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [id, setId] = useState<number | 'new'>(initialEntry?.id || 'new');
    const [inputValue, setInputValue] = useState('');

    const router = useRouter();
    const debouncedSaveRef = useRef<NodeJS.Timeout | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

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
                setId(result.entry.id);
                window.history.replaceState(null, '', `/entry/${result.entry.id}`);
            }
        } else {
            setStatus('unsaved');
        }
    }, []);

    const isFirstUpdate = useRef(true);

    const handleChange = (newTitle: string, newContent: string) => {
        // Prevent auto-save on mount if content is identical
        if (isFirstUpdate.current) {
            isFirstUpdate.current = false;
            if (newContent === (initialEntry?.content || '')) {
                return;
            }
        }

        setTitle(newTitle);
        setContent(newContent);
        setStatus('unsaved');

        if (debouncedSaveRef.current) {
            clearTimeout(debouncedSaveRef.current);
        }

        debouncedSaveRef.current = setTimeout(() => {
            performSave(newTitle, newContent, id);
        }, 1000);
    };

    // Handle appending text from bottom bar
    const handleQuickAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Append as new paragraph
        const newParagraph = `<p>${inputValue}</p>`;
        const newContent = content ? `${content}${newParagraph}` : newParagraph;

        handleChange(title, newContent);
        setInputValue('');

        // Scroll to bottom after adding
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        isFirstUpdate.current = true;
        if (initialEntry) {
            setTitle(initialEntry.title);
            setContent(initialEntry.content);
            setId(initialEntry.id);
        } else {
            setTitle(defaultTitle);
            setContent('');
            setId('new');
        }
    }, [initialEntry, defaultTitle]);

    return (
        <div className="max-w-3xl mx-auto py-8 relative min-h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <input
                    type="text"
                    placeholder="Entry Title"
                    className="text-4xl md:text-5xl font-medium tracking-tight bg-transparent border-none outline-none w-full text-[#1f1f1f] dark:text-[#e3e3e3] placeholder:text-gray-300 dark:placeholder:text-gray-700 font-sans"
                    value={title}
                    onChange={(e) => handleChange(e.target.value, content)}
                />
                <div className="text-xs text-gray-400 font-mono whitespace-nowrap ml-4 uppercase tracking-widest hidden md:block">
                    {status === 'saving' ? 'Saving...' : status === 'unsaved' ? 'Unsaved' : 'Saved'}
                </div>
            </div>

            <div className="flex-1 pb-32">
                <TiptapEditor
                    content={content}
                    onChange={(newContent) => handleChange(title, newContent)}
                />
                <div ref={bottomRef} />
            </div>

            {/* Floating Input Bar */}
            <div className="fixed bottom-6 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
                <div className="w-full max-w-2xl bg-[#F0F4F9] dark:bg-[#1e1e1e] rounded-full shadow-lg p-2 flex items-center gap-2 pointer-events-auto transition-transform hover:scale-[1.01] border border-transparent dark:border-white/10">
                    <button className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors">
                        <Sparkles size={20} />
                    </button>
                    <form onSubmit={handleQuickAdd} className="flex-1 flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Add to your day..."
                            className="w-full bg-transparent border-none outline-none text-[#1f1f1f] dark:text-[#e3e3e3] placeholder:text-gray-500 text-base py-2"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-50 disabled:hover:text-slate-400 transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
