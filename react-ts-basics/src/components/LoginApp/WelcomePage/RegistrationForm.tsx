import { ChangeEvent, useEffect, useState } from "react";
import ValidationLabel from "../Validation/ValidationLabel.tsx"
import { isEmailRegexValidation, isPhoneNumberRegexValidation } from "../utils/data-utils.ts"
import { userDataTextValidationDict, userDataMatchingValidationDict } from "../utils/dictionaries.ts";


type RegistrationFormProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;

  registrationCredentials: {
    username: string,
    usernameConf: string,
    password: string,
    passwordConf: string
  };
  usernameRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;

  usernameConfRef: React.RefObject<HTMLInputElement>;
  passwordConfRef: React.RefObject<HTMLInputElement>;

  nameRef: React.RefObject<HTMLInputElement>;
  surnameRef: React.RefObject<HTMLInputElement>;
  ageRef: React.RefObject<HTMLInputElement>;
  phoneRef: React.RefObject<HTMLInputElement>;

  checkValidityForm: (validity: { isUsernameValid: boolean, isUsernameConfValid: boolean, isPwdValid: boolean, isPwdConfValid: boolean, isNameValid: boolean, isSurnameValid: boolean, isAgeValid: boolean, isPhoneValid: boolean }) => void;
}

export type UserDataOnboarding = {
  name: string;
  surname: string;
  age: string;
  phone: string;
}

