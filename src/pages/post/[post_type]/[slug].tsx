import { Inter } from "next/font/google";
import api from "@/utils/api";
import { APIResponse } from "@/types/api_response";
import Post from "@/types/post";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface BlogProps {
  post: Post;
}

export default function Blog({ post }: BlogProps) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <nav className="text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>{post.title}</span>
      </nav>
      <article className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-2">Published on: {new Date(post.publish_date).toLocaleDateString()}</p>
        <div className="mb-4">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${post.thumbnail}`}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}

export const getStaticProps: GetStaticProps<BlogProps> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  try {
    const {
      data: { data: posts },
    } = await api.get<APIResponse<Post[]>>(`/items/post`, {
      params: {
        fields: [
          '*',
          'post_type.*'
        ],
        filter: {
          slug: params.slug,
          post_type: {
            name: params.post_type
          },
          status: 'published',
        },
      },
    });

    if (!posts.length) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        post: posts[0],
      },
      revalidate: 60,
    };
  } catch (_err) {
    return {
      notFound: true,
    };
  }
};

export async function getStaticPaths() {
  try {
    const {
      data: { data: posts },
    } = await api.get<APIResponse<Post[]>>('/items/post', {
      params: {
        fields: [
          'post_type.name',
          'slug',
        ],
        filter: {
          status: 'published',
        },
      },
    });

    const paths = posts.map((post) => ({
      params: {
        post_type: post.post_type.name,
        slug: post.slug,
      },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (_err) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}
