import LoginForm from "./LoginForm";
import ValidationLabel from "../Validation/ValidationLabel";
import RegistrationForm from "./RegistrationForm";
import { useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { type UserDataOnboarding } from "./RegistrationForm";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegistrationCredentials = {
  username: string;
  password: string;
  usernameConf: string;
  passwordConf: string;
};

export interface UserData {
  id: number;
  email: string;
  secret: string;
  fk_user_id: number;
  name: string;
  surname: string;
  phone: string;
  age: string;
  birthdate: string;
}

type OnboardingComponentProps = {
  setLoggedIn: (loggedIn: boolean) => void;
  setUserData: (data: UserData | undefined) => void;
  navigate: (path: string) => void;
}

export default function OnboardingComponent({
  setLoggedIn,
  setUserData,
  navigate,
}: OnboardingComponentProps) {

  const [isLogin, setLogin] = useState(true);

  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });

  const [registrationCredentials, setRegistrationCredentials] =
    useState<RegistrationCredentials>({
      username: "",
      usernameConf: "",
      password: "",
      passwordConf: "",
    });


  const [resultFromServerText, setResultFromServerText] = useState("");

  // todo Validations for registration

  //const [isLoginFormValid, setIsLoginFormValid] = useState(true);
  const [isLoginFormValid, setIsLoginFormValid] = useState(false);


  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const usernameConf = useRef<HTMLInputElement>(null);
  const passwordConf = useRef<HTMLInputElement>(null);

  const name = useRef<HTMLInputElement>(null);
  const surname = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const age = useRef<HTMLInputElement>(null);


  function toggleSetLogin() {
    setLogin((prevValu) => !prevValu);
  }



  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (isLogin) {
      setLoginCredentials(prevValue => ({ ...prevValue, [name]: value, }));
    } else {
      setRegistrationCredentials(prevValue => ({ ...prevValue, [name]: value }));
    }
  }

  function checkValidityLoginForm(validity: { isUsernameValid: boolean, isPwdValid: boolean }) {
    if (validity.isPwdValid && validity.isUsernameValid) {
      setIsLoginFormValid(true);
    } else {
      setIsLoginFormValid(false);
    }
  }

  function checkValidityRegisterForm(validity: { isUsernameValid: boolean, isUsernameConfValid: boolean, isPwdValid: boolean, isPwdConfValid: boolean, isNameValid: boolean, isSurnameValid: boolean, isAgeValid: boolean, isPhoneValid: boolean }) {
    if (validity.isUsernameValid && validity.isUsernameConfValid && validity.isPwdValid && validity.isPwdConfValid && validity.isNameValid && validity.isSurnameValid && validity.isAgeValid && validity.isPhoneValid) {
      setIsLoginFormValid(true)
    } else {
      setIsLoginFormValid(false);
    }
  }

  async function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const usernameVal = username.current?.value || "";
    const passwordVal = password.current?.value || "";

    const usernameConfVal = usernameConf.current?.value || "";
    const passwordConfVal = passwordConf.current?.value || "";

    const nameVal = name.current?.value || "";
    const surnameVal = surname.current?.value || "";
    const phoneVal = phone.current?.value || "";
    const ageVal = age.current?.value || "";

    if (isLogin) {
      if (isLoginFormValid) {
        console.log("Login credentials are valid");
        console.log("Submitting is in processing....");

        const loginCreds: LoginCredentials = {
          username: loginCredentials.username,
          password: loginCredentials.password,
        };

        try {
          const response = await axios.post(
            "http://localhost:3000/login",
            { username: loginCreds.username, password: loginCreds.password },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              withCredentials: true,
            }
          );
          event.currentTarget?.reset();
          setLoginCredentials(() => {
            return {
              username: "",
              password: "",
            };
          });
          console.log(response);
          setResultFromServerText("");
          setLoggedIn(true);
          setUserData(response.data);
          navigate("/profile");
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            console.error("Error while logging in");
            console.error(error);
            setResultFromServerText(error.response?.data.error);
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
      } else {
        alert("Zadejte své platné údaje");
        event.preventDefault();
      }
    } else {
      // ? Is registration
      if (isLoginFormValid) {
        console.log("Registration credentials are valid.");
        console.log("Submiting is in processing....");

        const registrationCredentials: RegistrationCredentials = {
          username: usernameVal,
          password: passwordVal,
          usernameConf: usernameConfVal,
          passwordConf: passwordConfVal,
        };

        const userDetailData: UserDataOnboarding = {
          name: nameVal,
          surname: surnameVal,
          age: ageVal,
          phone: phoneVal
        }

        try {
          const registrationResponse = await axios.post("http://localhost:3000/register", { username: registrationCredentials.username, password: registrationCredentials.password, userDetail: userDetailData }, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true,
          }
          );

          if (event.currentTarget) {
            event.currentTarget.reset();
          }

          console.log(registrationResponse);
          setResultFromServerText("");
          setLoggedIn(true);
          setUserData(registrationResponse.data);
          navigate("/profile");
          setRegistrationCredentials(() => {
            return {
              username: "",
              password: "",
              usernameConf: "",
              passwordConf: ""
            };
          });

        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            console.error("Error while logging in");
            console.error(error);
            setResultFromServerText(error.response?.data.error);
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
      } else {
        alert("Zadejte své platné údaje");
        event.preventDefault();
      }
    }
  }


  return (
    <main>
      <h1 style={{ color: "#f1bc1e", textShadow: "3px 5px 1px black" }}>Application</h1>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <p className="accessType" onClick={toggleSetLogin}>
        {isLogin ? "Don't have an account?" : "Already have an account"}
      </p>
      <form
        onSubmit={handleOnSubmit}
        method="POST"
        action={isLogin ? "/login" : "/register"}
      >
        {isLogin ? (
          <LoginForm
            onChange={handleOnChange}
            loginCredentials={loginCredentials}
            usernameRef={username}
            passwordRef={password}
            checkValidityForm={checkValidityLoginForm}
          ></LoginForm>
        ) : (
          <RegistrationForm
            onChange={handleOnChange}
            registrationCredentials={registrationCredentials}
            usernameRef={username}
            passwordRef={password}
            usernameConfRef={usernameConf}
            passwordConfRef={passwordConf}
            nameRef={name}
            surnameRef={surname}
            ageRef={age}
            phoneRef={phone}
            checkValidityForm={checkValidityRegisterForm}
          />
        )}

        <ValidationLabel
          alignmentText="center"
          reference={""}
          isMatching={false}
          errorMessage={resultFromServerText}
        ></ValidationLabel>
        <button
          disabled={isLoginFormValid ? false : true}
          className={
            isLoginFormValid ? "form-button-default" : "disabled-button"
          }
          type="submit"
          name="submitButton"
        >
          {isLogin ? "LOGIN" : "REGISTER"}
        </button>
      </form>
    </main>
  )
}