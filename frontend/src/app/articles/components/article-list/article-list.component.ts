import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ArticlesService } from '../../services/articles.service';
import { ArticleDto } from '../../dto/article.dto';
import { catchError, EMPTY, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SearchComponent } from '../../../common/components/search/search.component';

@Component({
    selector: 'app-article-list',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, DatePipe, SearchComponent],
    templateUrl: './article-list.component.html',
    styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
    private readonly articlesService = inject(ArticlesService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly loadRequests = new Subject<{ page: number; searchTerm: string }>();

    private requestedPage = 1;

    public loading = signal(false);
    public failed = signal(false);
    public articles = signal<ArticleDto[]>([]);
    public page = signal(1);
    public total = signal(0);
    public searchTerm = signal('');
    public canLoadMore = computed(() => this.articles().length < this.total());
    public isChildRouteActivated = signal(false);

    public ngOnInit(): void {
        // switchMap drops a stale response when a newer search starts
        this.loadRequests
            .pipe(
                tap(() => {
                    this.loading.set(true);
                    this.failed.set(false);
                }),
                switchMap(({ page, searchTerm }) =>
                    this.articlesService.getArticles(page, searchTerm).pipe(
                        tap((resp) => {
                            this.articles.update((articles) => (page === 1 ? resp.data : [...articles, ...resp.data]));
                            this.page.set(resp.page);
                            this.total.set(resp.total);
                            this.loading.set(false);
                        }),
                        catchError((error) => {
                            console.error('Error fetching articles', error);
                            this.failed.set(true);
                            this.loading.set(false);
                            return EMPTY;
                        }),
                    ),
                ),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.loadArticles(1);
    }

    public searchTermChanged(searchTerm: string): void {
        this.searchTerm.set(searchTerm);
        this.page.set(1);
        this.loadArticles(1);
    }

    public retry(): void {
        this.loadArticles(this.requestedPage);
    }

    public loadArticles(page: number): void {
        this.requestedPage = page;
        this.loadRequests.next({ page, searchTerm: this.searchTerm() });
    }
}
