import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBellSlash, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import StorageUtils from "../utils/StorageUtils";

function Header({ toggleSidebar, title, isAuthenticated, toogleSideBarIcon }) {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notification, setNotification] = useState([]);
  const [notifCount, setNotifCount] = useState(null);
  const [noNotification, setNoNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNotificationId, setLoadingNotificationId] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const { logout, user } = useAuth();

  const openProfileMenu = Boolean(profileAnchorEl);
  const openNotificationMenu = Boolean(notificationAnchorEl);

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          return;
        }

        const response = await api.get("/unread-notifications");

        if (response.data.status) {
          setNotification(response.data.unread);
          setNotifCount(response.data.notificationCount);
          setNoNotification(response.data.empty);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchNotifications();
  }, [logout, loading]);

  useEffect(() => {
    if (notifCount > 0) {
      document.title = `(${notifCount}) Computer Monitoring - ${title}`;
    } else {
      document.title = `Computer Monitoring - ${title}`;
    }
  }, [notifCount, title]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Logout",
    });

    if (result.isConfirmed) {
      try {
        const token = Cookies.get("token");
        if (!token) {
          return;
        }

        await api.get("/logout");

        logout();
      } catch (error) {
        console.error("Error logging out:", error);
        Swal.fire("Error!", "Failed to log out. Please try again.", "error");
      }
    }
  };

  const handleMarkAsRead = async (event, notifId) => {
    event.preventDefault();
    setLoading(true);
    setLoadingNotificationId(notifId);
    try {
      const response = await api.post(`/marked-as-read/${notifId}`);
      if (response.data.status === true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
            container: "swalContainer",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "success",
            title: response.data.message,
          });
        })();
      }
    } catch (error) {
      console.error("Error in marking as read:", error);
      if (error.response && error.response.data) {
        console.error("Backend error response:", error.response.data);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "error",
            title: error.response.data.message,
          });
        })();
      } else {
        console.error("ERROR!");
      }
    } finally {
      setLoading(false);
      setLoadingNotificationId(false);
    }
  };

  const handleMarkAllAsRead = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoadingAll(true);
    try {
      const response = await api.post("/marked-all-as-read");
      if (response.data.status === true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
          customClass: {
            popup: "colored-toast",
            container: "swalContainer",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "success",
            title: response.data.message,
          });
        })();
      }
    } catch (error) {
      console.error("Error in marking as read:", error);
      if (error.response && error.response.data) {
        console.error("Backend error response:", error.response.data);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "red",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          showCloseButton: true,
          timer: 2500,
          timerProgressBar: true,
        });
        (async () => {
          await Toast.fire({
            icon: "error",
            title: error.response.data.message,
          });
        })();
      } else {
        console.error("ERROR!");
      }
    } finally {
      setLoading(false);
      setLoadingAll(false);
    }
  };

  function timeAgo(date) {
    return formatDistanceToNowStrict(parseISO(date), { addSuffix: true });
  }
  const handleMenuItemClick = () => {
    handleLogout();
    handleProfileClose();
  };

  return (
    <div className={isAuthenticated ? "sticky top-0 z-50 w-full" : "hidden"}>
      <div className="flex items-center justify-between w-full h-20 pr-10 bg-blue-800">
        <button
          type="button"
          onClick={toggleSidebar}
          className="ml-4 text-white cursor-pointer md:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <button
          type="button"
          onClick={toogleSideBarIcon}
          className="hidden md:block ml-4 text-white cursor-pointer"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="flex-grow text-center">
          <p className="text-sm font-bold text-white md:text-4xl">
            COMPUTER MONITORING SYSTEM
          </p>
        </div>
        <div>
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationClick}
              size="small"
              sx={{ color: "white", position: "relative" }}
              aria-controls={
                openNotificationMenu ? "notification-menu" : undefined
              }
              aria-haspopup="true"
              aria-expanded={openNotificationMenu ? "true" : undefined}
            >
              <NotificationsIcon
                sx={{
                  color: "white",
                  ...(notification?.length > 0
                    ? {
                        animation: "wiggle 1s infinite",
                        "@keyframes wiggle": {
                          "0%": { transform: "rotate(0deg)" },
                          "10%": { transform: "rotate(-15deg)" },
                          "20%": { transform: "rotate(15deg)" },
                          "30%": { transform: "rotate(-15deg)" },
                          "40%": { transform: "rotate(15deg)" },
                          "50%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(0deg)" },
                        },
                      }
                    : {}),
                }}
              />
              {notification?.length > 0 ? (
                <span className="absolute top-0 right-0 flex w-4 h-4">
                  <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex items-center text-[10px] justify-center w-4 h-4 font-bold text-white bg-red-500 rounded-full">
                    {notifCount}
                  </span>
                </span>
              ) : (
                ""
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Account Settings">
            <IconButton
              onClick={handleProfileClick}
              size="small"
              sx={{ ml: 1 }}
              aria-controls={openProfileMenu ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openProfileMenu ? "true" : undefined}
            >
              <Avatar
                alt={user.firstName}
                src={StorageUtils(user?.profile_picture)}
              />
            </IconButton>
          </Tooltip>
        </div>

        <Menu
          anchorEl={profileAnchorEl}
          id="profile-menu"
          open={openProfileMenu}
          onClose={handleProfileClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {user && (
            <Link to="/profile">
              <MenuItem>
                <Avatar src={StorageUtils(user?.profile_picture)} />{" "}
                <b>
                  {user.firstName} {user.lastName}
                </b>
              </MenuItem>
            </Link>
          )}
          <Divider
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "12px" }}
          >
            Other Links
          </Divider>
          <Link
            to="http://136.239.196.178:4000/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <ConfirmationNumberIcon fontSize="small" />
              </ListItemIcon>
              Ticketing System
            </MenuItem>
          </Link>
          <MenuItem onClick={handleProfileClose}>
            <ListItemIcon>
              <InsertDriveFileIcon fontSize="small" />
            </ListItemIcon>
            Request Form
          </MenuItem>
          <Link
            to="http://136.239.196.178:3000/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MenuItem>
              <ListItemIcon>
                <ChatIcon fontSize="small" />
              </ListItemIcon>
              SMCT Chat
            </MenuItem>
          </Link>
          <Divider />
          <MenuItem onClick={handleMenuItemClick}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchorEl}
          id="notification-menu"
          open={openNotificationMenu}
          onClose={handleNotificationClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: "350px",
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
            <Typography variant="h6">
              <span className="text-lg">
                <strong>Notifications</strong>
              </span>
            </Typography>
          </div>
          <div className="overflow-y-auto max-h-[400px]">
            {dataLoading ? (
              <div>
                <div class="shadow rounded-md p-4 w-full mx-auto">
                  <div class="animate-pulse flex space-x-4">
                    <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-2 bg-slate-700 rounded"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                          <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                        </div>
                        <div class="h-2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="shadow rounded-md p-4 w-full mx-auto">
                  <div class="animate-pulse flex space-x-4">
                    <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-2 bg-slate-700 rounded"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                          <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                        </div>
                        <div class="h-2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : noNotification ? (
              <Typography
                variant="body2"
                className="relative"
                sx={{
                  justifyContent: "center",
                  textAlign: "center",
                  paddingY: 7,
                }}
              >
                <p className="text-xl">
                  <FontAwesomeIcon className="text-[20px]" icon={faBellSlash} />
                </p>
                <p className="mt-3 text-xl">No notifications</p>
              </Typography>
            ) : (
              notification?.map((notif, index) => (
                <div
                  key={index}
                  className={
                    loadingAll
                      ? "bg-slate-300"
                      : loading && loadingNotificationId === notif.id
                      ? "bg-slate-300"
                      : ""
                  }
                >
                  <Tooltip
                    title={`${notif.user.firstName} ${notif.user.lastName} notification.`}
                  >
                    <MenuItem
                      disabled={
                        loading && loadingAll
                          ? loadingAll
                          : loadingNotificationId === notif.id
                      }
                      onClick={(event) => {
                        if (!loading || loadingNotificationId === notif.id) {
                          handleMarkAsRead(event, notif.id);
                        }
                      }}
                      className={
                        loadingAll
                          ? "relative animate-bounce"
                          : loading && loadingNotificationId === notif.id
                          ? "relative animate-bounce"
                          : "relative"
                      }
                    >
                      <div className="absolute top-0 right-0 w-2 h-2 mt-2 mr-3 bg-red-500 rounded-full"></div>
                      <Avatar
                        src={StorageUtils(notif.user.profile_picture)}
                        sx={{ mr: 2 }}
                      />
                      <div>
                        <Typography variant="body2">
                          {user.id === notif.user.id ? (
                            <strong>You</strong>
                          ) : (
                            <strong>
                              {notif.user.firstName} {notif.user.lastName}
                            </strong>
                          )}
                        </Typography>
                        <Typography variant="body2"> {notif.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {timeAgo(notif.created_at)}
                        </Typography>
                      </div>
                    </MenuItem>
                  </Tooltip>

                  <hr />
                </div>
              ))
            )}
          </div>
          {notification ? (
            <MenuItem
              onClick={notification ? handleMarkAllAsRead : undefined}
              sx={{ justifyContent: "center" }}
            >
              <Typography variant="body2" color="primary">
                Mark all as read
              </Typography>
            </MenuItem>
          ) : (
            ""
          )}
        </Menu>
      </div>
    </div>
  );
}

export default Header;
