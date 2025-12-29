import { proxy } from 'valtio';

interface UIState {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const uiStore = proxy<UIState>({
    sidebarOpen: true,
    toggleSidebar: () => {
        uiStore.sidebarOpen = !uiStore.sidebarOpen;
    },
    setSidebarOpen: (open: boolean) => {
        uiStore.sidebarOpen = open;
    }
});
