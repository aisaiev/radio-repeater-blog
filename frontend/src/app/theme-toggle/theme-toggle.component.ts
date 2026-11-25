import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './theme-toggle.component.html',
    styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
    public isDarkMode = signal(this.isDarkActive());

    toggleTheme(): void {
        const theme = this.isDarkMode() ? 'light' : 'dark';
        this.isDarkMode.set(theme === 'dark');
        document.documentElement.dataset['theme'] = theme;
        try {
            localStorage.setItem('theme', theme);
        } catch {
            // Storage may be unavailable; the theme still applies for this visit
        }
    }

    private isDarkActive(): boolean {
        const theme = document.documentElement.dataset['theme'];
        return theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    }
}
