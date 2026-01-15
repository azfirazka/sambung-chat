export { default as AppLayout } from './AppLayout.svelte';
export { default as AuthLayout } from './AuthLayout.svelte';
export { default as Header } from './Header.svelte';
export { default as LayoutHeader } from './Header.svelte'; // Alias for backwards compatibility
export { default as NavigationRail } from './NavigationRail.svelte';
export { default as ThemeProvider } from './ThemeProvider.svelte';
export { default as UserMenu } from './UserMenu.svelte';

// Secondary Sidebar components
export { ChatList, PromptsCategories, MembersList } from './secondary-sidebar';

export type { HeaderProps } from './Header.svelte';
export type { AppLayoutProps } from './AppLayout.svelte';
export type { NavigationRailProps } from './NavigationRail.svelte';
export type { UserMenuProps, Team, Workspace } from './UserMenu.svelte';
