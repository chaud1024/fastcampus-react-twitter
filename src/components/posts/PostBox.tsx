import FollowingBox from "components/following/FollowingBox";
import AuthContext from "context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // fire storage에 있는 이미지의 ref 할당
  const imgRef = ref(storage, post?.imageUrl);

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

    if (confirm) {
      // fire storage 이미지 먼저 삭제
      // Delete the file
      deleteObject(imgRef)
        .then(() => {
          // File deleted successfully => 이 부분 생략 가능
        })
        .catch((error) => {
          console.log(error);
        });
      await deleteDoc(doc(db, "posts", post?.id));
      toast.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };

  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    if (user?.uid && post?.likes?.includes(user?.uid)) {
      // 사용자가 이미 좋아요를 누른 경우 -> 좋아요 취소
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
    } else {
      // 사용자가 좋아요를 누르지 않은 경우 -> 좋아요 추가
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      });
    }
  };

  return (
    <div className="post__box" key={post?.id}>
      <div className="post__box-profile">
        <div className="post__flex">
          {post?.porfileUrl ? (
            <img
              src={post?.porfileUrl}
              alt="profile"
              className="post__box-profile-img "
            />
          ) : (
            <FaUserCircle className="post__box-profile-icon" />
          )}
          <div className="post__flex--between">
            <div className="post__flex">
              <div className="post__email">{post?.email}</div>
              <div className="post__createdAt">{post?.createdAt}</div>
            </div>
            <FollowingBox post={post} />
          </div>
        </div>

        <Link to={`/posts/${post?.id}`}>
          <div className="post__box-content">{post?.content}</div>
          {post?.imageUrl && (
            <div className="post__image-div">
              <img
                src={post?.imageUrl}
                alt="post img"
                className="post__image"
                width={100}
                height={100}
              />
            </div>
          )}
          <div className="post-form__hashtags-outputs">
            {post?.hashTags?.map((tag, index) => (
              <span className="post-form__hashtags-tag" key={index}>
                #{tag}
              </span>
            ))}
          </div>
        </Link>
      </div>
      <div className="post__box-footer">
        {/* user.uid 가 post.uid가 같은 경우 = 즉 로그인한 사용자의 포스트일 경우 */}
        {user?.uid === post?.uid && (
          <>
            <button
              type="button"
              className="post__delete"
              onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="post__edit">
              <Link to={`posts/edit/${post?.id}`}>Edit</Link>
            </button>
          </>
        )}
        <button type="button" className="post__likes" onClick={toggleLike}>
          {user && post?.likes?.includes(user.uid) ? (
            <AiFillHeart />
          ) : (
            <AiOutlineHeart />
          )}
          {post?.likeCount || 0}
        </button>
        <button type="button" className="post__comments">
          <FaRegComment />
          {post?.comments?.length || 0}
        </button>
      </div>
    </div>
  );
}
