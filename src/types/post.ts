import PostType from "./post_type";

export default interface Post {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  content: string;
  slug: string;
  status: string;
  publish_date: string;
  post_type: PostType;
};
