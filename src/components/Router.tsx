import Homepage from "pages/home";
import NotificationPage from "pages/notification";
import PostListPage from "pages/post";
import PostDetail from "pages/post/detail";
import PostEdit from "pages/post/edit";
import PostNew from "pages/post/new";
import ProfilePage from "pages/profile";
import ProfileEdit from "pages/profile/edit";
import SearchPage from "pages/search";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";
import { Navigate, Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/posts" element={<PostListPage />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/new" element={<PostNew />} />
      <Route path="/posts/edit/:id" element={<PostEdit />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />
      <Route path="/notification" element={<NotificationPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/users/login" element={<LoginPage />} />
      <Route path="/users/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
