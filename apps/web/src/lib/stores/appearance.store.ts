import { browser } from '$app/environment';
import { orpc } from '$lib/orpc';

/**
 * Appearance Settings Types
 */

export type FontSize = '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20';
export type FontFamily = 'system-ui' | 'sans-serif' | 'monospace';
export type MessageDensity = 'compact' | 'comfortable' | 'spacious';

export interface AppearanceSettings {
	fontSize: FontSize;
	fontFamily: FontFamily;
	sidebarWidth: string;
	messageDensity: MessageDensity;
	themeId: string | null;
}

// Default settings values
const DEFAULT_SETTINGS: AppearanceSettings = {
	fontSize: '16',
	fontFamily: 'system-ui',
	sidebarWidth: '280',
	messageDensity: 'comfortable',
	themeId: null,
};

// Local storage key
const STORAGE_KEY = 'appearance-settings';

/**
 * Load settings from localStorage
 */
function loadFromStorage(): AppearanceSettings | null {
	if (!browser) return null;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored) as AppearanceSettings;
		}
	} catch (error) {
		console.error('Failed to load appearance settings from localStorage:', error);
	}

	return null;
}

/**
 * Save settings to localStorage
 */
function saveToStorage(settings: AppearanceSettings): void {
	if (!browser) return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (error) {
		console.error('Failed to save appearance settings to localStorage:', error);
	}
}

/**
 * Appearance Settings Store
 *
 * Manages appearance settings using Svelte 5 runes with localStorage sync.
 * Settings are persisted locally and can be synced to the backend.
 */
class AppearanceStore {
	// Reactive state using Svelte 5 runes
	settings = $state<AppearanceSettings>(
		loadFromStorage() || { ...DEFAULT_SETTINGS }
	);

	loading = $state(false);
	syncing = $state(false);
	error = $state<string | null>(null);

	constructor() {
		// Initialize settings on mount
		this.initialize();
	}

	/**
	 * Initialize settings - load from backend if available, otherwise use localStorage defaults
	 */
	async initialize(): Promise<void> {
		if (!browser) return;

		this.loading = true;
		this.error = null;

		try {
			// Try to load from backend first
			const backendSettings = await orpc.appearance.getSettings();

			if (backendSettings) {
				this.settings = {
					fontSize: backendSettings.fontSize as FontSize,
					fontFamily: backendSettings.fontFamily as FontFamily,
					sidebarWidth: backendSettings.sidebarWidth,
					messageDensity: backendSettings.messageDensity as MessageDensity,
					themeId: backendSettings.themeId,
				};

				// Sync to localStorage
				saveToStorage(this.settings);
			}
		} catch (error) {
			// Backend might not be available or user not authenticated
			// Use localStorage values as fallback
			console.info('Could not load settings from backend, using localStorage:', error);
			this.settings = loadFromStorage() || { ...DEFAULT_SETTINGS };
		} finally {
			this.loading = false;
		}
	}

	/**
	 * Update a single setting
	 */
	updateSetting<K extends keyof AppearanceSettings>(
		key: K,
		value: AppearanceSettings[K]
	): void {
		this.settings[key] = value;

		// Save to localStorage immediately
		saveToStorage(this.settings);

		// Schedule backend sync (debounced)
		this.scheduleSync();
	}

	/**
	 * Update multiple settings at once
	 */
	updateSettings(updates: Partial<Omit<AppearanceSettings, 'id'>>): void {
		this.settings = {
			...this.settings,
			...updates,
		};

		// Save to localStorage immediately
		saveToStorage(this.settings);

		// Schedule backend sync (debounced)
		this.scheduleSync();
	}

	/**
	 * Reset all settings to defaults
	 */
	async resetToDefaults(): Promise<void> {
		this.settings = { ...DEFAULT_SETTINGS };

		// Save to localStorage immediately
		saveToStorage(this.settings);

		// Sync to backend immediately
		await this.syncToBackend();

		// Also call reset API to ensure backend matches
		try {
			await orpc.appearance.resetSettings();
		} catch (error) {
			console.error('Failed to reset settings on backend:', error);
		}
	}

	/**
	 * Sync settings to backend (debounced)
	 */
	private syncTimeout: ReturnType<typeof setTimeout> | null = null;

	private scheduleSync(): void {
		if (this.syncTimeout) {
			clearTimeout(this.syncTimeout);
		}

		// Debounce sync to avoid too many API calls
		this.syncTimeout = setTimeout(() => {
			this.syncToBackend();
		}, 1000); // 1 second debounce
	}

	/**
	 * Sync settings to backend immediately
	 */
	async syncToBackend(): Promise<void> {
		if (!browser || this.syncing) return;

		this.syncing = true;
		this.error = null;

		try {
			await orpc.appearance.updateSettings({
				fontSize: this.settings.fontSize,
				fontFamily: this.settings.fontFamily,
				sidebarWidth: this.settings.sidebarWidth,
				messageDensity: this.settings.messageDensity,
				themeId: this.settings.themeId,
			});
		} catch (error) {
			this.error = 'Failed to sync settings to backend';
			console.error('Failed to sync appearance settings:', error);
			// Don't throw - localStorage is still the source of truth
		} finally {
			this.syncing = false;
		}
	}

	/**
	 * Get current settings value
	 */
	get currentSettings(): AppearanceSettings {
		return this.settings;
	}

	/**
	 * Subscribe to settings changes (for compatibility with Svelte stores)
	 */
	subscribe(run: (value: AppearanceSettings) => void) {
		// Run immediately with current value
		run(this.settings);

		// Return unsubscribe function
		return () => {
			// No-op for runes-based store
			// Components should use reactive $derived instead
		};
	}
}

// Create singleton instance
export const appearanceStore = new AppearanceStore();

// Export convenience functions for common operations
export function updateAppearanceSetting<K extends keyof AppearanceSettings>(
	key: K,
	value: AppearanceSettings[K]
): void {
	appearanceStore.updateSetting(key, value);
}

export function updateAppearanceSettings(
	updates: Partial<Omit<AppearanceSettings, 'id'>>
): void {
	appearanceStore.updateSettings(updates);
}

export function resetAppearanceToDefaults(): void {
	appearanceStore.resetToDefaults();
}

// Export settings object for direct access (use with $derived in components)
export const appearance = appearanceStore;
