export class CreateArticleRequest {
  title: string;
  summary: string;
  content: string;
  date: string;
  coverImageName: string;
  sourceFileName: string;
  transcriptions: {
    title: string;
    start: string;
    end: string;
    content: string;
  }[];
  rawTranscriptions: {
    start: string;
    end: string;
    content: string;
  }[];
}
