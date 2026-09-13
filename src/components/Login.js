import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import api from "../service/Api";


export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOnpasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        },
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);

      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      if (error.response) {
        props.showAlert(error.response.data.message,"danger")
        
      }
    }
    finally{
        setLoading(false);
    }
  };
  return (
    <div
      className="container text-center my-5"
      style={{ border: "1px solid #fbdbdb" }}
    >
      <h1 className="my-3">Welcome to Orbit</h1>
      <img
        className="my-3"
        src="https://www.acmindia.co.in/assets/ACM9-BVSferPT.png"
        alt=""
        style={{
          height: "100px",
          width: "90px",
          backgroundColor: "#1ba6de",
          borderRadius: "15px",
        }}
      />
      {loading && <Spinner/>}
    <form
        className="my-4"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        onSubmit={handleLogin}
      >
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            style={{
              border: "1px solid #fbdbdb",
              width: "400px",
            }}
            value={email}
            onChange={handleOnEmailChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            style={{
              border: "1px solid #fbdbdb",
              width: "400px",
            }}
            value={password}
            onChange={handleOnpasswordChange}
          />
        </div>
        <button
          type="submit"
          className="btn"
          style={{
            backgroundColor: "#1ba6de",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
