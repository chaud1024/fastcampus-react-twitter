import AuthContext from "context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { db, storage } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PostEditForm() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;
    // console.log(files);

    const file = files[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap?.id });
      setContent(docSnap?.data()?.content);
      // 태그 배열을 set : docSnap에서 data()로 가져온 데이터 내의 hashTags
      setTags(docSnap?.data()?.hashTags);
      // docSnap에서 data()로 가져온 데이터 내의 imageUrl
      setImageFile(docSnap?.data()?.imageUrl);
    }
  }, [params.id]);

  const handleSubmit = async (e: any) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();
    try {
      if (post) {
        // 기존에 있던 사진 삭제하기
        if (post?.imageUrl) {
          let imgRef = ref(storage, post?.imageUrl);
          await deleteObject(imgRef).catch((error) => {
            console.log(error);
          });
        }
        // 새로운 사진으로 교체한다면 그 새로운 사진을 업로드
        let imageUrl = "";
        if (imageFile) {
          const data = await uploadString(storageRef, imageFile, "data_url");
          imageUrl = await getDownloadURL(data?.ref);
        }

        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: content,
          // 업데이트해주는 hasTags은 추가되거나 삭제된 태그 배열(tags)
          hashTags: tags,
          // 업데이트 해주는 imgUrl는 그 이미지의 download url
          imageUrl: imageUrl,
        });
        navigate(`/posts/${post.id}`);
        toast.success("게시글을 수정했습니다.");
        setImageFile(null);
        setIsSubmitting(false);
      }
    } catch (e: any) {
      console.log(e);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
  };

  const handleHashtag = (e: any) => {
    setHashTag(e?.target?.value?.trim());
  };

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      if (tags?.includes(e.target.value.trim())) {
        toast.error("동일한 해쉬태그가 있습니다.");
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [getPost, params.id]);

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        className="post-form__textarea"
        name="content"
        id="content"
        required
        placeholder="What is happening?"
        onChange={handleChange}
        value={content}
      />
      <div className="post-form__hashtags">
        <span className="post-form__hashtags-outputs">
          {tags?.map((tag, index) => (
            <span
              className="post-form__hashtags-tag"
              key={index}
              onClick={() => removeTag(tag)}>
              #{tag}
            </span>
          ))}
        </span>
        <input
          className="post-form__input"
          type="text"
          name="hashtag"
          id="hashtag"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={handleHashtag}
          onKeyUp={handleKeyUp}
          value={hashTag}
        />
      </div>
      <div className="post-form__submit-area">
        <div className="post-form__image-area">
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className="post-form__file-icon" />
          </label>
          <input
            type="file"
            name="file-input"
            id="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {imageFile && (
            <div className="post-form__attachment">
              <img src={imageFile} alt="attachment" width={100} height={100} />
              <button
                className="post-form__clear-btn"
                type="button"
                onClick={handleDeleteImage}>
                Clear
              </button>
            </div>
          )}
        </div>
        <input
          type="submit"
          value="Edit"
          className="post-form__submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
