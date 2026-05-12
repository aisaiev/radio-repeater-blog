import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, OnDestroy, OnInit, output, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-search',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    public searchControl = new FormControl('');
    public searchTermChange = output<string>();

    public ngOnInit(): void {
        this.searchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            this.searchTermChange.emit(value ?? '');
        });
    }
}
