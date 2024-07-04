import { type UserData } from "./WelcomePage/OnboardingComponent"
import Navbar from "./Navbar";
import profilePicture from "./assets/profile_picture.jpg";
import editPicture from "./assets/edit-image.svg";
import { ChangeEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import ValidationLabel from "./Validation/ValidationLabel";
import { isPhoneNumberRegexValidation } from "./utils/data-utils";
import Reservation from "./Reservation";
import "./Profile.css";
import UserHeader from "./ProfilePage/UserDetailComponent/UserHeader";
import UpdateInfo from "./ProfilePage/UserDetailComponent/UpdateInfo";
import { format, parse } from "date-fns";

interface ProfileProps {
  userData?: UserData;
  navigate: (path: string) => void;
}

export default function Profile({ userData, navigate }: ProfileProps) {

  const [isEdited, setIsEdited] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [phoneValidationText, setPhoneValidationText] = useState("");


  const [isBirthdateValid, setIsBirthdateValid] = useState(false);
  const formattedDate = format(parse(userData?.birthdate || "", 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd');
  const [birthdate, setBirthdate] = useState(formattedDate);

  const [test, setTest] = useState({ isBirthdateFromChildValid: false });

  const [userDataState, setUserDataState] = useState<UserData | undefined>(userData);
  const [editUser, setEditUser] = useState({ name: userDataState?.name, surname: userDataState?.surname, phone: userDataState?.phone, birthdate: userDataState?.birthdate });


  /*
    useEffect(() => {
      checkDateValue(birthdate);
      checkPhoneValue(editUser?.phone || "");
    }, [isBirthdateValid, isPhoneValid, checkDateValue, checkPhoneValue]);
  
  */



  /*
    const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      //checkDateValue(value);
      setBirthdate(value);
    };
  */

  function editBtnClick(event: React.MouseEvent<HTMLButtonElement>) {
    toggleEdit();
  }

  function toggleEdit() {
    setIsEdited(() => !isEdited);
  }

  function resetEditUserNameInputs() {
    setEditUser(() => ({ name: userDataState?.name, surname: userDataState?.surname, phone: userDataState?.phone, birthdate: userDataState?.birthdate }));
  }



  function cancelEditUserInfoHandler(event: React.MouseEvent<HTMLButtonElement>) {
    toggleEdit();
    resetEditUserNameInputs();
  }


  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    setEditUser((prevValue) => ({ ...prevValue, [name]: value }));
    console.log(value, name);
  }


  const handleDataFromChild = (isBirthdateValid: boolean) => {
    setTest((prevValue) => ({ ...prevValue, isBirthdateFromChildValid: isBirthdateValid }));
    console.log(isBirthdateValid);
    setIsBirthdateValid(isBirthdateValid);
    console.log(test);
  };



  async function saveEditedUserInfoHandler(event: React.MouseEvent<HTMLButtonElement>) {
    //await checkDateValue(formattedDate);

    if (isBirthdateValid) {
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
        console.log()
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



  return (
    <div>
      <Navbar navigate={navigate} />
      <div className="profile-component">
        <div className="user">
          <div id="user-detail" className="">
            <UserHeader editBtnClick={editBtnClick} isEdited={isEdited} />

            <div className="profile-picture-container gap-5">
              <img id="user-profile-picture" src={profilePicture} alt="profile-picture" />
              {
                isEdited ?
                  <UpdateInfo sendValidityResult={handleDataFromChild} navigate={navigate} userData={userData} />
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
