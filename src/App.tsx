import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import PrivateRoute from './routes/PrivateRoute';
import AdminRouteGuard from './routes/AdminRouteGuard';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import PlaceCreatePage from './pages/PlaceCreatePage';
import PlaceEditPage from './pages/PlaceEditPage';
import PlaceDetail from './pages/PlaceDetail';
import Places from './pages/Places';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/:placeId" element={<PlaceDetail />} />

        {/* 로그인 필요 라우트 */}
        <Route element={<PrivateRoute />}>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/register" element={<PlaceCreatePage />} />
          <Route path="/places/:placeId/edit" element={<PlaceEditPage />} />
        </Route>

        {/* 관리자 전용 라우트 */}
        <Route element={<AdminRouteGuard />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/places" replace />} />
      </Routes>
      <BottomNavigation />
    </BrowserRouter>
  );
}

export default App;
