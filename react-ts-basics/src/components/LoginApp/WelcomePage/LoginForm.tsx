import ValidationLabel from "../Validation/ValidationLabel"
import { ChangeEvent, useEffect, useState } from "react";
import { isEmailRegexValidation } from "../utils/data-utils";



type LoginFormProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;

  loginCredentials: {
    username: string,
    password: string
  };
  usernameRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  checkValidityForm: (validity: { isUsernameValid: boolean, isPwdValid: boolean }) => void;
}

export default function LoginForm({ onChange, loginCredentials, usernameRef, passwordRef, checkValidityForm }: LoginFormProps) {


  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPwdValid, setIsPwdValid] = useState(false);
  const [loginValidationText, setLoginValidationText] = useState({ emailText: "", pwdText: "" });

  const [isLoginFormValid, setIsLoginFormValid] = useState({ isUsernameValid: false, isPwdValid: false })

  useEffect(() => {
    checkValidityForm(isLoginFormValid);
  }, [isLoginFormValid, checkValidityForm]);


  function validateEmailAndPassword(username: string, password: string, nameOfInput: string) {
    if (nameOfInput === "username") {
      if (username.length === 0) {
        setLoginValidationText(prevVal => ({ ...prevVal, emailText: "Email cannot be empty" }));
        setIsLoginFormValid(prevVal => ({ ...prevVal, isUsernameValid: false }));
      } else {
        if (isEmailRegexValidation(username)) {
          setIsEmailValid(true);
          setIsLoginFormValid(prevVal => ({ ...prevVal, isUsernameValid: true }));
          setLoginValidationText(prevVal => ({ ...prevVal, emailText: "Email is entered" }));
        } else {
          setIsEmailValid(false);
          setIsLoginFormValid(prevVal => ({ ...prevVal, isUsernameValid: false }));
          setLoginValidationText(prevVal => ({ ...prevVal, emailText: "Invalid e-mail format" }));
        }

      }
    } else if (nameOfInput === "password") {
      if (password.length === 0) {
        console.log("Set login form to FALSE");
        setIsLoginFormValid(prevVal => ({ ...prevVal, isPwdValid: false }));
        setIsPwdValid(false);
        setLoginValidationText(prevVal => ({ ...prevVal, pwdText: "Password cannot be empty" }));
      } else {
        setIsPwdValid(true);
        setIsLoginFormValid(prevVal => ({ ...prevVal, isPwdValid: true }));
        setLoginValidationText(prevVal => ({ ...prevVal, pwdText: "Ok" }));
      }
    }

    checkValidityForm(isLoginFormValid);
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    const { name, value } = event.target;

    validateEmailAndPassword(
      name === 'username' ? value : loginCredentials.username,
      name === 'password' ? value : loginCredentials.password,
      name
    );

  };



  return (
    <div>
      <p>
        <label htmlFor="username">Email</label>
        <input onChange={handleChange} value={loginCredentials.username} type="email" name="username" id="username" ref={usernameRef} />
        <ValidationLabel reference={"username"} isMatching={isEmailValid} errorMessage={loginValidationText.emailText} />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input onChange={handleChange} value={loginCredentials.password} type="password" name="password" id="password" ref={passwordRef} /><ValidationLabel reference={"password"} isMatching={isPwdValid} errorMessage={loginValidationText.pwdText} />
      </p>
    </div>
  )
}