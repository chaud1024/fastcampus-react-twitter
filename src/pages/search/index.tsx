import PostBox from "components/posts/PostBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";

export default function SearchPage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>("");

  // console.log(tagQuery);

  const handleChange = (e: any) => {
    setTagQuery(e?.target?.value?.trim());
  };

  useEffect(() => {
    // 만약 user가 있을 때
    if (user) {
      // postsRef는 firestore의 "posts"라는 이름의 db collection 이다.
      let postsRef = collection(db, "posts");
      // postsQuery는 postsRef안에서 where문을 사용하는데, hashTags라는 필드중에 "array-contains-any"라는 연산자를 사용할것이고, 어떠한 값이 그 배열(array)에 포함(contain)되어야하느냐는 tagQuery가 포함(contain)되어야 함을 명시
      // 또한 tagQuery가 포함(contain)된 배열(array)를 orderBy를 통해 정렬함
      let postsQuery = query(
        postsRef,
        where("hashTags", "array-contains-any", [tagQuery]),
        orderBy("createdAt", "desc"),
      );

      onSnapshot(postsQuery, (snapshot) => {
        let dataObj = snapshot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));

        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home__title-text">Search</div>
        </div>
        <div className="home__search-div">
          <input
            type="text"
            className="home__search"
            placeholder="해시태그 검색"
            onChange={handleChange}
          />
        </div>
        <div className="post">
          {posts?.length > 0 ? (
            posts.map((post) => <PostBox post={post} key={post.id} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
