'use client';

import { Sidebar } from '@/features/sidebar/sidebar';
import { uiStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useSnapshot } from 'valtio';

export function Shell({ children, entries }: { children: React.ReactNode, entries?: any[] }) {
    const { sidebarOpen } = useSnapshot(uiStore);

    return (
        <div className="flex h-full w-full bg-white dark:bg-black text-slate-900 dark:text-slate-100">
            <Sidebar entries={entries} />
            <div
                className={cn(
                    "flex-1 h-full flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden",
                    sidebarOpen ? "ml-64" : "ml-0"
                )}
            >
                <header className={cn("h-14 flex items-center px-4 shrink-0 gap-2 z-10", sidebarOpen ? "opacity-0 pointer-events-none md:opacity-100" : "opacity-100")}>
                    {!sidebarOpen && (
                        <button onClick={() => uiStore.toggleSidebar()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
                            <Menu size={20} />
                        </button>
                    )}
                </header>
                <main className="flex-1 overflow-auto relative p-4 lg:p-8 max-w-5xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
