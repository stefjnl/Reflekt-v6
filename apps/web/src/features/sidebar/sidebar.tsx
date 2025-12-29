'use client';

import { groupEntries } from '@/lib/date-utils';
import { uiStore } from '@/lib/store';
import { cn } from '@/lib/utils'; // Need to create utils
import { Menu, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSnapshot } from 'valtio';

// Mock data type until we integrate DB
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

    const grouped = groupEntries(entries);
    const groups = ['Today', 'Yesterday', 'Previous 30 Days'] as const;

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out border-r border-transparent bg-white/60 dark:bg-[#0b0c10]/60 backdrop-blur-2xl",
                sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full overflow-hidden opacity-0"
            )}
        >
            {/* Mesh Gradient Background Effect */}
            <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-3xl" />
            </div>

            <div className="flex items-center justify-between p-4 pl-4 shrink-0">
                <button onClick={() => uiStore.toggleSidebar()} className="p-2 mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400">
                    <Menu size={20} />
                </button>
                <div className="flex-1 font-semibold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">Reflekt</div>
                <button className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:opacity-80 transition-colors text-slate-700 dark:text-slate-200">
                    <Plus size={18} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-6 scrollbar-none">
                {groups.map(group => {
                    const groupEntries = grouped[group];
                    if (groupEntries.length === 0) return null;

                    return (
                        <div key={group} className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                            <h3 className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-2 uppercase tracking-widest">{group}</h3>
                            <ul className="space-y-1">
                                {groupEntries.map(entry => (
                                    <li key={entry.id}>
                                        <Link
                                            href={`/entry/${entry.id}`}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 group relative overflow-hidden",
                                                pathname === `/entry/${entry.id}`
                                                    ? "bg-white/10 dark:bg-white/10 text-slate-900 dark:text-white font-medium shadow-sm backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/10"
                                                    : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                            )}
                                        >
                                            <MessageSquare size={14} className="opacity-70" />
                                            <span className="truncate">{entry.title || 'Untitled'}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
                <div className="text-xs text-center text-gray-400">
                    Reflekt v6
                </div>
            </div>
        </aside>
    );
}
