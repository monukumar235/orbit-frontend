import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import api from "../service/Api";
import Spinner from "./Spinner";
import getTimeInISt from "../service/UtcToIstTime";

export default function Attendance(props) {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceHistory();
  }, [page]);

  const fetchAttendanceHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await api.get(
        `/attendance/history?page=${page}&limit=${limit}`,
        {
          headers: {
            authorization: token,
          },
        },
      );
      setAttendanceHistory(response.data.attendance);
      console.log(response.data.attendance);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
      props.showAlert(error.response.data.message, "danger");
    }
    finally{
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
       setPage(page - 1);
    }
  };
  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <>
      <Navbar />
      {loading && <Spinner/>}
     {!loading && <div className="container my-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">Recent Attendance</h4>
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

                {attendanceHistory.map((item) => (
                  <tbody>
                    <tr>
                      <td>{item.attendance_date}</td>
                     
                      <td>{item.employee.first_name + " "+ item.employee.last_name}</td>

                      <td>{getTimeInISt(item.clock_in)}</td>

                      <td>{getTimeInISt(item.clock_out)}</td>

                      <td>{`${item.working_hours} hours`}</td>

                      <td>
                        <span className="badge bg-success">{item.status}</span>
                      </td>
                    </tr>
                  </tbody>
                ))}
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
