import { createContext, useState } from "react";
import clayful from "clayful/client-js";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext(); // 다른 곳에서도 사용할 수 있도록

const AuthContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = () => {
    var Customer = clayful.Customer;

    let options = {
      customer: localStorage.getItem("accessToken"),
    };

    Customer.isAuthenticated(options, function (err, result) {
      if (err) {
        // Error case
        console.log(err.code);
        setIsAuth(false);
        return;
      }

      // var headers = result.headers;
      var data = result.data;

      if (data.authenticated) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }

      // console.log(data);
      // console.log(isAuth);
    });
  };
  const signOut = () => {
    setIsAuth(false);
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const AuthContextData = {
    isAuth,
    isAuthenticated,
    signOut,
  };

  return <AuthContext.Provider value={AuthContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
