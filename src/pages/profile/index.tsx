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
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const PROFILE_DEFAULT_URL = "/logo512.png";

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      // postsRef 는 현재 로그인된 유저의 uid와 동일한 경우만 가져온다: 즉 로그인한 유저의 글만 가져온다
      let postsQuery = query(
        postsRef,
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc"),
      );

      onSnapshot(postsQuery, (snapshot) => {
        let dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        console.log(dataObj);
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user]);
  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Profile</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="profile"
            className="profile__image"
            width={100}
            height={100}
          />
          <button
            type="button"
            className="profile__btn"
            onClick={() => {
              navigate("/profile/edit");
            }}>
            Edit profile
          </button>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || "사용자님"}</div>
          <div className="profile__name">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">Your posts</div>
          <div className="home__tab home__tab">Liked</div>
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
