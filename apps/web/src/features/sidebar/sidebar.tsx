'use client';

import { deleteEntry } from '@/features/editor/actions';
import { groupEntries } from '@/lib/date-utils';
import { uiStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Archive, Menu, MessageSquare, Plus, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSnapshot } from 'valtio';

type Entry = {
    id: number;
    title: string;
    createdAt: Date;
};

interface SidebarProps {
    entries?: Entry[];
}

export function Sidebar({ entries = [] }: SidebarProps) {
    const { sidebarOpen } = useSnapshot(uiStore);
    const pathname = usePathname();
    const router = useRouter();

    const grouped = groupEntries(entries);
    const groups = ['Today', 'Yesterday', 'Previous 30 Days'] as const;

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm('Delete this entry?')) {
            await deleteEntry(id);
            router.refresh();
            if (pathname === `/entry/${id}`) {
                router.push('/');
            }
        }
    };

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out border-none bg-[#F0F4F9] dark:bg-[#1e1e1e]",
                sidebarOpen ? "w-[280px] translate-x-0" : "w-0 -translate-x-full overflow-hidden opacity-0"
            )}
        >
            {/* Header / New Chat */}
            <div className="flex flex-col p-3 shrink-0 gap-4">
                <div className="flex items-center justify-between px-2">
                    <button onClick={() => uiStore.toggleSidebar()} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400">
                        <Menu size={20} />
                    </button>
                </div>

                <button
                    onClick={() => router.push('/entry/new')}
                    className="flex items-center gap-3 px-4 py-3 ml-1 mr-4 rounded-full bg-[#DDE3EA] dark:bg-[#2b2b2b] hover:bg-[#d1d9e0] dark:hover:bg-[#333] transition-colors text-slate-700 dark:text-slate-200 w-fit"
                >
                    <Plus size={18} />
                    <span className="text-sm font-medium">New Entry</span>
                </button>
            </div>

            {/* Entry List */}
            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                <div className="flex flex-col gap-1">
                    <span className="px-4 text-xs font-medium text-slate-500 dark:text-slate-400 py-2">Recent</span>
                    {groups.map(group => {
                        const groupEntries = grouped[group];
                        if (groupEntries.length === 0) return null;

                        return (
                            <div key={group} className="mb-2">
                                <h3 className="px-4 text-[11px] font-medium text-slate-500/80 dark:text-slate-500 mb-1">{group}</h3>
                                <ul className="space-y-0.5">
                                    {groupEntries.map(entry => {
                                        const isActive = pathname === `/entry/${entry.id}`;
                                        return (
                                            <li key={entry.id}>
                                                <Link
                                                    href={`/entry/${entry.id}`}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-2 text-[14px] rounded-full transition-colors group relative overflow-hidden",
                                                        isActive
                                                            ? "bg-[#D3E3FD] dark:bg-[#004a77] text-[#041E49] dark:text-[#c2e7ff] font-medium"
                                                            : "text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-black/5 dark:hover:bg-white/5"
                                                    )}
                                                >
                                                    <MessageSquare size={16} className={cn("shrink-0", isActive ? "text-[#041E49] dark:text-[#c2e7ff]" : "text-slate-500")} />
                                                    <span className="truncate flex-1">{entry.title || 'Untitled Entry'}</span>

                                                    <div
                                                        onClick={(e) => handleDelete(e, entry.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded transition-all shrink-0"
                                                    >
                                                        <Trash2 size={12} />
                                                    </div>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </nav>

            {/* Footer / User Profile */}
            <div className="p-3 mt-auto">
                <Link
                    href="/entries"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors mb-1"
                >
                    <Archive size={18} className="text-slate-500" />
                    <span>Activity</span>
                </Link>
                <button className="flex items-center gap-3 px-4 py-2 text-sm text-[#1f1f1f] dark:text-[#e3e3e3] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors w-full text-left">
                    <Settings size={18} className="text-slate-500" />
                    <span>Settings</span>
                </button>
                <div className="flex items-center gap-3 px-4 py-3 mt-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                        U
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">User</span>
                        <span className="text-[10px] text-slate-500">Free Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
