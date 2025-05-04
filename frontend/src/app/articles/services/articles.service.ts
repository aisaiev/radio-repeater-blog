import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { ArticleDto, ArticleWithContentDto } from '../dto/article.dto';
import { PaginationRequestDto, PaginationResponseDto } from '../../common/pagination.dto';

@Injectable({
    providedIn: 'root',
})
export class ArticlesService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/articles`;

    public getArticles(page: number): Observable<PaginationResponseDto<ArticleDto>> {
        const params = new HttpParams().set('page', page).set('pageSize', 5);
        return this.http.get<PaginationResponseDto<ArticleDto>>(this.apiUrl, { params }).pipe(
            tap((resp) => {
                resp.data.forEach((article) => {
                    article.date = new Date(article.date);
                });
            }),
            catchError((error) => {
                console.error('Error fetching articles', error);
                return EMPTY;
            })
        );
    }

    public getArticle(id: number): Observable<ArticleWithContentDto | null> {
        return this.http.get<ArticleWithContentDto>(`${this.apiUrl}/${id}`).pipe(
            tap((article) => {
                article.date = new Date(article.date);
            }),
            catchError((error) => {
                console.error('Error fetching article', error);
                return of(null);
            })
        );
    }
}
