# Archive Page Design Specification

## Overview
The Archive page (`/entries`) is a dedicated view for browsing the user's complete history of 2,000+ entries. It emphasizes readability, efficient navigation (filtering/searching), and a premium "Gemini-like" aesthetic.

## Functional Requirements
1.  **Server-Side Pagination**: Efficiently load entries in chunks (e.g., 20 per page) to handle the large dataset.
2.  **Search**: Keyword search across entry titles and content.
3.  **Date Range Filter**: Filter entries within a specific "From" and "To" date range.
4.  **Navigation**: Simple "Next" / "Previous" pagination controls.

## UI/UX Design

### Theme
-   **Gemini Aesthetic**: Deep space gray backgrounds (`#0a0a0a` to `#171717`), cool blue/purple accent glows, high contrast white text.
-   **Glassmorphism**: Subtle backdrop blurs on sticky headers and overlays.

### Layout
-   **Header**: Sticky top bar containing the Search Input and Date Range Picker.
-   **List View**: A clean vertical list of entry cards.
    -   **Card**: Minimalist. Date on the left (or top), Title prominent, short excerpt (optional).
    -   **Hover Effect**: Subtle glow or background shift on hover.

### Components

#### 1. Filter Bar
-   **Search Input**:
    -   Pill-shaped or rounded rectangle.
    -   Icon: Magnifying glass (Lucide `Search`).
    -   State: Focus ring with subtle blue glow.
-   **Date Picker**:
    -   Two inputs: "From" and "To".
    -   Styling: Consistent with text inputs.

#### 2. Entry List
-   **Grid/List**: Masonry or simple vertical stack. Vertical stack is preferred for "Chat/Diary" logs.
-   **Typography**: `Inter`.
    -   Dates: Small, uppercase tracking-wider, slate-400.
    -   Titles: Medium weight, white/slate-100.

## Technical Implementation
-   **Path**: `apps/web/src/app/entries/page.tsx`
-   **Data Fetching**: Server Component using `drizzle-orm` queries.
-   **State**: URL Search Params (`?q=...&from=...&page=...`) for shareable, stateless views.
-   **Database**: `db.query.entries.findMany` with `where` clauses constructed dynamically.
