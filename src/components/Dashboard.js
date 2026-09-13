import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import attendanceIcon from "./attendance.png";
import dailyReportIcon from "./dailyReport.png";
import clockInIcon from "./clockedinIcon.png";
import leaveIcon from "./LeaveIcon.png";
import PaySlipIcon from "./PaySlipIcon.png";
import Spinner from "./Spinner";
import api from "../service/Api";
import getTimeInISt from "../service/UtcToIstTime";

export default function Dashboard(props) {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [clockedOut, setClockedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workingTime, setWorkingTime] = useState("0h 0m 0s");
  const [todayDate, setTodayDate] = useState("");
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const [checkClockin,setCheckClockin] = useState(null);
  const [page,setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const now = new Date();
    const day = now.getDate();
    const year = now.getFullYear();
    const month = months[now.getMonth()];

    setTodayDate(`${month} ${day}, ${year}`);
  }, []);

  useEffect(() => {
    const fetchLoggedInEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/employees/me/profile", {
          headers: {
            authorization: token,
          },
        });

        setLoggedInEmployee(response.data.employee);
      } catch (error) {
        console.log(error);
        props.showAlert(error.response.data.message, "danger");
      }
    };
    fetchLoggedInEmployee();
  }, []);

  useEffect(() => {
    if (!clockedIn || !clockInTime) {
      return;
    }
    const interval = setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - new Date(clockInTime).getTime();

      const totalSeconds = Math.floor(difference / 1000);

      const hours = Math.floor(totalSeconds / 3600);

      const minutes = Math.floor((totalSeconds % 3600) / 60);

      const second = totalSeconds % 60;

      setWorkingTime(`${hours}h ${minutes}m ${second}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [clockedIn, clockInTime]);

   useEffect(() => {
    fetchedTodayAttendance();
  }, [page]);

  const fetchedTodayAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const response = await api.get(`/attendance/today?page=${page}&limit=${limit}`, {
          headers: {
            authorization: token,
          },
        });
      
        setAttendance(response.data.attendance);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.log(error.message);
        props.showAlert(error.response.data.message, "danger");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const checkExistingClockIn = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const response = await api.get(
          "/attendance/check/today/clock-in",
          {
            headers: {
              authorization: token,
            },
          },
        );
        const data = response.data.attendance;
        setCheckClockin(response.data.attendance);
        if (data?.clock_in && !data?.clock_out) {
          setClockedIn(true);
          setClockedOut(false);
          setClockInTime(data.clock_in);
        }
        if (data?.clock_in && data?.clock_out) {
          setClockedIn(false);
          setClockedOut(true);
          setClockInTime(data.clock_in);
        }
      } catch (error) {
        console.log(error);
        props.showAlert(error.response.data.message,"danger");
      }
      finally{
        setLoading(false);
      }
    };
    checkExistingClockIn();
  }, []);

  const handleClockIn = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await api.post(
        "/attendance/clock-in",
        {},
        {
          headers: {
            authorization: token,
          },
        },
      );

      setClockedIn(true);

      setClockInTime(response.data.attendance.clock_in);

      props.showAlert(response.data.message, "success");
    } catch (error) {
      console.log(error);
      props.showAlert(error.response.data.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setClockedIn(false);
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await api.post(
        "/attendance/clock-out",
        {},
        {
          headers: {
            authorization: token,
          },
        },
      );
      props.showAlert(response.data.message, "success");

    } catch (error) {
      console.log(error.message);
      props.showAlert(error.response.data.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev=()=>{
    if(page > 1){
      setPage(page-1);
    }
  }

  const handleNext=()=>{
    if(page < totalPages){
      setPage(page + 1);
    }
  }

  return (
    <>
      <Navbar />
      <hr className="mt-0" />

      <div className="container mt-4">
        <h2 className="fw-bold">
          {loggedInEmployee
            ? `Good Morning ${loggedInEmployee.first_name} ${loggedInEmployee.last_name}`
            : "Good Morning"}
        </h2>

        <p className="text-muted">
          {`Here is your daily overview for ${todayDate}`}
        </p>
      </div>

      <div className="container my-4">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={attendanceIcon}
                    alt="Attendance"
                    style={{
                      width: "28px",
                      height: "28px",
                      objectFit: "contain",
                    }}
                  />

                  <h5 className="card-title fw-bold ms-2 mb-0">Attendance</h5>
                </div>

                <p className="text-muted mb-2">
                  {checkClockin?.clock_in && !checkClockin?.clock_out
                    ? "Clocked In"
                    : checkClockin?.clock_out
                      ? "Clocked Out"
                      : "Yet Not Clocked In"}
                </p>

                {loading && <Spinner />}

                {!loading && <h4 className="fw-bold mb-1">{workingTime}</h4>}

                <p className="text-muted small">Today's working hours</p>
                <div className="d-flex gap-2 mt-4">
                  <button
                    className="btn btn-success"
                    onClick={handleClockIn}
                    disabled={clockedIn || clockedOut}
                  >
                    <img
                      src={clockInIcon}
                      alt="Clock In"
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "6px",
                      }}
                    />
                    Clock In
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={handleClockOut}
                    disabled={!clockedIn}
                  >
                    Clock Out
                    <img
                      src={clockInIcon}
                      alt="Clock Out"
                      style={{
                        width: "16px",
                        height: "16px",
                        marginLeft: "6px",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={dailyReportIcon}
                    alt="Daily Reports"
                    style={{
                      width: "28px",
                      height: "28px",
                      objectFit: "contain",
                    }}
                  />

                  <h5 className="card-title fw-bold ms-2 mb-0">
                    Today's Daily Reports
                  </h5>
                </div>

                <p className="text-muted mb-1">Status</p>

                <h4 className="fw-bold">Pending</h4>

                <button className="btn btn-success mt-3">Add Report</button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={leaveIcon}
                    alt="Leave"
                    style={{
                      width: "28px",
                      height: "28px",
                      objectFit: "contain",
                    }}
                  />

                  <h5 className="card-title fw-bold ms-2 mb-0">
                    Leave Balance
                  </h5>
                </div>

                <h4 className="fw-bold">12 Days</h4>

                <p className="text-muted">Available leave balance</p>

                <button className="btn btn-success mt-2">Apply Leave</button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={PaySlipIcon}
                    alt="Payslip"
                    style={{
                      width: "28px",
                      height: "28px",
                      objectFit: "contain",
                    }}
                  />

                  <h5 className="card-title fw-bold ms-2 mb-0">Last Payslip</h5>
                </div>

                <h5 className="fw-bold">Oct 2026</h5>

                <p className="text-muted">Latest generated payslip</p>

                <Link to="/employeePortal" className="btn btn-link px-0">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <Spinner/>}
      {!loading && <div className="container my-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">Todays Attendance</h4>

              <Link to="/attendance" className="text-decoration-none">
                View All
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>Working hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                
                <tbody>
                  {attendance.map((element) => {
                    return (
                      <tr>
                        <td>{element.attendance_date}</td>

                        <td>{element.employee.first_name + " " + element.employee.last_name}</td>

                        <td>{getTimeInISt(element.clock_in)}</td>

                        <td>{getTimeInISt(element.clock_out)}</td>

                        <td>{`${element.working_hours} hours`}</td>

                        <td>
                          <span className="badge bg-success">
                            {element.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
         <div className="d-flex gap-2 mt-4">
          <button
            className="btn btn-success"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            <strong>{page}</strong>of <strong>{totalPages}</strong>
          </span>
          <button
            className="btn btn-danger"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>}
    </>
  );
}
