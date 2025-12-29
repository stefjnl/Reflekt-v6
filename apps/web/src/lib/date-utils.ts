import { isAfter, isToday, isYesterday, startOfDay, subDays } from 'date-fns';

export type DateGroup = 'Today' | 'Yesterday' | 'Previous 30 Days' | 'Older';

export function getEntryGroup(date: Date): DateGroup {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';

    const thirtyDaysAgo = subDays(startOfDay(new Date()), 30);
    if (isAfter(date, thirtyDaysAgo)) return 'Previous 30 Days';

    return 'Older';
}

export function groupEntries<T extends { createdAt: Date | null | string }>(entries: T[]) {
    const groups: Record<DateGroup, T[]> = {
        'Today': [],
        'Yesterday': [],
        'Previous 30 Days': [],
        'Older': []
    };

    entries.forEach(entry => {
        if (!entry.createdAt) return;
        const date = typeof entry.createdAt === 'string' ? new Date(entry.createdAt) : entry.createdAt;
        const group = getEntryGroup(date);
        groups[group].push(entry);
    });

    return groups;
}
