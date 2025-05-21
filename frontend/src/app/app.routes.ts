import { Routes } from '@angular/router';
import { ContentAreaComponent } from './content-area/content-area.component';

export const routes: Routes = [
    {
        path: '',
        component: ContentAreaComponent,
        children: [
            {
                path: 'article/:id',
                loadComponent: () => import('./articles/components/article/article.component').then((c) => c.ArticleComponent),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    }
];
