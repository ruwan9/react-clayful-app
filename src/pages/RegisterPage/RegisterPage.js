import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clayful from "clayful/client-js";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    var Customer = clayful.Customer;

    var payload = {
      email: email,
      password: password,
    };

    Customer.createMe(payload, function (err, result) {
      if (err) {
        // Error case
        console.log(err.code);
        return;
      }
      navigate("/login");
      // var data = result.data;
      // console.log(data);
    });
  };

  return (
    <div className="pageWrapper">
      <div className="auth-wrapper">
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit}>
          <input onChange={handleEmailChange} name="email" type="email" placeholder="Apple ID" value={email} />
          <input onChange={handlePasswordChange} name="password" type="password" placeholder="password" value={password} />
          <button type="submit">회원가입</button>
          <Link to="/login" style={{ color: "gray", textDecoration: "none" }}>
            이미 Apple ID가 있다면? 지금 로그인.
          </Link>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
