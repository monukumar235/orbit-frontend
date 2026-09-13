import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import  Dashboard from "./components/Dashboard"; 
import  EmployeePortal from "./components/EmployeePortal"; 
import  DailyReport from "./components/DailyReport"; 
import  PaySlip from "./components/PaySlip"; 
import ProtectedRoutes from "./components/ProtectedRoutes";
import {useState} from "react";
import Alert from './components/Alert';
import Attendance from './components/Attendance';


function App() {
  const [alert,setAlert] = useState(null);

  const showAlert=(message,type)=>{
    setAlert({
      mgs : message,
      type : type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
    <Router>
      <Alert alert={alert}/>
    <Routes>
      <Route path="/" element={<Login showAlert ={showAlert} />}/>
      <Route path="/dashboard" element={<ProtectedRoutes><Dashboard showAlert ={showAlert}/></ProtectedRoutes>}/>
      <Route path="/profile" element={<ProtectedRoutes><EmployeePortal/></ProtectedRoutes>}/>
      <Route path="/dailyReports" element={<ProtectedRoutes><DailyReport/></ProtectedRoutes>}/>
      <Route path="/paySlip" element={<ProtectedRoutes><PaySlip/></ProtectedRoutes>}/>
      <Route path="/attendance" element={<ProtectedRoutes><Attendance showAlert={showAlert}/></ProtectedRoutes>}/>
    </Routes>
    </Router>
    </>
  )
}

export default App;
