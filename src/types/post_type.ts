import Translation from "./translation";

export default interface PostType {
  id: number;
  translations: Translation<{
    post_type_id: number;
    name: string;
    slug: string;
    description: string;
  }>;
  thumbnail: string;
  icon: string;
};
