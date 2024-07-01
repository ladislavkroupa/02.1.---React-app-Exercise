import Profile from "../Profile.tsx";
import { useState, useEffect } from "react";
import { UserData } from "./OnboardingComponent.tsx";
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { AxiosError } from "axios";
import OnboardingComponent from "./OnboardingComponent.tsx";



export default function RoutingComponent() {

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  const navigate = useNavigate(); // Získání funkce pro navigaci

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        console.log(response);
        if (response.status === 200) {
          console.log("User is authenticated");
          setLoggedIn(true);
          setUserData(response.data);
          navigate("/profile");
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response) {
            console.log("User is not authenticated");
            setLoggedIn(false);
            setUserData(undefined);
            navigate("/");
          } else {
            console.error("An error occurred:", error);
          }
        } else {
          console.error("Neznámá chyba:", error);
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <Routes>
      <Route
        path={"/welcome"}
        element={
          <OnboardingComponent
            setLoggedIn={setLoggedIn}
            setUserData={setUserData}
            navigate={navigate}
          />
        }
      />
      <Route
        path={"/"}
        element={
          <OnboardingComponent
            setLoggedIn={setLoggedIn}
            setUserData={setUserData}
            navigate={navigate}
          />
        }
      />
      <Route
        path="/profile"
        element={loggedIn ? <Profile userData={userData} navigate={navigate} /> : <OnboardingComponent
          setLoggedIn={setLoggedIn}
          setUserData={setUserData}
          navigate={navigate}
        />}
      />
      <Route
        path="/error"
        element={<h1>User was not found. Routa /welcome</h1>}
      />
    </Routes>
  );
}
