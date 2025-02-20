import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/loaders/Loading";
import SideBar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import { useRef, useState } from "react";
import ScrollTo from "../components/ScrollTo";

const ProtectedRoutes = ({
  isAuthenticated,
  isLoading,
  isRequiredChangePassword,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarIcon, setIsSidebarIcon] = useState(false);
  const [title, setTitle] = useState("");
  const divRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsSidebarIcon(false);
  };
  const toogleSideBarIcon = () => {
    setIsSidebarIcon(!isSidebarIcon);
    setIsSidebarOpen(false);
  }
  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && isRequiredChangePassword) {
    return <Navigate to="/change-new-password" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <ScrollTo divRef={divRef} />
      <div style={{ display: "flex", flex: 1 }}>
        <div>
          <SideBar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            setTitle={setTitle}
            isSidebarIcon={isSidebarIcon}
          />
        </div>
        <div
          ref={divRef}
          style={{ flex: 1, paddingBottom: "50px", overflowY: "auto" }}
          className="relative h-screen overflow-y-auto"
        >
          <Header
            toggleSidebar={toggleSidebar}
            isAuthenticated={isAuthenticated}
            title={title}
            toogleSideBarIcon={toogleSideBarIcon}
          />
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoutes;