export default function RegistrationForm({ onChange, registrationCredentials, usernameRef, passwordRef, usernameConfRef, passwordConfRef, nameRef, surnameRef, phoneRef, ageRef, checkValidityForm }: RegistrationFormProps) {


  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPwdValid, setIsPwdValid] = useState(false);
  const [isUsernameConfValid, setIsUsernameConfValid] = useState(false);
  const [isConfPwdValid, setIsPwdConfValid] = useState(false);
  const [userDetilMatching, setUserDetailMatching] = useState({ isNameValid: false, isSurnameValid: false, isAgeValid: true, isPhoneValid: false });
  const [userDetailValidationText, setUserDetailValidationText] = useState({ nameText: "", surnameText: "", ageText: "", phoneText: "" });
  const [registerValidationText, setRegisterValidationText] = useState({ usernameText: "", confUsernameText: "", pwdText: "", confPwdText: "" });
  const [userDataOnboarding, setUserDataOnboarding] = useState<UserDataOnboarding>({ name: "", surname: "", age: "", phone: "" });

  const userDataArray = ["name", "surname", "age", "phone"];

  const [isRegistrationFormValid, setIsRegistrationFormValid] = useState({ isUsernameValid: false, isUsernameConfValid: false, isPwdConfValid: false, isPwdValid: false, isNameValid: false, isSurnameValid: false, isAgeValid: true, isPhoneValid: false })

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDataOnboarding(prevValue => ({ ...prevValue, [name]: value }));
    console.log(userDataOnboarding.age);
    console.log(name, value);

  };


  useEffect(() => {
    checkValidityForm(isRegistrationFormValid);
  }, [isRegistrationFormValid, checkValidityForm]);

  function setValueUserDetail(name: string, value: string) {

    setUserDataOnboarding((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
    })
  }

  function setUserDetailValidation(name: string, value: string) {
    setUserDetailValidationText((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
    })
  }

  function setUserDetailMatchingValidation(name: string, value: boolean) {
    setUserDetailMatching((prevVal) => {
      return {
        ...prevVal,
        [name]: value
      }
    })
  }

  function setValidityFormIsRegistrationFormValid(name: string, value: boolean) {
    setIsRegistrationFormValid((prevVal) => {
      return {
        ...prevVal,
        [name]: value
      }
    })
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    const { name, value } = event.target;


    if (userDataArray.includes(name) && name !== "phone") {

      if (value.length !== 0) {
        setValueUserDetail(name, value);
        setUserDetailValidation(userDataTextValidationDict[name], "Entered");
        setUserDetailMatchingValidation(userDataMatchingValidationDict[name], true);
        setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[name], true);

      } else {
        setValueUserDetail(name, value);
        setUserDetailValidation(userDataTextValidationDict[name], "Cannot be empty");
        setUserDetailMatchingValidation(userDataMatchingValidationDict[name], false);
        setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[name], false);
      }


    } else {
      if (isPhoneNumberRegexValidation(value)) {
        setValueUserDetail(name, value);
        setUserDetailValidation(userDataTextValidationDict[name], "Phone is valid");
        setUserDetailMatchingValidation(userDataMatchingValidationDict[name], true);
        setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[name], true);
      } else {
        setValueUserDetail(name, value);
        setUserDetailValidation(userDataTextValidationDict[name], "Phone is not valid");
        setUserDetailMatchingValidation(userDataMatchingValidationDict[name], false);
        setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[name], false);

      }
    }

    validateRegistrationForm(
      name === "username" ? value : registrationCredentials.username,
      name === "usernameConf" ? value : registrationCredentials.usernameConf,
      name === "password" ? value : registrationCredentials.password,
      name === "passwordConf" ? value : registrationCredentials.passwordConf,
      name
    );

    checkValidityForm(isRegistrationFormValid);

  }

  function validateRegistrationForm(username: string, usernameConf: string, password: string, passwordConf: string, nameOfInput: string) {

    switch (nameOfInput) {
      case "username":

        if (username.length === 0) {
          setRegisterValidationText((prevValue) => {
            return {
              ...prevValue,
              usernameText: "Email cannot be empty"
            }
          });
          setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], false);
        } else {
          if (isEmailRegexValidation(username)) {
            setIsUsernameValid(true);
            setRegisterValidationText((prevValue) => {
              return {
                ...prevValue,
                usernameText: "Email is entered"
              }
            });

            setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], true);
          } else {
            setIsUsernameValid(false);
            setRegisterValidationText((prevValue) => {
              return {
                ...prevValue,
                usernameText: "Invalid e-mail format"
              }
            });
          }
        }
        break;

      case "password":
        if (password.length === 0) {
          setIsPwdValid(false);
          setRegisterValidationText((prevValue) => {
            return {
              ...prevValue,
              pwdText: "Password cannot be empty"
            }
          });
          setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], false);
        } else {
          setIsPwdValid(true);
          setRegisterValidationText((prevValue) => {
            return {
              ...prevValue,
              pwdText: "Ok"
            }
          })
          setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], true);
        }
        break;

      case "usernameConf":
        if (username !== usernameConf) {
          setRegisterValidationText((prevValue) => {
            setIsUsernameConfValid(false);
            return {
              ...prevValue,
              confUsernameText: "Email is not matching"
            }
          });
          setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], false);
        } else {
          setRegisterValidationText((prevValue) => {
            setIsUsernameConfValid(true);
            return {
              ...prevValue,
              confUsernameText: "Email is matching"
            }
          });
          setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], true);
        }
        break;

      case "passwordConf":
        if (password !== passwordConf) {
          setRegisterValidationText((prevValue) => {
            setIsPwdConfValid(false);
            return {
              ...prevValue,
              confPwdText: "Password is not matching"
            }
          });
          setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], false);
        } else if (passwordConf.length < 1) {
          setIsPwdConfValid(false);
          setRegisterValidationText((prevValue) => {
            return {
              ...prevValue,
              confPwdText: "Password cannot be empty"
            }
          });
          setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], false);

        } else {
          setRegisterValidationText((prevValue) => {
            setIsPwdConfValid(true);
            return {
              ...prevValue,
              confPwdText: "Password is matching"
            }
          });
          setValidityFormIsRegistrationFormValid(userDataMatchingValidationDict[nameOfInput], true);
        }
        break;

      default:
        break;

    }

    checkValidityForm(isRegistrationFormValid);


  }




  return (
    <div>
      <div className="registration-container">
        <div className="user-credentials">
          <p>
            <label htmlFor="username">Email</label>
            <input onChange={handleChange} value={registrationCredentials.username} type="email" name="username" id="username" ref={usernameRef} />
            <ValidationLabel reference={"username"} isMatching={isUsernameValid} errorMessage={registerValidationText.usernameText} />
          </p>

          <p>
            <label htmlFor="usernameConf">Confirm your email</label>
            <input onChange={handleChange} value={registrationCredentials.usernameConf} type="email" name="usernameConf" id="usernameConf" ref={usernameConfRef} />
            <ValidationLabel reference={"confEmail"} isMatching={isUsernameConfValid} errorMessage={registerValidationText.confUsernameText} />
          </p>

          <p>
            <label htmlFor="password">Password</label>
            <input onChange={handleChange} value={registrationCredentials.password} type="password" name="password" id="password" ref={passwordRef} />
            <ValidationLabel reference={"password"} isMatching={isPwdValid} errorMessage={registerValidationText.pwdText} />
          </p>

          <p>
            <label htmlFor="passwordConf">Confirm your password</label>
            <input onChange={handleChange} value={registrationCredentials.passwordConf} type="password" name="passwordConf" id="passwordConf" ref={passwordConfRef} />
            <ValidationLabel reference={"passwordConf"} isMatching={isConfPwdValid} errorMessage={registerValidationText.confPwdText} />
          </p>
        </div>
        <div className="user-info">
          <p>
            <label htmlFor="name">Name</label>
            <input onChange={handleChange} value={userDataOnboarding.name} type="name" name="name" id="name" ref={nameRef} />
            <ValidationLabel reference={"name"} isMatching={userDetilMatching.isNameValid} errorMessage={userDetailValidationText.nameText} />
          </p>
          <p>
            <label htmlFor="surname">Surname</label>
            <input onChange={handleChange} value={userDataOnboarding.surname} type="name" name="surname" id="surname" ref={surnameRef} />
            <ValidationLabel reference={"surname"} isMatching={userDetilMatching.isSurnameValid} errorMessage={userDetailValidationText.surnameText} />
          </p>
          <p>
            <label htmlFor="birthdate">Age</label>
            <input type="date" name="age" id="age" value={userDataOnboarding.age} onChange={handleDateChange} ref={ageRef} />
            <ValidationLabel reference={"age"} isMatching={userDetilMatching.isAgeValid} errorMessage={userDetailValidationText.ageText} />
          </p>
          <p>
            <label htmlFor="phone">Phone</label>
            <input onChange={handleChange} value={userDataOnboarding.phone} type="text" name="phone" id="phone" ref={phoneRef} />
            <ValidationLabel reference={"phone"} isMatching={userDetilMatching.isPhoneValid} errorMessage={userDetailValidationText.phoneText} />
          </p>
          <p></p>
        </div>
      </div>
    </div>
  )
}