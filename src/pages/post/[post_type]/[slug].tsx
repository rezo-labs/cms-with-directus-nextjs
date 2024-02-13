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
      className={`flex flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <nav className="text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>{post.translations[0].title}</span>
      </nav>
      <article className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">{post.translations[0].title}</h1>
        <p className="text-gray-500 mb-2">Published on: {new Date(post.publish_date).toLocaleDateString()}</p>
        <div className="mb-4">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${post.thumbnail}`}
            alt={post.translations[0].title}
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.translations[0].content }} />
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
          'translations.*',
          'post_type.*',
          'post_type.translations.*',
        ],
        filter: {
          translations: {
            slug: params.slug,
          },
          post_type: {
            translations: {
              slug: params.post_type,
            },
          },
          status: 'published',
        },
        deep: {
          translations: {
            _filter: {
              slug: params.slug,
            },
          },
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
          'post_type.translations.languages_code',
          'post_type.translations.slug',
          'translations.languages_code',
          'translations.slug',
        ],
        filter: {
          status: 'published',
        },
      },
    });

    const paths = posts.map((post) => {
      const languages = post.translations.map((translation) => translation.languages_code);
      return languages.map((lang) => ({
        params: {
          post_type: post.post_type.translations.find((translation) => translation.languages_code === lang)?.slug,
          slug: post.translations.find((translation) => translation.languages_code === lang)?.slug,
        },
      }));
    }).flat(1);

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
