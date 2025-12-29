'use client';

import { Sidebar } from '@/features/sidebar/sidebar';
import { uiStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useSnapshot } from 'valtio';

export function Shell({ children, entries }: { children: React.ReactNode, entries?: any[] }) {
    const { sidebarOpen } = useSnapshot(uiStore);

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#131314] text-[#1f1f1f] dark:text-[#e3e3e3]">
            <Sidebar entries={entries} />
            <div
                className={cn(
                    "flex-1 h-full flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden",
                    sidebarOpen ? "ml-[280px]" : "ml-0"
                )}
            >
                <header className={cn("h-16 flex items-center px-4 shrink-0 gap-2 z-10 transition-opacity duration-300", sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100")}>
                    {!sidebarOpen && (
                        <button onClick={() => uiStore.toggleSidebar()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
                            <Menu size={20} />
                        </button>
                    )}
                </header>
                <main className="flex-1 overflow-auto relative p-4 lg:p-0 max-w-4xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
