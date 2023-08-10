export interface IMakeUp {
  id: number;
  date?: string;
  author: number;
  acf: {
    origin: string;
    product_id: number;
    product_name: string;
    deadline: string;
    make_up?: string;
  }
}