import { Component } from '@angular/core';
import { ArticleListComponent } from '../articles/components/article-list/article-list.component';

@Component({
    selector: 'app-content-area-component',
    imports: [ArticleListComponent],
    templateUrl: './content-area.component.html',
    styleUrl: './content-area.component.scss',
})
export class ContentAreaComponent {}
