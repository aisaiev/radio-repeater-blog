import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
    selector: 'app-header',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [ThemeToggleComponent],
})
export class HeaderComponent {}
