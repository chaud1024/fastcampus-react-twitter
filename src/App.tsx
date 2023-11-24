import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Homepage</h1>} />
      <Route path="/posts" element={<h1>Post List page</h1>} />
      <Route path="/posts/:id" element={<h1>Post Detail page</h1>} />
      <Route path="/posts/new" element={<h1>Create Post page</h1>} />
      <Route path="/posts/edit/:id" element={<h1>Edit Post page</h1>} />
      <Route path="/profile" element={<h1>Profile page</h1>} />
      <Route path="/profile/edit" element={<h1>Profile Edit page</h1>} />
      <Route path="/notification" element={<h1>Notification page</h1>} />
      <Route path="/search" element={<h1>Search page</h1>} />
      <Route path="/users/login" element={<h1>Login page</h1>} />
      <Route path="/users/signup" element={<h1>SignUp page</h1>} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
