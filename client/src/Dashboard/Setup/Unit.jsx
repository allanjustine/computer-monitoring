import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faTrash,
  faArrowUp,
  faArrowDown,
  faPen,
  faSort,
  faX,
  faFloppyDisk,
  faSpinner,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Typography,
  Breadcrumbs,
  Tooltip,
  TextField,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { TableContainer } from "@mui/material";
import Select from "react-select";
import HomeIcon from "@mui/icons-material/Home";
import PhonelinkSetupIcon from "@mui/icons-material/PhonelinkSetup";
import SettingsIcon from "@mui/icons-material/Settings";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "visible",
    marginTop: theme.spacing(3),
  },
  //table: {
  //minWidth: 650,
  //},
  container: {
    overflowX: "visible",
  },
  table: {
    borderRadius: 10,
  },
}));

const CustomTableB = ({ refresh, searchTermData }) => {
  const classes = useStyles();
  const [unit, setUnit] = useState({ vacantDefective: [] });
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [validationErrors, setValidationErrors] = useState({});
  const [refreshed, setRefreshed] = useState(false);
  const [editUnitId, setEditUnitId] = useState(null);
  const [category, setCategory] = useState({ data: [] });
  const [supplier, setSupplier] = useState({ data: [] });
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const options = [
    { value: "Vacant", label: "Vacant" },
    { value: "Defective", label: "Defective" },
  ];
  const [editValues, setEditValues] = useState({
    date_of_purchase: "",
    category: "",
    description: "",
    supplier: "",
    serial_number: "",
    status: "",
  });

  const handleSort = (column) => {
    const newOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await api.get(
          `units?sort_column=${sortColumn}&sort_order=${sortOrder}`
        );
        if (response.data.vacantDefective.length === 0) {
          setUnit([]);
        } else {
          setUnit(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setUnit([]);
        } else {
          console.error("Error fetching units data:", error);
          setUnit([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [refresh, refreshed, sortColumn, sortOrder]);

  const getSortIcon = (column) => {
    if (sortColumn !== column) return faSort;
    return sortOrder === "asc" ? faArrowUp : faArrowDown;
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteUnit = async (dataId) => {
    setRefreshed(true);
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await api.delete(`unit-delete/${dataId}`);

        if (response.data.status === true) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-right",
            iconColor: "green",
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
              icon: "success",
              title: response.data.message,
            });
          })();
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Backend error response:", error.response.data);
        setValidationErrors(error.response.data.errors || {});
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
      }
    } finally {
      setRefreshed(false);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get("/categories");
        setCategory(response?.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await api.get("/suppliers");
        setSupplier(response?.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchSupplier();
  }, []);

  const Category = category.data?.map((cat) => ({
    label: cat.category_name,
    value: cat.id,
  }));

  const Supplier = supplier.data?.map((sup) => ({
    label: sup.supplier_name,
    value: sup.id,
  }));

  const handleUpdateUnit = (id, data) => {
    setEditUnitId(id);
    setEditValues({
      ...editValues,
      date_of_purchase: data.date_of_purchase,
      category: {
        label: data.category.category_name,
        value: data.category.id,
      },
      description: data.description,
      supplier: {
        label: data.supplier.supplier_name,
        value: data.supplier.id,
      },
      serial_number: data.serial_number,
      status: { label: data.status, value: data.status },
    });
    setValidationErrors({});
  };

  const formatEditValues = (values) => ({
    date_of_purchase: values.date_of_purchase,
    category: values.category.value,
    description: values.description,
    supplier: values.supplier.value,
    serial_number: values.serial_number,
    status: values.status.value,
  });

  const handleDateChange = (date) => {
    setEditValues({
      ...editValues,
      date_of_purchase: date,
    });
  };

  const handleSelectChange = (selectedOption, field) => {
    setEditValues({
      ...editValues,
      [field]: selectedOption,
    });
  };
  const handleSaveUnit = async (id) => {
    setRefreshed(true);
    setLoadingUpdate(true);
    try {
      const formattedValues = formatEditValues(editValues);

      const response = await api.post(`update-unit/${id}`, formattedValues);

      if (response.data.status === true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
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
            icon: "success",
            title: response.data.message,
          });
        })();

        handleCancelEdit();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Backend error response:", error.response.data);
        setValidationErrors(error.response.data.errors || {});
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
      }
    } finally {
      setRefreshed(false);
      setLoadingUpdate(false);
    }
  };

  const handleCancelEdit = () => {
    setEditUnitId(null);
  };

  const filteredData = unit?.vacantDefective
    ? unit?.vacantDefective.filter(
        (unit) =>
          unit?.unit_code
            ?.toLowerCase()
            .includes(searchTermData.toLowerCase()) ||
          unit?.date_of_purchase
            ?.toLowerCase()
            .includes(searchTermData.toLowerCase()) ||
          unit?.category.category_name
            ?.toLowerCase()
            .includes(searchTermData.toLowerCase()) ||
          unit?.description
            ?.toLowerCase()
            .includes(searchTermData.toLowerCase()) ||
          unit?.supplier?.supplier_name
            ?.toLowerCase()
            .includes(searchTermData.toLowerCase()) ||
          unit?.serial_number
            ?.toLowerCase()
            .includes(searchTermData.toLowerCase()) ||
          unit?.status?.toLowerCase().includes(searchTermData.toLowerCase())
      )
    : [];

  return (
    <div
      className={`${classes.root} border border-transparent rounded-xl shadow-lg max-h-max w-full mt-3`}
    >
      <TableContainer className={classes.container}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className="bg-blue-400">
              <TableCell
                align="center"
                className="cursor-pointer rounded-tl-xl"
                onClick={() => handleSort("unit_code")}
              >
                <p className="font-semibold text-white mt-1.5">
                  UNIT CODE{" "}
                  {sortColumn === "unit_code" && (
                    <FontAwesomeIcon icon={getSortIcon("unit_code")} />
                  )}
                </p>
              </TableCell>
              <TableCell
                className="cursor-pointer"
                align="center"
                onClick={() => handleSort("date_of_purchase")}
              >
                <p className="font-semibold text-white mt-1.5">
                  DATE OF PURCHASE{" "}
                  {sortColumn === "date_of_purchase" && (
                    <FontAwesomeIcon icon={getSortIcon("date_of_purchase")} />
                  )}
                </p>
              </TableCell>
              <TableCell
                className="cursor-pointer"
                align="center"
                onClick={() => handleSort("category_name")}
              >
                <p className="font-semibold text-white mt-1.5">
                  CATEGORY{" "}
                  {sortColumn === "category_name" && (
                    <FontAwesomeIcon icon={getSortIcon("category_name")} />
                  )}
                </p>
              </TableCell>
              <TableCell
                className="cursor-pointer"
                align="center"
                onClick={() => handleSort("description")}
              >
                <p className="font-semibold text-white mt-1.5">
                  DESCRIPTION{" "}
                  {sortColumn === "description" && (
                    <FontAwesomeIcon icon={getSortIcon("description")} />
                  )}
                </p>
              </TableCell>
              <TableCell
                className="cursor-pointer"
                align="center"
                onClick={() => handleSort("supplier_name")}
              >
                <p className="font-semibold text-white mt-1.5">
                  SUPPLIER{" "}
                  {sortColumn === "supplier_name" && (
                    <FontAwesomeIcon icon={getSortIcon("supplier_name")} />
                  )}
                </p>
              </TableCell>
              <TableCell
                className="cursor-pointer"
                align="center"
                onClick={() => handleSort("serial_number")}
              >
                <p className="font-semibold text-white mt-1.5">
                  SERIAL NO.{" "}
                  {sortColumn === "serial_number" && (
                    <FontAwesomeIcon icon={getSortIcon("serial_number")} />
                  )}
                </p>
              </TableCell>
              <TableCell className="cursor-pointer" align="center">
                <p
                  className="font-semibold text-white mt-1.5"
                  onClick={() => handleSort("status")}
                >
                  STATUS{" "}
                  {sortColumn === "status" && (
                    <FontAwesomeIcon icon={getSortIcon("status")} />
                  )}
                </p>
              </TableCell>
              <TableCell align="center" className="rounded-tr-xl">
                <p className="font-semibold text-white mt-1.5">ACTION</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full p-4 rounded">
                      <div className="flex space-x-4 animate-pulse">
                        <div className="flex-1 py-1 space-y-6">
                          <div className="h-10 bg-gray-200 rounded shadow"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ) : filteredData && filteredData.length > 0 ? (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data, index) => (
                  <TableRow key={data.id}>
                    <TableCell align="center">{data.unit_code}</TableCell>
                    <TableCell align="center">
                      {editUnitId === data.id ? (
                        <DatePicker
                          selected={editValues?.date_of_purchase}
                          onChange={handleDateChange}
                          placeholderText=""
                          dateFormat={"yyyy-MM-dd"}
                          className={
                            editUnitId === data.id &&
                            validationErrors["date_of_purchase"]
                              ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                              : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                          }
                        />
                      ) : (
                        format(new Date(data.date_of_purchase), "MMMM dd, yyyy")
                      )}
                      <span className="text-sm text-center">
                        {editUnitId === data.id &&
                          validationErrors["date_of_purchase"] && (
                            <div className="text-sm text-center text-red-500">
                              {validationErrors["date_of_purchase"].map(
                                (error, errorIndex) => (
                                  <span key={errorIndex}>{error}</span>
                                )
                              )}
                            </div>
                          )}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {editUnitId === data.id ? (
                        <Select
                          options={Category}
                          value={editValues?.category}
                          onChange={(e) => handleSelectChange(e, "category")}
                          placeholder={
                            editValues?.category ? "" : "Select Category"
                          }
                          className={
                            editUnitId === data.id &&
                            validationErrors["category"]
                              ? "border border-red-500"
                              : "border border-transparent"
                          }
                        />
                      ) : data.category ? (
                        data.category.category_name
                      ) : (
                        "N/A"
                      )}
                      <span className="text-sm text-center">
                        {editUnitId === data.id &&
                          validationErrors["category"] && (
                            <div className="text-sm text-center text-red-500">
                              {validationErrors["category"].map(
                                (error, errorIndex) => (
                                  <span key={errorIndex}>{error}</span>
                                )
                              )}
                            </div>
                          )}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {editUnitId === data.id ? (
                        <textarea
                          rows={3}
                          type="text"
                          value={editValues?.description || ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              description: e.target.value,
                            })
                          }
                          className={
                            editUnitId === data.id &&
                            validationErrors["description"]
                              ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 pl-2"
                              : "bg-gray-200 border border-transparent rounded-xl w-4/4 pl-2"
                          }
                        />
                      ) : (
                        data?.description
                          .split("\n")
                          .map((line, lineIndex) => (
                            <div key={lineIndex}>{line}</div>
                          ))
                      )}
                      <span className="text-sm text-center">
                        {editUnitId === data.id &&
                          validationErrors["description"] && (
                            <div className="text-sm text-center text-red-500">
                              {validationErrors["description"].map(
                                (error, errorIndex) => (
                                  <span key={errorIndex}>{error}</span>
                                )
                              )}
                            </div>
                          )}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {editUnitId === data.id ? (
                        <Select
                          options={Supplier}
                          value={editValues?.supplier}
                          onChange={(e) => handleSelectChange(e, "supplier")}
                          placeholder={
                            editValues?.supplier ? "" : "Select Supplier"
                          }
                          className={
                            editUnitId === data.id &&
                            validationErrors["supplier"]
                              ? "border border-red-500"
                              : "border border-transparent"
                          }
                        />
                      ) : data.supplier ? (
                        data.supplier.supplier_name
                      ) : (
                        "N/A"
                      )}
                      <span className="text-sm text-center">
                        {editUnitId === data.id &&
                          validationErrors["supplier"] && (
                            <div className="text-sm text-center text-red-500">
                              {validationErrors["supplier"].map(
                                (error, errorIndex) => (
                                  <span key={errorIndex}>{error}</span>
                                )
                              )}
                            </div>
                          )}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {editUnitId === data.id ? (
                        <input
                          type="text"
                          value={editValues?.serial_number || null}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              serial_number: e.target.value,
                            })
                          }
                          placeholder=""
                          className={
                            editUnitId === data.id &&
                            validationErrors["serial_number"]
                              ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                              : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                          }
                        />
                      ) : (
                        data.serial_number
                      )}
                      <span className="text-sm text-center">
                        {editUnitId === data.id &&
                          validationErrors["serial_number"] && (
                            <div className="text-sm text-center text-red-500">
                              {validationErrors["serial_number"].map(
                                (error, errorIndex) => (
                                  <span key={errorIndex}>{error}</span>
                                )
                              )}
                            </div>
                          )}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {editUnitId === data.id ? (
                        <Select
                          options={options}
                          value={editValues?.status || null}
                          onChange={(e) => handleSelectChange(e, "status")}
                          placeholder={
                            editValues?.status ? "" : "Select status"
                          }
                          className={
                            editUnitId === data.id && validationErrors["status"]
                              ? "border border-red-500"
                              : "border border-transparent"
                          }
                        />
                      ) : (
                        data.status
                      )}
                      <span className="text-sm text-center">
                        {editUnitId === data.id &&
                          validationErrors["status"] && (
                            <div className="text-sm text-center text-red-500">
                              {validationErrors["status"].map(
                                (error, errorIndex) => (
                                  <span key={errorIndex}>{error}</span>
                                )
                              )}
                            </div>
                          )}
                      </span>
                    </TableCell>

                    {/* CENTER THE ICONS */}
                    <TableCell style={{ textAlign: "center" }}>
                      {editUnitId === data.id ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Tooltip title="Save" arrow placement="top">
                            <button
                              className="hover:scale-125"
                              type="button"
                              onClick={() => handleSaveUnit(data.id)}
                              style={{
                                padding: "0.5rem 1rem",
                                fontWeight: "600",
                                color: "white",
                                background:
                                  "linear-gradient(to right, #48C774, #1E90FF)",
                                borderRadius: "0.375rem",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition:
                                  "background-color 0.3s ease, transform 0.3s ease",
                                outline: "none",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(to right, #36D759, #1C86EE)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(to right, #48C774, #1E90FF)")
                              }
                            >
                              {loadingUpdate ? (
                                <FontAwesomeIcon
                                  className="animate-spin"
                                  icon={faSpinner}
                                />
                              ) : (
                                <FontAwesomeIcon icon={faFloppyDisk} />
                              )}
                            </button>
                          </Tooltip>
                          <Tooltip placement="top" title="Cancel Edit" arrow>
                            <button
                              className="hover:scale-125"
                              type="button"
                              onClick={handleCancelEdit}
                              style={{
                                padding: "0.5rem 1rem",
                                fontWeight: "600",
                                color: "white",
                                background:
                                  "linear-gradient(to right, #FF4D4D, #FF007F)",
                                borderRadius: "0.375rem",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition:
                                  "background-color 0.3s ease, transform 0.3s ease",
                                outline: "none",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(to right, #FF3B3B, #FF0055)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(to right, #FF4D4D, #FF007F)")
                              }
                            >
                              <FontAwesomeIcon icon={faX} />
                            </button>
                          </Tooltip>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Tooltip placement="top" title="Edit" arrow>
                            <button
                              className="hover:scale-125"
                              type="button"
                              onClick={() => handleUpdateUnit(data.id, data)}
                              style={{
                                padding: "0.5rem 1rem",
                                fontWeight: "600",
                                color: "white",
                                background:
                                  "linear-gradient(to right, #1E90FF, #8A2BE2)",
                                borderRadius: "0.375rem",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition:
                                  "background-color 0.3s ease, transform 0.3s ease",
                                outline: "none",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(to right, #1C86EE, #7A2BCC)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(to right, #1E90FF, #8A2BE2)")
                              }
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                          </Tooltip>
                          <Tooltip placement="top" title="Delete" arrow>
                            <button
                              className="hover:scale-125"
                              type="button"
                              onClick={() => handleDeleteUnit(data.id)}
                              style={{
                                padding: "0.5rem 1rem",
                                fontWeight: "600",
                                color: "white",
                                background:
                                  "linear-gradient(to right, #FF4D4D, #FF007F)",
                                borderRadius: "0.375rem",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition:
                                  "background-color 0.3s ease, transform 0.3s ease",
                                outline: "none",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(to right, #FF3B3B, #FF0055)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.background =
                                  "linear-gradient(to right, #FF4D4D, #FF007F)")
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </Tooltip>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  {searchTermData
                    ? `No results found for "${searchTermData}"`
                    : "No vacant/defective units found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 15, 20, 25]}
          component="div"
          count={Array.isArray(filteredData) ? filteredData.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={
            <Typography variant="subtitle" fontWeight={600}>
              Entries Per Page:
            </Typography>
          }
        />
      </TableContainer>
    </div>
  );
};

//Searchable Dropdown
const SearchableDropdown = ({
  options,
  placeholder,
  onSelect,
  searchTerm,
  setSearchTerm,
}) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (event) => {
    const term = event.target.value || "";
    setSearchTerm(term);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
    setIsOpen(true);
  };

  const handleSelectOption = (option) => {
    setSearchTerm(option.label);
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    const term = searchTerm || "";
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className="relative flex items-center">
      <input
        type="text"
        className="w-full pl-2 bg-gray-200 border border-transparent rounded-xl h-9"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {isOpen && (
        <ul className="absolute z-20 w-full mt-1 overflow-y-auto text-justify bg-white border border-gray-300 rounded-xl top-full max-h-60">
          {Array.isArray(filteredOptions) && filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 cursor-default">
              No options found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const CustomTableA = ({ rows, setRows, onSubmit, toggleModal }) => {
  const classes = useStyles();
  const [category, setCategory] = useState({ data: [] });
  const [supplier, setSupplier] = useState({ data: [] });
  const [uloading, setuLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [categorySearchTerms, setCategorySearchTerms] = useState([""]);
  const [supplierSearchTerms, setSupplierSearchTerms] = useState([""]);
  const options = [
    { value: "Vacant", label: "Vacant" },
    { value: "Defective", label: "Defective" },
  ];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get("/categories");
        setCategory(response?.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await api.get("/suppliers");
        setSupplier(response?.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchSupplier();
  }, []);

  // This is a sample data for Category
  const Category =
    category.data && category.data.length > 0
      ? category.data.map((cat) => ({
          label: cat.category_name,
          value: cat.id,
        }))
      : [];

  // This is a sample data for Supplier
  const Supplier =
    supplier.data && supplier.data.length > 0
      ? supplier.data.map((sup) => ({
          label: sup.supplier_name,
          value: sup.id,
        }))
      : [];

  const addRow = () => {
    setRows([
      ...rows,
      {
        date_of_purchase: "",
        category: "",
        description: "",
        supplier: "",
        serial_number: "",
        status: "",
      },
    ]);
    setCategorySearchTerms([...categorySearchTerms, ""]);
    setSupplierSearchTerms([...supplierSearchTerms, ""]);
  };

  const handleChangeA = (date, index) => {
    const newRows = [...rows];
    newRows[index]["date_of_purchase"] = format(date, "yyyy-MM-dd");
    setRows(newRows);
  };

  const handleSelectChange = (selectedOption, index) => {
    const newRows = [...rows];
    newRows[index]["status"] = selectedOption.value;
    setRows(newRows);
  };

  const handleChange = (index, key, newValue) => {
    const newRows = [...rows];
    newRows[index][key] = newValue;
    setRows(newRows);
  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    const newCategorySearchTerms = categorySearchTerms.filter(
      (_, i) => i !== index
    );
    setCategorySearchTerms(newCategorySearchTerms);
    const newSupplierSearchTerms = supplierSearchTerms.filter(
      (_, i) => i !== index
    );
    setSupplierSearchTerms(newSupplierSearchTerms);
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    setuLoading(true);
    onSubmit(true);
    try {
      const response = await api.post("/add-unit", rows);
      if (response.data.status === true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "green",
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
            icon: "success",
            title: response.data.message,
          });
        })();
        setValidationErrors("");
        setRows([
          {
            date_of_purchase: "",
            category: "",
            description: "",
            supplier: "",
            serial_number: "",
            status: "",
          },
        ]);
        setCategorySearchTerms([""]);
        setSupplierSearchTerms([""]);
        toggleModal();
      }
    } catch (error) {
      console.error("Error: ", error);
      if (error.response && error.response.data) {
        console.error("Backend error response:", error.response.data);
        setValidationErrors(error.response.data.errors || {});
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
      }
    } finally {
      setuLoading(false);
      onSubmit(false);
    }
  };

  return (
    <div
      className={`border border-transparent rounded-xl shadow-lg max-h-[45rem] min-h-[20rem]`}
    >
      <form onSubmit={handleAddUnit}>
        <TableContainer
          className={`${classes.container} overflow-auto max-h-[35rem] min-h-[20rem]`}
        >
          <Table className={classes.table}>
            <TableHead>
              <TableRow className="sticky top-0 z-40 bg-[#FF6600]">
                <TableCell align="center" className="rounded-tl-xl">
                  <p className="font-semibold text-white mt-1.5">
                    DATE OF PURCHASE
                  </p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-white mt-1.5">CATEGORY</p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-white mt-1.5">DESCRIPTION</p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-white mt-1.5">SUPPLIER</p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-white mt-1.5">SERIAL NO.</p>
                </TableCell>
                <TableCell align="center">
                  <p className="font-semibold text-white mt-1.5">STATUS</p>
                </TableCell>
                <TableCell align="center" className="rounded-tr-xl">
                  <FontAwesomeIcon icon={faTrash} className="opacity-0" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <DatePicker
                      selected={
                        row.date_of_purchase
                          ? new Date(row.date_of_purchase)
                          : null
                      }
                      onChange={(date) => handleChangeA(date, index)}
                      placeholderText=""
                      className={
                        validationErrors &&
                        validationErrors[`${index}.date_of_purchase`]
                          ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                          : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                      }
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.date_of_purchase`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.date_of_purchase`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <SearchableDropdown
                      options={Category}
                      value={row.category}
                      searchTerm={categorySearchTerms[index]}
                      setSearchTerm={(term) => {
                        const newSearchTerms = [...categorySearchTerms];
                        newSearchTerms[index] = term;
                        setCategorySearchTerms(newSearchTerms);
                      }}
                      placeholder=""
                      onSelect={(option) => {
                        handleChange(index, "category", option.value);
                      }}
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.category`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.category`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <textarea
                      rows={3}
                      type="text"
                      value={row.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      placeholder=""
                      className={
                        validationErrors &&
                        validationErrors[`${index}.description`]
                          ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 pl-2"
                          : "bg-gray-200 border border-transparent rounded-xl w-4/4 pl-2"
                      }
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.description`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.description`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <SearchableDropdown
                      options={Supplier}
                      value={row.supplier}
                      searchTerm={supplierSearchTerms[index]}
                      setSearchTerm={(term) => {
                        const newSearchTerms = [...supplierSearchTerms];
                        newSearchTerms[index] = term;
                        setSupplierSearchTerms(newSearchTerms);
                      }}
                      placeholder=""
                      onSelect={(option) => {
                        handleChange(index, "supplier", option.value);
                      }}
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.supplier`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.supplier`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <input
                      type="text"
                      value={row.serial_number}
                      onChange={(e) =>
                        handleChange(index, "serial_number", e.target.value)
                      }
                      placeholder=""
                      className={
                        validationErrors &&
                        validationErrors[`${index}.serial_number`]
                          ? "bg-gray-200 border border-red-500 rounded-xl w-4/4 h-9 pl-2"
                          : "bg-gray-200 border border-transparent rounded-xl w-4/4 h-9 pl-2"
                      }
                    />
                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.serial_number`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.serial_number`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      options={options}
                      value={
                        row.status
                          ? options.find(
                              (option) => option.value === row.status
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleSelectChange(selectedOption, index)
                      }
                      placeholder={row.status ? "" : "Select status"}
                      className={
                        validationErrors && validationErrors[`${index}.status`]
                          ? "border border-red-500"
                          : ""
                      }
                    />

                    <span className="text-sm text-center">
                      {validationErrors &&
                        validationErrors[`${index}.status`] && (
                          <div className="text-sm text-center text-red-500">
                            {validationErrors[`${index}.status`].map(
                              (error, errorIndex) => (
                                <span key={errorIndex}>
                                  {error.replace(`${index}.`, "")}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => deleteRow(index)}
                        className="text-base font-semibold text-red-600"
                      >
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <button
          type="button"
          onClick={addRow}
          className="mt-2 mb-2 ml-5 text-base font-semibold text-green-600"
        >
          <FontAwesomeIcon icon={faCirclePlus}></FontAwesomeIcon> ADD FIELD
        </button>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={toggleModal}
            className="w-32 mt-4 mb-5 text-base font-semibold text-white duration-700 bg-gray-600 border border-transparent hover:bg-gray-700 rounded-3xl h-9"
          >
            CLOSE
          </button>
          <button
            type="submit"
            disabled={uloading}
            className="w-32 mt-4 mb-5 text-base font-semibold text-white duration-700 bg-[#0033A0] border border-transparent hover:bg-blue-700 rounded-3xl h-9"
          >
            {uloading ? "ADDING..." : "ADD"}
          </button>
        </div>
      </form>
    </div>
  );
};

function Unit() {
  const [rows, setRows] = useState([
    {
      date_of_purchase: "",
      category: "",
      description: "",
      supplier: "",
      serial_number: "",
      status: "",
    },
  ]);
  const [refresh, setRefresh] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const handleSearchTerm = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <>
      <p className="pt-10 ml-10 text-2xl font-normal">Setup Unit</p>
      <div className="mt-2 ml-10">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            path
            to="/dashboard"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            <SettingsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Setup
          </Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <PhonelinkSetupIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Setup Unit
          </Typography>
        </Breadcrumbs>
      </div>
      <br /> <br />
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white min-h-[20rem] max-h-[45rem] max-w-[95%] right-5 top-5 rounded-xl relative">
            <button
              className="absolute z-50 text-5xl text-black right-7 top-2 hover:text-gray-700"
              onClick={toggleModal}
            >
              &times;
            </button>
            <CustomTableA
              rows={rows}
              setRows={setRows}
              onSubmit={setRefresh}
              toggleModal={toggleModal}
            />
          </div>
        </div>
      )}
      <div className="relative">
        <div className="flex justify-between px-4">
          <TextField
            size="small"
            label="Search..."
            variant="outlined"
            onChange={handleSearchTerm}
          />
          <button
            onClick={toggleModal}
            className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition duration-300 ease-in-out bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 right-5"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Unit</span>
          </button>
        </div>

        <div className="px-4 py-6 rounded-lg max-h-[45rem] overflow-auto">
          <CustomTableB
            rows={rows}
            refresh={refresh}
            searchTermData={searchTerm}
          />
        </div>
      </div>
    </>
  );
}

export default Unit;
