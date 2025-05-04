import { Component, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-theme-toggle',
    templateUrl: './theme-toggle.component.html',
    styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
    public isDarkMode = false;

    constructor(private renderer: Renderer2) {}

    toggleTheme(): void {
        this.isDarkMode = !this.isDarkMode;
        this.updateHtml();
    }

    private updateHtml(): void {
        const theme = this.isDarkMode ? 'dark' : 'light';
        this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
    }
}
