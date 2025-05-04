import { Component } from '@angular/core';
import { ArticleListComponent } from '../articles/components/article-list/article-list.component';

@Component({
    selector: 'app-content-area-component',
    imports: [ArticleListComponent],
    templateUrl: './content-area-component.component.html',
    styleUrl: './content-area-component.component.scss',
})
export class ContentAreaComponentComponent {}
