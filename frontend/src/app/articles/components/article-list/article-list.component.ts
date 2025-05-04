import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { ArticleDto } from '../../dto/article.dto';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-article-list',
    imports: [RouterModule, DatePipe],
    templateUrl: './article-list.component.html',
    styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
    private readonly articlesService = inject(ArticlesService);

    public loading = signal(false);
    public articles = signal<ArticleDto[]>([]);
    public page = signal(1);
    public total = signal(0);
    public canLoadMore = computed(() => this.articles().length < this.total());
    public isChildRouteActivated = signal(false);

    public ngOnInit(): void {
        this.loadArticles(this.page());
    }

    public loadArticles(page: number): void {
        this.loading.set(true);
        this.articlesService
            .getArticles(page)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe((resp) => {
                this.articles.update((articles) => [...articles, ...resp.data]);
                this.page.set(resp.page);
                this.total.set(resp.total);
            });
    }
}
