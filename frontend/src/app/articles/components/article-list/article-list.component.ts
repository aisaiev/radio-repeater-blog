import { Component, Input, computed, inject, OnInit, signal } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { ArticleDto } from '../../dto/article.dto';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SearchComponent } from '../../../common/components/search/search.component';

@Component({
    selector: 'app-article-list',
    imports: [RouterModule, DatePipe, SearchComponent],
    templateUrl: './article-list.component.html',
    styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
    private readonly articlesService = inject(ArticlesService);

    public loading = signal(false);
    public articles = signal<ArticleDto[]>([]);
    public page = signal(1);
    public total = signal(0);
    public searchTerm = signal('');
    public canLoadMore = computed(() => this.articles().length < this.total());
    public isChildRouteActivated = signal(false);

    public ngOnInit(): void {
        this.loadArticles(this.page());
    }

    public searchTermChanged(searchTerm: string): void {
        this.searchTerm.set(searchTerm);
        this.page.set(1);
        this.articles.set([]);
        this.loadArticles(this.page(), searchTerm);
    }

    public loadArticles(page: number, searchTerm?: string): void {
        this.loading.set(true);
        this.articlesService
            .getArticles(page, searchTerm)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe((resp) => {
                this.articles.update((articles) => [...articles, ...resp.data]);
                this.page.set(resp.page);
                this.total.set(resp.total);
            });
    }
}
