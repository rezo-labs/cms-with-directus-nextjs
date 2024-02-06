import { Inter } from "next/font/google";
import api from "@/utils/api";
import { APIResponse } from "@/types/api_response";
import Post from "@/types/post";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <h1 className="text-3xl font-bold">CMS with Directus & Next.js</h1>

        <div>All posts</div>

        <div className="grid gap-4 grid-cols-3 py-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.post_type.name}/${post.slug}`}>
              <div key={post.id} className="bg-gray-100 p-4 shadow-md rounded-md hover:shadow-lg transition duration-300">
                <Image src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${post.thumbnail}`} alt={post.title} width={300} height={200} />
                <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
                <p className="text-gray-600 mt-2">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const {
      data: { data: posts },
    } = await api.get<APIResponse<Post[]>>('/items/post', {
      params: {
        fields: [
          '*',
          'post_type.*'
        ],
        filter: {
          status: 'published',
        },
      },
    });


    return {
      props: {
        posts,
      },
      revalidate: 60,
    };
  } catch (_err) {
    return {
      notFound: true,
    };
  }
};
