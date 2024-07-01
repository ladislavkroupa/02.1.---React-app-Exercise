import axios, { AxiosError } from "axios";
import navImg from "./assets/lk_dev_logo.png";


interface NavbarProps {
  navigate: (path: string) => void;
}


export default function Navbar({ navigate }: NavbarProps) {


  async function handleLogoutFunction() {
    try {
      const response = await axios.get("http://localhost:3000/logout", { withCredentials: true });
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error while logging in");
        console.error(error);

        if (error.response?.status === 404) {
          navigate("/");
        }
        if (error.response) {
          console.error("Response data:", error.response.data.error);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);

        }
      } else {
        console.error("Neznámá chyba:", error);
      }
    }

  }

  return (
    <div className="navigation-component">
      <header>
        <nav>
          <div className="nav-container">
            <div className="img-container">
              <img src={navImg} alt="logo-png" />
            </div>
            <div className="menu-list">
              <ul className="nav-bar-ul">
                <a href=""><li className="overline">Home</li></a>
                <a href=""><li>Profile</li></a>
                <a href=""><li>Settings</li></a>
              </ul>
            </div>
            <button id="btn-logout" onClick={handleLogoutFunction} className="btn btn-blue">Logout</button>
          </div>
        </nav>
      </header>
    </div>
  )
}