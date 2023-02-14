import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

const styled = {
  mainImage: "w-full h-40 object-cover ",
  articleContainer: "max-w-3xl mx-auto p-5",
  articleTitle: "text-3xl mt-10 mb-3",
  articleDescription: "text-xl font-light text-gray-500 mb-2",
  authorImage: "h-10 w-10 rounded-full",
  articleInfo: "font-extralight text-sm",
  authorText: "text-green-600",
  bodyHeading: "text-2xl font-bold my-5",
  bodySubheading: "text-xl font-bold my-5",
  bodyText: "ml-4 list-disc",
  bodyLinkText: "text-blue-500 hover:underline",
  horizontalLine: "max-w-lg my-5 mx-auto border border-yellow-500",
  commentForm: "flex flex-col p-5 my-10 max-w-2xl mx-auto mb-10",
  commentLabel: "block mb-5",
  commentSpan: "text-gray-700",
  commentInput:
    "shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500  outline-none focus:ring",
  commentText:
    "shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring",
  errorText: "text-red-500",
};

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />
      <img
        className={styled.mainImage}
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className={styled.articleContainer}>
        <h1 className={styled.articleTitle}>{post.title}</h1>
        <h2 className={styled.articleDescription}>{post.description}</h2>
        <div>
          <img
            className={styled.authorImage}
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className={styled.articleInfo}>
            Blog post by{" "}
            <span className={styled.authorText}>{post.author.name}</span> -
            Published at{" "}
            {new Date(post._createdAt).toLocaleString("en", {
              timeZoneName: "short",
            })}
          </p>
        </div>
        <div>
          <PortableText
            className=""
            dataset={process.env.MEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.MEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className={styled.bodyHeading} {...props} />
              ),
              h2: (props: any) => (
                <h1 className={styled.bodySubheading} {...props} />
              ),
              li: ({ children }: any) => (
                <li className={styled.bodyText}>{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className={styled.bodyLinkText}>
                  {children}
                </a>
              ),
              //img: ({ image }: any) => <img src={urlFor(image).url()!} />,
            }}
          />
        </div>
      </article>
      <hr className={styled.horizontalLine} />
      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form className={styled.commentForm} onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />
          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className={styled.commentLabel}>
            <span className={styled.commentSpan}>Name*</span>
            <input
              {...register("name", { required: true })}
              className={styled.commentInput}
              placeholder="John Smith"
              type="text"
            />
          </label>
          <label className={styled.commentLabel}>
            <span className={styled.commentSpan}>Email*</span>
            <input
              {...register("email", { required: true })}
              className={styled.commentInput}
              placeholder="john@email.com"
              type="email"
            />
          </label>
          <label className={styled.commentLabel}>
            <span className={styled.commentSpan}>Comment*</span>
            <textarea
              {...register("comment", { required: true })}
              className={styled.commentText}
              placeholder="John Smith"
              rows={8}
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className={styled.errorText}>
                - The Name Field is required
              </span>
            )}
            {errors.email && (
              <span className={styled.errorText}>
                - The Email Field is required
              </span>
            )}
            {errors.comment && (
              <span className={styled.errorText}>
                - The Comment Field is required
              </span>
            )}
          </div>
          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
          name,
          image
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body,
      }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });
  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60, //update every 60s
  };
};
