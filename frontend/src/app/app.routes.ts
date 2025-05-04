import { Routes } from '@angular/router';
import { ArticleListComponent } from './articles/components/article-list/article-list.component';

export const routes: Routes = [
    {
        path: '',
        component: ArticleListComponent,
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
