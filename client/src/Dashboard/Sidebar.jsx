import { useState, useEffect } from "react";
import smct from "../img/smct.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faDesktop,
  faQrcode,
  faWrench,
  faComputer,
  faX,
  faFile,
  faArrowsTurnToDots,
  faUsers,
  faAngleRight,
  faAngleDown,
  faCodeBranch,
  faChair,
  faBoxesPacking,
  faBuildingUser,
  faList,
  faUserMinus,
  faBuildingCircleArrowRight,
  faMugHot,
  faComputerMouse,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Tooltip } from "@mui/material";

function SideBar({ isSidebarOpen, toggleSidebar, setTitle, isSidebarIcon }) {
  const [activeItem, setActiveItem] = useState();
  const [setupOpen, setSetupOpen] = useState(false);
  const [transferedOpen, setTransferedOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case "/dashboard":
        setTitle("Dashboard");
        setActiveItem("dashboard");
        break;
      case "/computers":
        setTitle("Computers");
        setActiveItem("computers");
        break;
      case "/qr":
        setTitle("QR");
        setActiveItem("qr");
        break;
      case "/transfered-units":
        setTitle("Transfer Units");
        setActiveItem("transfered-units");
        break;
      case "/transfered-branch-units":
        setTitle("Transfered Branch Units");
        setActiveItem("transfered-branch-units");
        break;
      case "/all-units":
        setTitle("All Units");
        setActiveItem("all-units");
        break;
      case "/all-logs":
        setTitle("All Logs");
        setActiveItem("all-logs");
        break;
      case "/branches":
        setTitle("Branches");
        setActiveItem("branches");
        break;
      case "/positions":
        setTitle("Positions");
        setActiveItem("positions");
        break;
      case "/categories":
        setTitle("Categories");
        setActiveItem("categories");
        break;
      case "/suppliers":
        setTitle("Suppliers");
        setActiveItem("suppliers");
        break;
      case "/departments":
        setTitle("Departments");
        setActiveItem("departments");
        break;
      case "/unit":
        setTitle("Units");
        setActiveItem("unit");
        break;
      case "/set":
        setTitle("Computer Sets");
        setActiveItem("set");
        break;
      case "/user":
        setTitle("Setup Users");
        setActiveItem("user");
        break;
      case "/setup/branch-units":
        setTitle("Branch Units");
        setActiveItem("setup-branch-units");
        break;
      case "/admin/users-list":
        setTitle("Users Lists");
        setActiveItem("users-list");
        break;
      case "/profile":
        setTitle("Profile");
        break;
      default:
        setActiveItem("dashboard");
    }
  }, [pathname, setTitle]);

  const handleSetupOpen = () => {
    setSetupOpen((prev) => !prev);
  };
  const handleTransferedOpen = () => {
    setTransferedOpen((prev) => !prev);
  };

  return (
    <div
      className={`fixed h-screen md:static ${
        isSidebarOpen
          ? "left-0 w-80"
          : isSidebarIcon
          ? "left-0 w-24 hidden md:block"
          : "-left-full w-80"
      } top-0 h-full shadow-[4px_0_10px_rgba(0,0,0,0.25)] bg-white transition-all duration-300 z-[51]`}
    >
      <div className={isSidebarIcon ? "pr-5 w-[80px]" : "pr-5 w-72"}>
        <div>
          <button
            type="button"
            onClick={toggleSidebar}
            className="mt-4 text-black float-end md:hidden absolute top-0 right-5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
          <img
            src={smct}
            loading="lazy"
            alt="SMCT Logo"
            className={`transition-all duration-300 block ${
              isSidebarIcon ? "w-[58px] ml-3 pt-5" : "pt-5 ml-10 w-60 h-28"
            }`}
          />
        </div>
        <div
          className={
            isSidebarIcon
              ? "w-full ml-1 mt-6 overflow-y-auto max-h-[calc(100vh-62px)]"
              : "w-full mt-5 ml-10 overflow-y-auto max-h-[calc(100vh-100px)]"
          }
        >
          <Link to="/dashboard">
            <Tooltip placement="right" arrow title="Dashboard">
              <button
                type="button"
                className={`text-lg font-medium pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "dashboard"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faTachometerAlt} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  Dashboard
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/computers">
            <Tooltip placement="right" arrow title="Monitored Computers">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "computers"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faDesktop} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  Monitored Computers
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/qr">
            <Tooltip placement="right" arrow title="Scan QR Codes">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "qr" ? "bg-blue-500 text-white active" : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faQrcode} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  Scan QR Codes
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/all-units">
            <Tooltip placement="right" arrow title="All Units">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "all-units"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faComputer} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  All Units
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/all-logs">
            <Tooltip placement="right" arrow title="All Logs">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "all-logs"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faFile} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  All Logs
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/branches">
            <Tooltip placement="right" arrow title="Branches">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "branches"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faCodeBranch} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  Branches
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/categories">
            <Tooltip placement="right" arrow title="Categories">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "categories"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faList} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  Categories
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/positions">
            <Tooltip placement="right" arrow title="Positions">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "positions"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faChair} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  Positions
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/suppliers">
            <Tooltip placement="right" arrow title="Suppliers">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "suppliers"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faBoxesPacking} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  Suppliers
                </span>
              </button>
            </Tooltip>
          </Link>
          <Link to="/departments">
            <Tooltip placement="right" arrow title="Departments">
              <button
                type="button"
                className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                  isSidebarIcon ? "text-center" : "pl-5 text-justify"
                } hover:bg-blue-400 hover:text-white ${
                  activeItem === "departments"
                    ? "bg-blue-500 text-white active"
                    : ""
                } rounded-3xl h-10 cursor-pointer`}
              >
                <FontAwesomeIcon icon={faBuildingUser} />{" "}
                <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                  Departments
                </span>
              </button>
            </Tooltip>
          </Link>
          {isAdmin && (
            <Link to="/admin/users-list">
              <Tooltip placement="right" arrow title="Users List">
                <button
                  type="button"
                  className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                    isSidebarIcon ? "text-center" : "pl-5 text-justify"
                  } hover:bg-blue-400 hover:text-white ${
                    activeItem === "users-list"
                      ? "bg-blue-500 text-white active"
                      : ""
                  } rounded-3xl h-10 cursor-pointer`}
                >
                  <FontAwesomeIcon icon={faUsers} />{" "}
                  <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                    Users List
                  </span>
                </button>
              </Tooltip>
            </Link>
          )}
          {!isSidebarIcon ? (
            <>
              <Tooltip placement="right" arrow title="Transfered Units">
                <button
                  type="button"
                  onClick={handleTransferedOpen}
                  className={`cursor-pointer text-lg flex justify-between font-medium mt-5 pl-5 pt-0.5 rounded-3xl h-10`}
                >
                  <div>
                    <FontAwesomeIcon icon={faArrowsTurnToDots} /> Transfered
                    Units
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={transferedOpen ? faAngleDown : faAngleRight}
                    />
                  </div>
                </button>
              </Tooltip>

              {transferedOpen && (
                <div className="p-3 text-center bg-gray-200 rounded-lg">
                  <Link to="/transfered-units">
                    <Tooltip
                      placement="right"
                      arrow
                      title="User Unit Transfered"
                    >
                      <button
                        type="button"
                        className={`text-md font-medium mt-5 px-6 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                          activeItem === "transfered-units"
                            ? "bg-blue-500 text-white active"
                            : ""
                        } rounded  h-10 w-full cursor-pointer`}
                      >
                        User Unit Transfered
                      </button>
                    </Tooltip>
                  </Link>
                  <Link to="/transfered-branch-units">
                    <Tooltip
                      placement="right"
                      arrow
                      title="Branch Unit Transfered"
                    >
                      <button
                        type="button"
                        className={`text-sm font-medium mt-5 mb-6 px-6 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                          activeItem === "transfered-branch-units"
                            ? "bg-blue-500 text-white active"
                            : ""
                        } rounded h-10 w-full cursor-pointer`}
                      >
                        Branch Unit Transfered
                      </button>
                    </Tooltip>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/transfered-units">
                <Tooltip placement="right" arrow title="User Unit Transfered">
                  <button
                    type="button"
                    className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                      isSidebarIcon ? "text-center" : "pl-5 text-justify"
                    } hover:bg-blue-400 hover:text-white ${
                      activeItem === "transfered-units"
                        ? "bg-blue-500 text-white active"
                        : ""
                    } rounded-3xl h-10 cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faUserMinus} />{" "}
                    <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                      User Unit Transfered
                    </span>
                  </button>
                </Tooltip>
              </Link>
              <Link to="/transfered-branch-units">
                <Tooltip placement="right" arrow title="Branch Unit Transfered">
                  <button
                    type="button"
                    className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                      isSidebarIcon ? "text-center" : "pl-5 text-justify"
                    } hover:bg-blue-400 hover:text-white ${
                      activeItem === "transfered-branch-units"
                        ? "bg-blue-500 text-white active"
                        : ""
                    } rounded-3xl h-10 cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faBuildingCircleArrowRight} />{" "}
                    <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                      Branch Unit Transfered
                    </span>
                  </button>
                </Tooltip>
              </Link>
            </>
          )}
          {!isSidebarIcon ? (
            <>
              <Tooltip placement="right" arrow title="Setup">
                <button
                  type="button"
                  onClick={handleSetupOpen}
                  className={`cursor-pointer text-lg flex justify-between font-medium mt-5 pl-5 pt-0.5 rounded-3xl h-10`}
                >
                  <div>
                    <FontAwesomeIcon icon={faWrench} /> Setup
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={setupOpen ? faAngleDown : faAngleRight}
                    />
                  </div>
                </button>
              </Tooltip>
              {setupOpen && (
                <div className="p-3 text-center bg-gray-200 rounded-lg">
                  <Link to="/unit">
                    <Tooltip placement="right" arrow title="Unit">
                      <button
                        type="button"
                        className={`text-md font-medium mt-5 px-8 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                          activeItem === "unit"
                            ? "bg-blue-500 text-white active"
                            : ""
                        } rounded h-10 w-full cursor-pointer`}
                      >
                        Unit
                      </button>
                    </Tooltip>
                  </Link>
                  <Link to="/set">
                    <Tooltip
                      placement="right"
                      arrow
                      title="Assign Computer Set"
                    >
                      <button
                        type="button"
                        className={`text-sm font-medium mt-5 px-8 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                          activeItem === "set"
                            ? "bg-blue-500 text-white active"
                            : ""
                        } rounded h-10 w-full cursor-pointer`}
                      >
                        Assign Computer Set
                      </button>
                    </Tooltip>
                  </Link>
                  <Link to="/setup/branch-units">
                    <Tooltip placement="right" arrow title="Assign Branch Unit">
                      <button
                        type="button"
                        className={`text-sm font-medium mt-5 px-8 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                          activeItem === "setup-branch-units"
                            ? "bg-blue-500 text-white active"
                            : ""
                        } rounded h-10 w-full cursor-pointer`}
                      >
                        Assign Branch Unit
                      </button>
                    </Tooltip>
                  </Link>
                  <Link to="/user">
                    <Tooltip placement="right" arrow title="User">
                      <button
                        type="button"
                        className={`text-md font-medium mt-5 px-8 text-justify pt-0.5 hover:bg-blue-400 hover:text-white ${
                          activeItem === "user"
                            ? "bg-blue-500 text-white active"
                            : ""
                        } rounded h-10 w-full cursor-pointer`}
                      >
                        User
                      </button>
                    </Tooltip>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/unit">
                <Tooltip placement="right" arrow title="Unit">
                  <button
                    type="button"
                    className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                      isSidebarIcon ? "text-center" : "pl-5 text-justify"
                    } hover:bg-blue-400 hover:text-white ${
                      activeItem === "unit"
                        ? "bg-blue-500 text-white active"
                        : ""
                    } rounded-3xl h-10 cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faMugHot} />{" "}
                    <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                      Unit
                    </span>
                  </button>
                </Tooltip>
              </Link>
              <Link to="/set">
                <Tooltip placement="right" arrow title="Assign Computer Set">
                  <button
                    type="button"
                    className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                      isSidebarIcon ? "text-center" : "pl-5 text-justify"
                    } hover:bg-blue-400 hover:text-white ${
                      activeItem === "set"
                        ? "bg-blue-500 text-white active"
                        : ""
                    } rounded-3xl h-10 cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faComputerMouse} />{" "}
                    <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                      Assign Computer Set
                    </span>
                  </button>
                </Tooltip>
              </Link>
              <Link to="/setup/branch-units">
                <Tooltip placement="right" arrow title="Assign Branch Unit">
                  <button
                    type="button"
                    className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                      isSidebarIcon ? "text-center" : "pl-5 text-justify"
                    } hover:bg-blue-400 hover:text-white ${
                      activeItem === "setup-branch-units"
                        ? "bg-blue-500 text-white active"
                        : ""
                    } rounded-3xl h-10 cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faBuildingUser} />{" "}
                    <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                      Assign Branch Unit
                    </span>
                  </button>
                </Tooltip>
              </Link>
              <Link to="/user">
                <Tooltip placement="right" arrow title="User">
                  <button
                    type="button"
                    className={`text-lg font-medium mt-5 pt-0.5 w-full ${
                      isSidebarIcon ? "text-center" : "pl-5 text-justify"
                    } hover:bg-blue-400 hover:text-white ${
                      activeItem === "user"
                        ? "bg-blue-500 text-white active"
                        : ""
                    } rounded-3xl h-10 cursor-pointer`}
                  >
                    <FontAwesomeIcon icon={faUserPlus} />{" "}
                    <span className={`${isSidebarIcon ? "hidden" : ""}`}>
                      User
                    </span>
                  </button>
                </Tooltip>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
