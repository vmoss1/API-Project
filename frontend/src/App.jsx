import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import SignupFormPage from "./components/SignupFormModal/SignupFormModal";
import Navigation from "./components/Navigation/Navigation";
import ReadGroups from "./components/Groups/ReadGroups/ReadGroups";
import { Modal } from "./context/Modal";
import { LandingPage } from "./components/LandingPage/LandingPage";
import * as sessionActions from "./store/session";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Modal />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      // {
      //   path: "signup",
      //   element: <SignupFormPage />,
      // },
      {
        path: "/groups",
        element: <ReadGroups />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
