import { ChangeDetectionStrategy, Component, inject, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './theme-toggle.component.html',
    styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
    private renderer = inject(Renderer2);

    public isDarkMode = false;

    toggleTheme(): void {
        this.isDarkMode = !this.isDarkMode;
        this.updateHtml();
    }

    private updateHtml(): void {
        const theme = this.isDarkMode ? 'dark' : 'light';
        this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
    }
}
