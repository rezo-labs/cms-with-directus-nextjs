import PostType from "./post_type";
import Translation from "./translation";

export default interface Post {
  id: number;
  thumbnail: string;
  translations: Translation<{
    post_id: number;
    title: string;
    description: string;
    content: string;
    details: Record<string, any>;
    slug: string;
  }>;
  status: string;
  publish_date: string;
  post_type: PostType;
};
