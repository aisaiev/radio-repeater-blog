export interface ArticleDto {
    id: number;
    title: string;
    summary: string;
    date: Date;
}

export interface ArticleWithContentDto extends ArticleDto {
    content: string;
    coverImageName: string;
    sourceFileName: string;
    transcriptions: TranscriptionDto[];
    rawTranscriptions: RawTranscriptionDto[];
}

export interface RawTranscriptionDto {
    id: number;
    start: string;
    end: string;
    content: string;
}

export interface TranscriptionDto extends RawTranscriptionDto {
    title: string;
}
