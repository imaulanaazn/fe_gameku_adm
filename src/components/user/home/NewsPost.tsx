import Link from "next/link";
import CardBlog from "./CardPost";

interface INewsPostProps {
  posts: INewsPost[];
}

const NewsPost: React.FC<INewsPostProps> = ({ posts }) => {
  return (
    <div className="py-20 bg-white mx-auto">
      <div className="container mx-auto sm:px-0 px-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-montserrat font-light text-xs tracking-widest">
            TAKE A LOOK
          </p>
          <h1 className=" font-semibold text-3xl">Event and News</h1>
          <div className="h-px bg-[#B72025] w-10"></div>
        </div>
        <div className="pt-20 sm:px-10 grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((blog, i) => (
            <CardBlog blog={blog} key={blog.id} />
          ))}
        </div>
        <div className="mx-auto pt-10 text-center">
          <Link
            href="/posts"
            className="text-[#B72025]  font-bold hover:text-[#d46b6f]"
          >
            Read more...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsPost;
