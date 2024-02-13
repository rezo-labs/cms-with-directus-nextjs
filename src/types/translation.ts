type Translation<T extends {}> = Array<
  T & {
    id: number;
    languages_code: string;
  }
>;

export default Translation;
