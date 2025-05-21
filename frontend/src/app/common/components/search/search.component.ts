import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-search',
    imports: [ReactiveFormsModule],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
    public searchControl = new FormControl('');
    private destroy$ = new Subject<void>();

    @Output() public searchTermChange = new EventEmitter<string>();

    public ngOnInit(): void {
        this.searchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value) => {
            this.searchTermChange.emit(value ?? '');
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
