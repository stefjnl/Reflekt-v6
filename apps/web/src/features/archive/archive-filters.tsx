'use client';

import { Calendar, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function ArchiveFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Local state for immediate feedback
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [fromDate, setFromDate] = useState(searchParams.get('from') || '');
    const [toDate, setToDate] = useState(searchParams.get('to') || '');

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1'); // Reset pagination
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleDateChange = (key: 'from' | 'to', value: string) => {
        if (key === 'from') setFromDate(value);
        else setToDate(value);

        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFromDate('');
        setToDate('');
        replace(pathname);
    };

    const hasActiveFilters = searchTerm || fromDate || toDate;

    return (
        <div className="w-full space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search entries..."
                        className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        value={searchTerm}
                    />
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                        <input
                            type="date"
                            className="h-10 pl-10 pr-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-600 dark:text-slate-300 w-40"
                            onChange={(e) => handleDateChange('from', e.target.value)}
                            value={fromDate}
                        />
                    </div>
                    <span className="text-slate-400 text-sm">to</span>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                        <input
                            type="date"
                            className="h-10 pl-10 pr-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-600 dark:text-slate-300 w-40"
                            onChange={(e) => handleDateChange('to', e.target.value)}
                            value={toDate}
                        />
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="h-10 px-3 flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    >
                        <X size={16} />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
