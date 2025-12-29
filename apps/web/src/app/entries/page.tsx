import { ArchiveFilters } from "@/features/archive/archive-filters";
import { db, entries as entriesTable } from "@reflekt/db";
import { format } from 'date-fns';
import { and, desc, gte, ilike, lte, sql } from "drizzle-orm";
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

export default async function ArchivePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const q = typeof params.q === 'string' ? params.q : '';
    const from = typeof params.from === 'string' ? params.from : null;
    const to = typeof params.to === 'string' ? params.to : null;

    const offset = (page - 1) * ITEMS_PER_PAGE;

    // Filter Logic
    const filters = [];
    if (q) filters.push(ilike(entriesTable.title, `%${q}%`));
    if (from) filters.push(gte(entriesTable.createdAt, new Date(from)));
    // Add 1 day to 'to' to include the full day
    if (to) {
        const toDate = new Date(to);
        toDate.setDate(toDate.getDate() + 1);
        filters.push(lte(entriesTable.createdAt, toDate));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    // Data Fetching
    const [data, totalResult] = await Promise.all([
        db.select()
            .from(entriesTable)
            .where(whereClause)
            .orderBy(desc(entriesTable.createdAt))
            .limit(ITEMS_PER_PAGE)
            .offset(offset),
        db.select({ count: sql<number>`count(*)` })
            .from(entriesTable)
            .where(whereClause)
    ]);

    const totalItems = Number(totalResult[0]?.count || 0);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Archive</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    {totalItems} entries across time.
                </p>
            </div>

            <ArchiveFilters />

            <div className="space-y-4">
                {data.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500">No entries found for these filters.</p>
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {data.map((entry) => (
                            <Link
                                key={entry.id}
                                href={`/entry/${entry.id}`}
                                className="group block relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                                                {entry.title || 'Untitled Entry'}
                                            </h3>
                                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
                                                {entry.createdAt ? format(new Date(entry.createdAt), 'MMMM d, yyyy') : 'Unknown Date'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <ChevronRight className="text-slate-300 dark:text-slate-600" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-12">
                    <Link
                        href={`/entries?page=${page - 1}${q ? `&q=${q}` : ''}${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`}
                        className={`p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Page {page} of {totalPages}
                    </span>
                    <Link
                        href={`/entries?page=${page + 1}${q ? `&q=${q}` : ''}${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`}
                        className={`p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
            )}
        </div>
    );
}
