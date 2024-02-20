import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import CreateGroup from "./components/Groups/CreateGroup/CreateGroup";
import ReadGroups from "./components/Groups/ReadGroups/ReadGroups";
import { Modal } from "./context/Modal";
import UpdateGroup from "./components/Groups/UpdateGroup/UpdateGroup";
import { LandingPage } from "./components/LandingPage/LandingPage";
import ReadGroupDetails from "./components/Groups/ReadGroupDetails/ReadGroupDetails";
import ReadEvents from "./components/Events/ReadEvents/ReadEvents";
import ManageEvents from "./components/Events/ManageEvents/ManageEvents";
import CreateEvent from "./components/Events/CreateEvent/CreateEvent";
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
      {
        path: "/groups",
        element: <ReadGroups />,
      },
      {
        path: "/groups/:id",
        element: <ReadGroupDetails />,
      },
      {
        path: "/groups/new",
        element: <CreateGroup />,
      },
      {
        path: "/edit-group",
        element: <UpdateGroup />,
      },
      {
        path: "/events",
        element: <ReadEvents />,
      },
      {
        path: "/events/:id",
        element: <ManageEvents />,
      },
      {
        path: "/create-event",
        element: <CreateEvent />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
