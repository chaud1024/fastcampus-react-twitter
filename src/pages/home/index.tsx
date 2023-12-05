import PostBox from "components/posts/PostBox";
import PostForm from "components/posts/PostForm";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  porfileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "test@test.com",
    content: "test1",
    createdAt: "2022-01-01",
    uid: "123",
  },
  {
    id: "2",
    email: "test@test.com",
    content: "test2",
    createdAt: "2022-01-01",
    uid: "123",
  },
  {
    id: "3",
    email: "test@test.com",
    content: "test3",
    createdAt: "2022-01-01",
    uid: "123",
  },
  {
    id: "4",
    email: "test@test.com",
    content: "test4",
    createdAt: "2022-01-01",
    uid: "123",
  },
  {
    id: "5",
    email: "test@test.com",
    content: "test5",
    createdAt: "2022-01-01",
    uid: "123",
  },
];
export default function Homepage() {
  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For You</div>
        <div className="home__tab home__tab">Following</div>
      </div>
      <PostForm />
      <div className="post">
        {posts?.map((post) => (
          <PostBox post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
