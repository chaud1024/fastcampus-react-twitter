import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import React, { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PostForm() {
  const [content, setContent] = useState<string>("");
  const [hashTag, setHashTag] = useState<string>("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
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
      // console.log(e);
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };
  console.log(imageFile);

  const handleSubmit = async (e: any) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    e.preventDefault();

    try {
      // 이미지 업로드
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }

      // 업로드된 이미지의 download url 업데이트
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imageUrl: imageUrl,
      });
      setTags([]);
      setHashTag("");
      setContent("");
      setImageFile(null);
      toast.success("게시글을 생성했습니다.");
      setIsSubmitting(false);
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
    // onClick={removeTag(tag)} 태그를 클릭했을 때 해당 태그 삭제하기
    // tags배열을 set해준다
    // 어떻게? 태그 배열들을 필터할건데,
    // 태그 배열들의 value(val)가 내가 클릭한 그 tag와 같지 않은 것들만 모아서
    // 새로운 태그 배열로 set해준다(= 즉 내가 클릭한 것은 제외(삭제)하고 태그 배열을 set해준다)
    setTags(tags?.filter((val) => val !== tag));
  };

  const handleHashtag = (e: any) => {
    // hastag를 set해준다
    // 어떻게? 태그 작성하는 input(e.target)의 value를 공백으로 trim한 것이 hashtag
    setHashTag(e?.target?.value?.trim());
  };

  const handleKeyUp = (e: any) => {
    // 태그를 작성하고 스페이스바(키코드 32)를 눌렀을 때
    // 그리고 태그 내용이 공백이 아닐 때(스페이스바 여러번 누른 경우) 태그 생성
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      // 만약 동일한 태그가 있다면 에러를 띄운다
      // 그렇지 않다면 태그 생성 => 그리고나서 태그 작성하는 input 공백화
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
          value="Tweet"
          className="post-form__submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
