import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
  post: PostProps;
}

interface UserProps {
  id: string;
}
export default function FollowingBox({ post }: FollowingProps) {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<any>([]);

  const handleFollow = async (e: any) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        // 로그인한 사용자 기준으로 '팔로잉' 컬렉션 생성 or 업데이트(setDoc)
        const followingRef = doc(db, "following", user?.uid);
        // 로그인한 사용자 기준(user.uid) followingRef 생성
        await setDoc(
          followingRef,
          {
            users: arrayUnion({ id: post?.uid }),
            // 누구를 팔로잉하는가? 포스트 작성한 사용자(post.uid)
          },
          { merge: true },
        );
        // 팔로우 당하는 사용자 기준으로 '팔로우' 컬렉션 생성 or 업데이트
        const followerRef = doc(db, "followers", post?.uid);
        // 게시글을 작성한 팔로우 당하는 사용자 기준(post.uid) followerRef 생성
        await setDoc(
          followerRef,
          {
            users: arrayUnion({ id: user?.uid }),
            // 누가 팔로우하는가? 팔로우 버튼을 클릭했던 로그인한 사용자(user.uid)
          },
          {
            merge: true,
          },
        );

        // 팔로잉 알림 만들기
        await addDoc(collection(db, "notifications"), {
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          uid: post?.uid, // 내가 팔로우를 누른 사람(포스트 작성자)의 uid
          isRead: false,
          url: `#`,
          content: `${user?.email || user?.displayName}가 팔로우를 했습니다.`,
          // 게시글을 쓴 사용자에게 내가 팔로우를 눌렀다는 내용의 알림이 간다
        });

        toast.success(`${post.email}님을 팔로우 합니다.`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post?.uid }),
        });
        const followerRef = doc(db, "followers", post?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user?.uid }),
        });
      }
      toast.success(`팔로우를 취소했습니다.`);
    } catch (e: any) {
      console.log(e);
    }
  };

  const getFollowers = useCallback(async () => {
    // post 작성자의 팔로워를 가져오기때문에 기준은 포스트 작성자(post.uid)
    if (post.uid) {
      // 실시간 팔로워 변동사항 가져오기 : onSnapshot
      const ref = doc(db, "followers", post.uid);

      onSnapshot(ref, (doc) => {
        setPostFollowers([]); // 일단 팔로워들 초기화

        // follwers doc의 데이터에 id와 uid string이 있는 users 배열
        doc?.data()?.users?.map((user: UserProps) => {
          setPostFollowers(
            // 팔로워들을 users배열에 하나씩 쌓도록
            (prev: UserProps[]) => (prev ? [...prev, user?.id] : []),
          );
        });
      });
    }
  }, [post.uid]);

  useEffect(() => {
    if (post.uid) {
      getFollowers();
    }
    getFollowers();
  }, [getFollowers]);

  return (
    <>
      {user?.uid !== post.uid &&
        (postFollowers?.includes(user?.uid) ? (
          <button
            type="button"
            className="post__following-btn"
            onClick={handleDeleteFollow}>
            Following
          </button>
        ) : (
          <button className="post__follow-btn" onClick={handleFollow}>
            Follow
          </button>
        ))}
    </>
  );
}
