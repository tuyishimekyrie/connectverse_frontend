import { useEffect, useState } from "react";
import { News } from "../components";
import Sidebar from "../components/Sidebar";
import Tweets from "../components/Tweets";
import { useNavigate } from "react-router-dom";
import url from "../utils/api-client";
import { jwtDecode } from "jwt-decode";
import User from "../types/userType";
import { Toaster, toast } from "sonner";
const Home = () => {
  const [token, setToken] = useState<string | null>();
  const [usersData, setUsersData] = useState<User>();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTokenFromLocalStorage = async () => {
      const tokenData = localStorage.getItem("token-admin");
      console.log("tokenData", tokenData);
      console.log("token", token);

      if (tokenData) {
        try {
          // const { token } = JSON.parse(tokenData);
          // console.log(token);
          setToken(tokenData);
          const tokenEmail = jwtDecode(tokenData);
          const emailData = tokenEmail.sub;
          if (emailData) {
            
            setEmail(emailData);
          }
          fetchUsers(tokenData);
        } catch (error) {
          console.error("Error processing token data:", error);
        }
      } else {
        navigate("/");
      }
    };

    fetchTokenFromLocalStorage();
  }, []);

  const fetchUsers = async (tokenData: string) => {
    const tokenDataa = localStorage.getItem("token-admin");
    const tokenEmails = jwtDecode(tokenDataa);
    const emailDatas = tokenEmails.sub;
    const response = await fetch(url + "/api/v1/user/getuserbyemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenData || "",
      },
      body: JSON.stringify({ email: emailDatas }),
    });
    // const response = await fetch(url + "/api/v1/welcome")
    const responseDataEmail = await response.json();
     setUsersData(responseDataEmail);
    console.log(responseDataEmail);
  };
  const isTokenExpired = (token: string | null | undefined) => {
    const tokenDatas = localStorage.getItem("token-admin");
    console.log("Tokenexp", tokenDatas);
    if (!tokenDatas) {
      console.log("TokenexpNot", token);

      return true;
    }

    const { exp } = jwtDecode(tokenDatas); // Decode token to get the expiration date
    if (!exp) return true;

    const currentTime = Date.now() / 1000; // Current time in seconds
    return exp < currentTime;
  };
  if (isTokenExpired(token)) {
    console.log("isTokenexp", isTokenExpired(token))
    toast.error("Token has expired, please log back in ");
    
  }
const exps = isTokenExpired(token);

  useEffect(() => {
  
  if (exps) {
    console.log("exps")
    setTimeout(() => {
      navigate("/");
      localStorage.removeItem("token-admin");
    }, 3000);
  }
}, [exps, navigate]);

console.log("usersData", usersData)
  return (
    <div className="bg-[#0E1225] h-screen w-screen flex p-0 m-0">
      <Toaster position="top-right" richColors />
      <Sidebar />
      <div className="main"> 
        <Tweets data={usersData} />
      </div>
      <div className="right">
        <News />
      </div>
    </div>
  );
};

export default Home;
