import AuthContext from "context/AuthContext";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { toast } from "react-toastify";

export interface CommentProps {
  comment: string;
  uid: string;
  email: string;
  createdAt: string;
}
interface CommentBoxProps {
  data: CommentProps;
  post: PostProps;
}
export default function CommentBox({ data, post }: CommentBoxProps) {
  const { user } = useContext(AuthContext);

  const handleDeleteComment = async () => {
    if (post) {
      try {
        // 댓글이 작성되어있는 post 의 ref 가져오기
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          comment: arrayRemove(data),
        });
        toast.success("댓글을 삭제했습니다.");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div key={data?.createdAt} className="comment">
      <div className="comment__border-box">
        <div className="comment__img-box">
          <div className="comment__flex-box">
            <img src={`/logo512.png`} alt="profile" />
            <div className="comment__email">{data?.email}</div>
            <div className="comment__createdAt">{data?.createdAt}</div>
          </div>
          <div className="comment__content">{data?.comment}</div>
        </div>
        <div className="comment__submit-div">
          {data?.uid === user?.uid && (
            <button
              type="button"
              className="comment__delete-btn"
              onClick={handleDeleteComment}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
