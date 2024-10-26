import { getPosts } from "@/sanity/sanity-utils";
import BlogItem from "@/components/Blog/BlogItem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blog - ${process.env.SITE_NAME}`,
  description: `This is Blog page for ${process.env.SITE_NAME}`,
};

const BlogGrid = async () => {
  const posts = await getPosts();
  console.log(posts);
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
