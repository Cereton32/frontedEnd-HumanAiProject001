import React from "react";
import PhoneAuth from "./component/screens/PhoneAuth";
import HomeScreen from "./component/screens/HomeScreen"
import BoardDetail from "./component/screens/BoardDetail";
import { useAuth } from "./auth/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { BoardProvider } from "./board/BoardProvider";

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <BoardProvider>
        <Routes>
          <Route path="/" element={user ? <HomeScreen /> : <PhoneAuth />} />
          <Route path="/auth" element={<PhoneAuth></PhoneAuth>}></Route>
          <Route path="/home" element={<HomeScreen></HomeScreen>} />
          <Route path="/board/:boardId" element={<BoardDetail />} />
        </Routes>
      </BoardProvider>
    </Router>
  );
}