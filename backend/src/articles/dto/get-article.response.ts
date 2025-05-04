export class GetArticleResponse {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  coverImageName: string | null;
  sourceFileName: string | null;
  transcriptions: {
    id: number;
    title: string | null;
    start: string;
    end: string;
    content: string;
  }[];
  rawTranscriptions: {
    id: number;
    start: string;
    end: string;
    content: string;
  }[];
}
