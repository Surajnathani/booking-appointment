import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import SinglePageAppointment from "./pages/singlePageAppointment/SinglePageAppointment";
import { useFetchUserProfileQuery } from "./redux/api/userApi";
import { userExists, userNotExist } from "./redux/reducers/userReducer";
import { useFetchProUserProfileQuery } from "./redux/api/proUserApi";
import Loader from "./components/loader/Loader";

const Home = lazy(() => import("./pages/home/Home"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Registration = lazy(() => import("./pages/registration/Registration"));
const Login = lazy(() => import("./pages/login/Login"));
const Appointment = lazy(() => import("./pages/appointment/Appointment"));
const OwnerRegistration = lazy(() =>
  import("./pages/ownerRegistration/OwnerRegistration")
);
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const DashboardAppointments = lazy(() =>
  import("./pages/dashboard/DashboardAppointments")
);
const DashboardReviews = lazy(() =>
  import("./pages/dashboard/DashboardReviews")
);
const DashboardProfile = lazy(() =>
  import("./pages/dashboard/DashboardProfile")
);
const DashboardCalender = lazy(() =>
  import("./pages/dashboard/DashboardCalender")
);
const DashboardSetting = lazy(() =>
  import("./pages/dashboard/DashboardSetting")
);
const DashboardStaff = lazy(() => import("./pages/dashboard/DashboardStaff"));

const NotFound = lazy(() => import("./pages/notFound/NotFound"));

const App = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.userReducer);

  const { data: userData, error: userError } = useFetchUserProfileQuery(
    undefined,
    {
      skip: !!user,
    }
  );

  const { data: proUserData, error: proUserError } =
    useFetchProUserProfileQuery(undefined, {
      skip: !!user,
    });

  useEffect(() => {
    if (userData) {
      dispatch(userExists(userData.user));
    } else if (proUserData) {
      dispatch(userExists(proUserData.user));
    } else if (userError || proUserError) {
      dispatch(userNotExist());
    }
  }, [userData, proUserData, userError, proUserError, dispatch]);

  return isLoading ? (
    <Loader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <main className="main">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/profile"
              element={
                <ProtectRoute user={user}>
                  <Profile />
                </ProtectRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <ProtectRoute user={user} redirect="/signin">
                  <Appointment />
                </ProtectRoute>
              }
            />
            <Route
              path="/appointment/:userId"
              element={
                <ProtectRoute user={user} redirect="/signin">
                  <SinglePageAppointment />
                </ProtectRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Registration />
                </ProtectRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />
            <Route
              path="/joinus"
              element={
                <ProtectRoute user={!user} redirect="/dashboard/home">
                  <OwnerRegistration />
                </ProtectRoute>
              }
            />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/home" element={<Dashboard />} />
              <Route
                path="/dashboard/Appointments"
                element={<DashboardAppointments />}
              />
              <Route path="/dashboard/Reviews" element={<DashboardReviews />} />
              <Route path="/dashboard/Staff" element={<DashboardStaff />} />
              <Route path="/dashboard/Profile" element={<DashboardProfile />} />
              <Route
                path="/dashboard/calender"
                element={<DashboardCalender />}
              />
              <Route path="/dashboard/setting" element={<DashboardSetting />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </main>
      </Suspense>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "custom-toast",
        }}
      />
    </BrowserRouter>
  );
};

export default App;
