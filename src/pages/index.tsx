import { Inter } from "next/font/google";
import api from "@/utils/api";
import { APIResponse } from "@/types/api_response";
import Post from "@/types/post";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Language from "@/types/language";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  posts: Post[];
  languages: Language[];
}

export default function Home({ posts, languages }: HomeProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(languages[0]);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">CMS with Directus & Next.js</h1>

          <select
            className="p-2 bg-gray-100 rounded-md"
            value={selectedLanguage?.code}
            onChange={(e) => {
              const selectedLanguageId = e.target.value;
              const selectedLanguage = languages.find(
                (language) => language.code === selectedLanguageId
              );
              if (selectedLanguage) {
                handleLanguageChange(selectedLanguage);
              }
            }}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
        <div>All posts</div>

        <div className="grid gap-4 grid-cols-3 py-8">
          {posts.map((post) => {
            const translation = post.translations.find(
              (translation) =>
                translation.languages_code === selectedLanguage?.code
            );
            const postTypeTranslation = post.post_type.translations.find(
              (translation) =>
                translation.languages_code === selectedLanguage?.code
            );

            if (!translation || !postTypeTranslation) {
              return null;
            }

            return (
              <Link key={post.id} href={`/post/${postTypeTranslation.slug}/${translation.slug}`}>
                <div key={post.id} className="bg-gray-100 p-4 shadow-md rounded-md hover:shadow-lg transition duration-300">
                  <Image src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${post.thumbnail}`} alt={translation.title} width={300} height={200} />
                  <h2 className="text-xl font-semibold mt-2">{translation.title}</h2>
                  <p className="text-gray-600 mt-2">{translation.description}</p>
                </div>
              </Link>
            );
          })}
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
          'translations.*',
          'post_type.*',
          'post_type.translations.*',
        ],
        filter: {
          status: 'published',
        },
      },
    });

    const {
      data: { data: languages },
    } = await api.get<APIResponse<Language[]>>('/items/languages');

    return {
      props: {
        posts,
        languages,
      },
      revalidate: 60,
    };
  } catch (_err) {
    return {
      notFound: true,
    };
  }
};
