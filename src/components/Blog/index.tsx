import React from "react";
import BlogItem from "@/components/Blog/BlogItem";
import { getPosts } from "@/sanity/sanity-utils";

const Blog = async () => {
  const posts = await getPosts();

  return (
    <section className="pb-[60px] pt-[110px]" id="blog">
      <div className="container">
        <div
          className="wow fadeInUp mx-auto mb-14 max-w-[690px] text-center lg:mb-[70px]"
          data-wow-delay=".2s"
        >
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[44px] md:leading-tight">
            Latest News & Blogs
          </h2>
          <p className="text-base text-body">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
            convallis tortor eros. Donec vitae tortor lacus. Phasellus aliquam
            ante in maximus.
          </p>
        </div>
      </div>

      <div className="container overflow-hidden lg:max-w-[1250px]">
        <div className="-mx-4 flex flex-wrap justify-center md:-mx-7 lg:-mx-5 xl:-mx-[35px]">
          {/* <!-- blog item --> */}
          {posts?.length > 0 ? (
            posts
              ?.slice(0, 3)
              .map((item, key: number) => <BlogItem blog={item} key={key} />)
          ) : (
            <p>No posts found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
