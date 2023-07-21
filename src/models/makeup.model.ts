export interface IMakeUp {
  id: number;
  date?: string;
  author: number;
  acf: {
    origin: string;
    class_name: string;
    deadline: string;
    make_up?: string;
  }
}