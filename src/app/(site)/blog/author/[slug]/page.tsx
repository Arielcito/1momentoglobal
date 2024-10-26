import { getPostsByAuthor, getAuthorBySlug } from "@/sanity/sanity-utils";
import BlogItem from "@/components/Blog/BlogItem";
import { Author } from "@/types/blog";
import Image from "next/image";
import { imageBuilder } from "@/sanity/sanity-utils";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const { slug } = params;
  const author = (await getAuthorBySlug(slug)) as Author;
  const siteURL = process.env.SITE_URL;
  const authorName = process.env.AUTHOR_NAME;

  if (author) {
    return {
      title: `${
        author.name || "Author Page"
      } | ${authorName} - Next.js SaaS Starter Kit`,
      description: author.bio,
      author: authorName,

      robots: {
        index: false,
        follow: false,
        nocache: true,
      },

      openGraph: {
        title: `${author.name} | ${authorName}`,
        description: author.bio,
        url: `${siteURL}/blog/author/${slug}`,
        siteName: authorName,
        images: [
          {
            url: imageBuilder(author.image).url(),
            width: 343,
            height: 343,
            alt: author.name,
          },
        ],
        locale: "en_US",
        type: "article",
      },

      twitter: {
        card: "summary_large_image",
        title: `${author.name} | ${authorName}`,
        description: `${author.bio?.slice(0, 136)}...`,
        creator: `@${authorName}`,
        site: `@${authorName}`,
        images: [imageBuilder(author.image).url()],
        url: `${siteURL}/blog/author/${slug}`,
      },
    };
  } else {
    return {
      title: "Not Found",
      description: "No Author Found has been found",
    };
  }
}

const BlogGrid = async ({ params }: Props) => {
  const { slug } = params;

  const posts = await getPostsByAuthor(slug);
  const author = (await getAuthorBySlug(slug)) as Author;

  return (
    <main>
      <section className="pb-[60px] pt-[150px] lg:pt-[220px]">
        <div className="container overflow-hidden lg:max-w-[1250px]">
          <div className="-mx-4 flex flex-wrap justify-center md:-mx-7 lg:-mx-5 xl:-mx-[35px]">
            {/* Blog Item */}
            {posts?.length > 0 ? (
              posts?.map((item, key) => <BlogItem key={key} blog={item} />)
            ) : (
              <p>No posts available!</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogGrid;
