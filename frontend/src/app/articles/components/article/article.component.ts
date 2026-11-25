import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';
import { ArticleWithContentDto, RawTranscriptionDto } from '../../dto/article.dto';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-article',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, DatePipe, FormsModule],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit, OnDestroy {
    private readonly audioPlayer = viewChild<ElementRef<HTMLAudioElement>>('audioPlayer');

    private readonly articlesService = inject(ArticlesService);
    private readonly router = inject(Router);
    private readonly location = inject(Location);
    private readonly title = inject(Title);
    private readonly siteTitle = 'Блог ретранслятора К1';

    public articleId = input.required<number>({ alias: 'id' });

    public loading = signal(false);
    public article = signal<ArticleWithContentDto | null>(null);
    public activeTranscriptionId = signal<number | null>(null);
    public transcriptionView = signal(false);
    public apiUrl = environment.apiUrl;

    ngOnInit(): void {
        this.loadArticle();
    }

    ngOnDestroy(): void {
        this.title.setTitle(this.siteTitle);
    }

    private loadArticle(): void {
        this.loading.set(true);
        this.articlesService
            .getArticle(this.articleId())
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe((article) => {
                if (!article) {
                    this.router.navigate(['']);
                } else {
                    this.title.setTitle(`${article.title} — ${this.siteTitle}`);
                }
                this.article.set(article);
            });
    }

    public setAudioTime(transcription: RawTranscriptionDto): void {
        this.activeTranscriptionId.set(transcription.id);
        const audioPlayer = this.audioPlayer()?.nativeElement;
        if (audioPlayer) {
            audioPlayer.currentTime = this.converTimeStringToSeconds(transcription.start) + 0.1;
        }
    }

    private converTimeStringToSeconds(timeString: string): number {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    public setDefaultImageOnError(image: HTMLImageElement): void {
        image.src = `${this.apiUrl}/assets/img/default.avif`;
    }

    public onAudioTimeUpdate(currentTime: number): void {
        const transcriptions = !this.transcriptionView() ? this.article()!.transcriptions : this.article()!.rawTranscriptions;

        const activeTranscriptionId = this.findActiveTranscriptionId(transcriptions, currentTime);
        this.activeTranscriptionId.set(activeTranscriptionId || null);
    }

    public goBack(event: Event): void {
        event.preventDefault();
        // Opened by a direct link: there is no list to go back to
        if ((history.state?.navigationId ?? 1) > 1) {
            this.location.back();
        } else {
            this.router.navigate(['']);
        }
    }

    private findActiveTranscriptionId(transcriptions: RawTranscriptionDto[], currentTime: number): number | null {
        return (
            transcriptions.find(
                (transcription) =>
                    this.converTimeStringToSeconds(transcription.start) <= currentTime &&
                    this.converTimeStringToSeconds(transcription.end) >= currentTime,
            )?.id ?? null
        );
    }
}
