import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
import Link from "next/link";

const styled = {
  main: "max-w-7xl mx-auto",
  hero: "flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0",
  headingContainer: "px-10 space-y-5",
  heading: "text-6xl max-w-xl font-serif",
  headingName: "underline decoration-black decoration-4",
  logoImage: "hidden md:inline-flex h-32 lg:h-full",
  postsContainer:
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6",
  postContainer: "border rounded-lg group cursor-pointer overflow-hidden",
  postImage:
    "h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out",
  postDetails: "flex justify-between p-5 bg-white",
  postTitle: "text-lg font-bold",
  postDescription: "text-xs",
  authorImage: "h-12 w-12 rounded-full",
};

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  return (
    <div className={styled.main}>
      <Head>
        <title>stormlog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styled.hero}>
        <div className={styled.headingContainer}>
          <h1 className={styled.heading}>
            <span className={styled.headingName}>stormlog</span> is a place to
            write, read and connect
          </h1>
        </div>
        <div>
          <h2>
            It's easy and free to post your thinking on any topic and connect
            with millions of readers
          </h2>
        </div>
        <img
          className={styled.logoImage}
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt=""
        />
      </div>
      <div className={styled.postsContainer}>
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className={styled.postContainer}>
              <img
                className={styled.postImage}
                src={urlFor(post.mainImage).url()!}
                alt=""
              />
              <div className={styled.postDetails}>
                <div>
                  <p className={styled.postTitle}>{post.title}</p>
                  <p className={styled.postDescription}>
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className={styled.authorImage}
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
      author -> {
        name,
        image
      },
      description,
      mainImage,
      slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
