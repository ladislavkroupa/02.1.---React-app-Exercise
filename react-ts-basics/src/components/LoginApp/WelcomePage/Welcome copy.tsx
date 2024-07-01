import { useState, useRef, InputHTMLAttributes, HTMLInputTypeAttribute, useEffect } from "react"
import ValidationLabel from "../Validation/ValidationLabel.tsx";
import { getData } from "../utils/data-utils.ts";
import Profile from "../Profile.tsx";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { AxiosError } from 'axios';
import Logout from "./Logout.tsx";
import LoginForm from "./LoginForm.tsx";



export type UserCredentials = {
  username: string;
  password: string;
}

type LoginValidation = {
  isEmailValid: boolean;
  isPwdValid: boolean;
}

export interface UserData {
  id: number;
  email: string;
  password: string;
  secret: string;
  fk_user_id: number;
  name: string;
  surname: string;
  phone: string;
}



export default function Welcome() {

  const [isLogin, setLogin] = useState(true);
  const [userCredentials, setUserCredentials] = useState<UserCredentials>({ username: "", password: "" })

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  // todo Validations for registration
  const [isEmailMatch, setIsEmailMatch] = useState(false);
  const [isPwdMatch, setIsPwdMatch] = useState(false);
  const [emailValidationText, setEmailValidationText] = useState("");
  const [pwdValidationText, setPwdValidationText] = useState("");

  // todo Validations for login
  const [loginValidation, setLoginValidation] = useState<LoginValidation>({ isEmailValid: false, isPwdValid: false });
  const [loginEmailValidationText, setLoginEmailValidationText] = useState("");
  const [loginPwdValidationText, setLoginPwdValidationText] = useState("");

  const [isFormValid, setIsLoginFormValid] = useState(true);


  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const confEmail = useRef<HTMLInputElement>(null);
  const confpassword = useRef<HTMLInputElement>(null);

  const navigate = useNavigate(); // Získání funkce pro navigaci


  function toggleSetLogin() {
    setLogin(prevValu => !prevValu);
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile', { withCredentials: true });
        console.log(response);
        if (response.status === 200) {
          console.log('User is authenticated');
          setLoggedIn(true);
          setUserData(response.data);
          navigate("/profile");
        } else if (response.status === 204) {
          setLoggedIn(false);
          navigate("/welcome");
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response) {
            console.log('User is not authenticated');
            setLoggedIn(false);
            setUserData(undefined);
            navigate('/error');
          } else {
            console.error('An error occurred:', error);
          }
        } else {
          console.error("Neznámá chyba:", error);

        }

      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get('http://localhost:3000/logout');
        navigate('/welcome'); // Přesměrujte uživatele na login stránku nebo jinou stránku po úspěšném odhlášení
      } catch (error) {
        console.error('Logout failed:', error);
        // Můžete také přesměrovat na stránku chybového hlášení nebo zobrazit chybovou zprávu
      }
    };

    logout();
  }, [navigate]);



  function validateRegistrationForm(emailVal: string, confEmailVal: string, passwordVal: string, confPassVal: string, nameOfInput: string) {

    validateEmailAndPassword(emailVal, passwordVal, nameOfInput);


    if (loginValidation.isEmailValid) {
      if (confEmailVal.length === 0) {
        setEmailValidationText("Email cannot be empty");
        setIsEmailMatch(false);
        setIsLoginFormValid(false);
      } else if (confEmailVal === emailVal) {
        setEmailValidationText("Email is correct");
        setIsEmailMatch(true);
        if (loginValidation.isPwdValid && isPwdMatch) {
          console.log("fsf");
          setIsLoginFormValid(true);

        }
      } else {
        setEmailValidationText("Email not match");
        setIsEmailMatch(false);
        setIsLoginFormValid(false);
      }
    }

    if (loginValidation.isPwdValid) {
      if (confPassVal !== passwordVal) {
        setPwdValidationText("Password is wrong");
        setIsPwdMatch(false);
        setIsLoginFormValid(false);
      } else if (passwordVal.length === 0) {
        setPwdValidationText("");
        setIsPwdMatch(false);
        setIsLoginFormValid(false);
      } else if (confPassVal === passwordVal) {
        setPwdValidationText("Password is correct");
        setIsPwdMatch(true);
        if (loginValidation.isEmailValid && isEmailMatch) {
          setIsLoginFormValid(true);
        }
      }
    }



  }

  function isEmail(val: string) {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val)) {
      console.log("invalid emaiL");
      return false
    } else {
      console.log("email si valid " + val);
      return true;
    }
  }

  function validateEmailAndPassword(email: string, password: string, nameOfInput: string) {

    if (nameOfInput === "email") {
      const isEmailValid = "isEmailValid";
      if (email.length === 0) {
        setIsLoginFormValid(false);
        setLoginValidation((prevValue) => {
          console.log(prevValue);
          return {
            ...prevValue,
            [isEmailValid]: false,
          };
        });
        setLoginEmailValidationText("Email cannot be empty")
      } else {
        if (isEmail(email)) {
          setLoginValidation((prevValue) => {
            if (prevValue.isPwdValid && isLogin) {
              setIsLoginFormValid(true);
            }
            return {
              ...prevValue,
              [isEmailValid]: true,
            };
          });
          setLoginEmailValidationText("Email is entered");
        } else {
          setIsLoginFormValid(false);
          setLoginValidation((prevValue) => {
            return {
              ...prevValue,
              [isEmailValid]: false,
            };
          });
          setLoginEmailValidationText("Invalid e-mail format")
        }

      }
    } else if (nameOfInput === "password") {
      const isPwdValid = "isPwdValid";

      if (password.length === 0) {
        console.log("Set login form to FALSE");
        setLoginValidation((prevValue) => {
          return {
            ...prevValue,
            [isPwdValid]: false,
          };
        });
        setLoginPwdValidationText("Password cannot be empty")
      } else {
        setLoginValidation((prevValue) => {
          if (prevValue.isEmailValid && isLogin) {
            setIsLoginFormValid(true);
          }
          return {
            ...prevValue,
            [isPwdValid]: true,
          };
        });
        setLoginPwdValidationText("Password is entered");

      }
    }
  }

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {

    const { name, value } = event.target;
    const emailVal = username.current?.value || "";
    const passwordVal = password.current?.value || "";

    const confEmailVal = confEmail.current?.value || "";
    const confPassVal = confpassword.current?.value || "";


    if (isLogin) {
      validateEmailAndPassword(emailVal, passwordVal, name);
      setUserCredentials((prevValue) => {
        return {
          ...prevValue,
          [name]: value
        }
      });

    } else {
      validateRegistrationForm(emailVal, confEmailVal, passwordVal, confPassVal, name);
      if (isEmailMatch && isPwdMatch) {
        console.log("Credentials are OK!");
      } else {
      }

    }

  }




  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    const emailVal = username.current?.value || "";
    const passwordVal = password.current?.value || "";


    if (isLogin) {
      if (isFormValid) {
        console.log("Login credentials are valid");
        console.log("Submitting is in processing....");

        const loginCreds: UserCredentials = {
          username: userCredentials.username,
          password: userCredentials.password
        }

        console.log(loginCreds);

        try {
          const response = await axios.post("http://localhost:3000/login", { username: loginCreds.username, password: loginCreds.password }, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true

          });
          event.currentTarget?.reset();
          setLoginEmailValidationText("");
          setLoginPwdValidationText("");
          setUserCredentials(() => {
            return {
              username: "",
              password: ""
            }
          })
          console.log(response);
          setLoggedIn(true);
          setUserData(response.data);
          navigate('/profile');

        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            console.error("Error while logging in");
            console.error(error);

            if (error.response?.status === 404) {
              navigate("/welcome");
            }
            if (error.response) {
              setLoginPwdValidationText(error.response.data.error)
              setLoginValidation((prevValue) => {
                return {
                  ...prevValue,
                  isPwdValid: false,
                };
              });
              console.error("Response data:", error.response.data.error);
              console.error("Response status:", error.response.status);
              console.error("Response headers:", error.response.headers);

            }
          } else {
            console.error("Neznámá chyba:", error);
          }
        }
      } else {
        alert("Zadejte své platné údaje");
        event.preventDefault();
      }
    } else {
      // ? Is registration
      if (isFormValid) {
        console.log("Registration credentials are valid.");
        console.log("Submiting is in processing....");

        const regCred: UserCredentials = {
          username: emailVal,
          password: passwordVal
        }

        alert(regCred);
        event.currentTarget!.reset();

      } else {
        alert("Zadejte své platné údaje");
        event.preventDefault();
      }


    }



  }


  return (
    <Routes>
      <Route path="/welcome" element={<header>
        <main>
          <h1>Welcome</h1>
          <h2>{isLogin ? "Login" : "Register"}</h2>
          <p className="accessType" onClick={toggleSetLogin}>{isLogin ? "Don't have an account?" : "Already have an account"}</p>
          <form onSubmit={handleOnSubmit} method="POST" action="/login">
            { /**/}
            <p>
              <label htmlFor="email">Email</label>
              <input onChange={handleOnChange} value={userCredentials.username} ref={username} type="email" name="username" id="email" />
              <ValidationLabel reference={"confirmEmail"} isMatching={loginValidation.isEmailValid} errorMessage={loginEmailValidationText} />
            </p>
            <p style={{ display: isLogin ? "none" : "block" }}>
              <label htmlFor="confirmEmail">Confirm Email</label>
              <input onChange={handleOnChange} type="email" name="confirmEmail" id="confirmEmail" ref={confEmail} />
              <ValidationLabel reference={"confirmEmail"} isMatching={isEmailMatch} errorMessage={emailValidationText} />
            </p>
            <p>
              <label htmlFor="password">Password</label>
              <input onChange={handleOnChange} value={userCredentials.password} ref={password} type="password" name="password" id="password" /><ValidationLabel reference={"confirmEmail"} isMatching={loginValidation.isPwdValid} errorMessage={loginPwdValidationText} />
            </p>
            <p style={{ display: isLogin ? "none" : "block" }}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input onChange={handleOnChange} type="password" name="confirmPassword" id="confirmPassword" ref={confpassword} />
              <ValidationLabel reference={"confirmPassword"} isMatching={isPwdMatch} errorMessage={pwdValidationText}></ValidationLabel>
            </p>
            <button disabled={isFormValid ? false : true} className={isFormValid ? "form-button-default" : "disabled-button"} type="submit">{isLogin ? "LOGIN" : "REGISTER"}</button>
          </form>
        </main>
      </header>} />
      <Route path="/profile" element={loggedIn ? <Profile userData={userData} /> : <h1>/Profile</h1>} />
      <Route path="/error" element={<h1>User was not found. Routa /welcome</h1>} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  )

}