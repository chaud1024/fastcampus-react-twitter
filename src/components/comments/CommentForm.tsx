import AuthContext from "context/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

interface CommentProps {
  post: PostProps | null;
}

export default function CommentForm({ post }: CommentProps) {
  const [comment, setComment] = useState<string>("");
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (post && user) {
      // 현재 포스트의 ref 가져오기(업데이트)
      const postRef = doc(db, "posts", post?.id);

      const commentObj = {
        comment: comment,
        uid: user?.uid,
        email: user?.email,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      await updateDoc(postRef, {
        comment: arrayUnion(commentObj),
      });

      toast.success("댓글을 생성했습니다.");
      setComment("");
      try {
      } catch (e: any) {
        console.log(e);
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "comment") {
      setComment(value);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        name="comment"
        id="comment"
        required
        placeholder="What is happening?"
        className="post-form__textarea"
        onChange={handleChange}
        value={comment}
      />
      <div className="post-form__submit-area">
        <div />
        <input
          type="submit"
          value="Comment"
          className="post-form__submit-btn"
          disabled={!comment}
        />
      </div>
    </form>
  );
}
