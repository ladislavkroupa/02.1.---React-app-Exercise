import { type UserData } from "./WelcomePage/OnboardingComponent"
import Navbar from "./Navbar";
import profilePicture from "./assets/profile_picture.jpg";
import editPicture from "./assets/edit-image.svg";
import { ChangeEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import ValidationLabel from "./Validation/ValidationLabel";
import { isPhoneNumberRegexValidation } from "./utils/data-utils";
import { format, parse } from "date-fns";
import Reservation from "./Reservation";
import "./Profile.css";

interface ProfileProps {
  userData?: UserData;
  navigate: (path: string) => void;
}

export default function Profile({ userData, navigate }: ProfileProps) {

  const [isEdited, setIsEdited] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [phoneValidationText, setPhoneValidationText] = useState("");

  const [isBirthdateValid, setIsBirthdateValid] = useState(false);
  const [birthdateValidationText, setBirthdateValidationText] = useState("");


  const [userDataState, setUserDataState] = useState<UserData | undefined>(userData);
  const [editUser, setEditUser] = useState({ name: userDataState?.name, surname: userDataState?.surname, phone: userDataState?.phone, birthdate: userDataState?.birthdate });

  const formattedDate = format(parse(userData?.birthdate || "", 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd');
  const [birthdate, setBirthdate] = useState(formattedDate);

  useEffect(() => {
    checkDateValue(birthdate);
    checkPhoneValue(editUser?.phone || "");
  }, [isBirthdateValid, isPhoneValid, checkDateValue, checkPhoneValue]);

  async function checkDateValue(birthdate: string) {

    const today = new Date();
    const enteredDate = new Date(birthdate);

    const enteredDateYear = enteredDate.getFullYear()
    const enteredDateMonth = enteredDate.getMonth();
    const enteredDateDay = enteredDate.getDate();


    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    if (enteredDateYear >= 1900 && enteredDateYear <= currentYear) {

      if (enteredDateYear === currentYear) {
        if (enteredDateMonth <= currentMonth) {
          if (enteredDateDay <= currentDay || (enteredDateMonth < currentMonth)) {
            console.log(enteredDateMonth);
            console.log(currentMonth);
            setIsBirthdateValid(true);
            setBirthdateValidationText("");
          } else {
            setIsBirthdateValid(false);
            setBirthdateValidationText(`The day must be smaller than the current day - ${currentDay}`);
          }
        } else {
          setIsBirthdateValid(false);
          setBirthdateValidationText(`The month must be smaller than the current month - ${currentMonth}`);
        }
      } else {
        setIsBirthdateValid(true);
        setBirthdateValidationText("");
      }
    } else {
      setIsBirthdateValid(false);
      setBirthdateValidationText(`The year must be between 1900 and ${currentYear}.`);
    }
  }

  async function checkPhoneValue(phone: string) {
    if (isPhoneNumberRegexValidation(phone)) {
      setIsPhoneValid(() => true);
    }
  }

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    checkDateValue(value);
    setBirthdate(value);
  };

  function editBtnClick(event: React.MouseEvent<HTMLButtonElement>) {
    toggleEdit();
  }

  function toggleEdit() {
    setIsEdited(() => !isEdited);
  }

  function resetEditUserNameInputs() {
    setEditUser(() => ({ name: userDataState?.name, surname: userDataState?.surname, phone: userDataState?.phone, birthdate: userDataState?.birthdate }));
  }

  async function saveEditedUserInfoHandler(event: React.MouseEvent<HTMLButtonElement>) {

    await checkDateValue(formattedDate);
    await checkPhoneValue(userDataState?.phone || "");

    if (isPhoneValid && isBirthdateValid) {
      try {
        const response = await axios.put(`http://localhost:3000/edit-user-info/${userData?.id}`, { name: editUser?.name, surname: editUser?.surname, phone: editUser?.phone, birthdate: birthdate },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true,
          })
        setUserDataState((prevValue) => ({
          ...prevValue,
          name: response.data.name,
          surname: response.data.surname,
          phone: response.data.phone,
          birthdate: response.data.birthdate,
          age: response.data.age
        } as UserData)); // Type assertion to ensure compatibility
        toggleEdit();
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response) {
            console.log("User is not authenticated");
            navigate("/");
          } else {
            console.error("An error occurred:", error);
          }
        } else {
          console.error("Neznámá chyba:", error);
        }
      }

    } else {
      setPhoneValidationText("Please enter a valid phone number. The format should be: +CountryCode 123 456 789 (e.g., +420123456789).");
    }


  }

  function cancelEditUserInfoHandler(event: React.MouseEvent<HTMLButtonElement>) {
    toggleEdit();
    resetEditUserNameInputs();
  }


  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name !== "phone") {
      checkPhoneValue(value);
      setEditUser((prevValue) => ({ ...prevValue, [name]: value }));
    } else {
      setEditUser((prevValue) => ({ ...prevValue, phone: value }));
      if (isPhoneNumberRegexValidation(value)) {
        setIsPhoneValid(true);
        setPhoneValidationText("Phone's fine.");
      } else {
        setIsPhoneValid(false);
        setPhoneValidationText("Phone has the wrong format.");
      }
    }
  }


  return (
    <div>
      <Navbar navigate={navigate} />
      <div className="profile-component">
        <div className="user">
          <div id="user-detail" className="">
            <div className="headline-control-container">
              <h2>Profile</h2>
              <span style={{ display: isEdited ? "none" : "block" }}><button className="" onClick={editBtnClick}><img src={editPicture} alt="" className="edit-pen-img" /></button></span>
            </div>
            <div className="profile-picture-container gap-5">
              <img id="user-profile-picture" src={profilePicture} alt="profile-picture" />
              {
                isEdited ?
                  <div className="container-update-info">
                    Jméno: <input className="input-update-info" type="text" name="name" id="name" value={editUser?.name} onChange={handleOnChange} />
                    Příjmení: <input className="input-update-info" type="text" name="surname" id="surname" value={editUser?.surname} onChange={handleOnChange} />
                    Datum narození:
                    <div>
                      <input className="input-update-info" type="date" name="age" id="age" value={birthdate} onChange={handleChangeDate} />
                      <ValidationLabel reference={""} isMatching={isBirthdateValid} errorMessage={birthdateValidationText} />
                    </div>

                  </div>
                  :
                  <div className="font-sans profile-name-detail">
                    <div>
                      Jméno: <strong>{userDataState?.name}</strong> <br />
                      Příjmení: <strong><span>{userDataState?.surname}</span></strong>
                    </div>
                    <div>Věk: <strong>{userDataState?.age}</strong></div>
                    <div>Datum narození: <strong>{birthdate}</strong></div>
                  </div>

              }

            </div>
            <div className="mt-5">
              <div>
                <span style={{ borderBottom: "1px solid black", fontSize: "0.98rem" }} className="text-bold">Username:</span> <br />
                <span className="my-4"><strong>{userData?.email}</strong></span>
              </div>

              <div className="mt-2">
                <span style={{ borderBottom: "1px solid black", fontSize: "0.98rem" }} className="text-bold">Phone:</span> <br></br>
                {isEdited ?
                  <div>
                    <input className="input-update-info mt-2" type="text" name="phone" id="phone" value={editUser?.phone} onChange={handleOnChange} /> <ValidationLabel reference={""} isMatching={isPhoneValid} errorMessage={phoneValidationText} />
                  </div>
                  :
                  <span> <strong>{userDataState?.phone}</strong></span>}
              </div>

              <div style={{ display: isEdited ? "flex" : "none" }} className="update-user-info-control-buttons mt-3">
                <button type="button" id="update-user-info-button" className="btn" onClick={saveEditedUserInfoHandler}>✅ Uložit</button>
                <button type="button" id="cancel-update-info" className="btn" onClick={cancelEditUserInfoHandler}>❌ Zrušit</button>
              </div>

            </div>

            <div className="mt-3">
            </div>
          </div>

          <div className="reservations-wrapper">
            <h1>My Reservations</h1>
            <div className="container my-reservations">
              <Reservation date="24.10." time="13:00" />
              <Reservation date="25.10." time="12:00" />
              <Reservation date="26.10." time="11:00" />
              <Reservation date="27.10." time="08:00" />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
