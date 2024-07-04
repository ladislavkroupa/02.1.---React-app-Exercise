import { ChangeEvent, useEffect, useState } from "react";
import ValidationLabel from "../../Validation/ValidationLabel";
import { UserData } from "../../WelcomePage/OnboardingComponent";
import { format, parse } from "date-fns";
import { isPhoneNumberRegexValidation } from "../../utils/data-utils";


type UpdateInfoProps = {
  userData?: UserData;
  navigate: (path: string) => void;
  sendValidityResult: (isBirthdateValid: boolean) => void;
}


export default function UpdateInfo({ userData, sendValidityResult }: UpdateInfoProps) {

  const [tmpUserData, setTmpUserData] = useState({ name: userData?.name, surname: userData?.surname, phone: userData?.phone, birthdate: userData?.birthdate });

  const [isBirthdateValid, setIsBirthdateValid] = useState(false);

  const formattedDate = format(parse(userData?.birthdate || "", 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd');
  const [birthdate, setBirthdate] = useState(formattedDate);
  const [birthdateValidationText, setBirthdateValidationText] = useState("");



  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [phoneValidationText, setPhoneValidationText] = useState("");

  async function checkPhoneValue(phone: string) {
    if (isPhoneNumberRegexValidation(phone)) {
      setIsPhoneValid(() => true);
    }
  }


  const changeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    //handleChangeDate(event);
    checkDateValue(value);
    setBirthdate(value);
    sendValidityResult(isBirthdateValid);
  };


  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTmpUserData((prevValue) => ({ ...prevValue, [name]: value }));

    console.log(value);
    if (name !== "phone") {
      checkPhoneValue(value);
      setTmpUserData((prevValue) => ({ ...prevValue, [name]: value }));

    } else {
      setTmpUserData((prevValue) => ({ ...prevValue, phone: value }));
      if (isPhoneNumberRegexValidation(value)) {
        setIsPhoneValid(true);
        setPhoneValidationText("Phone's fine.");
      } else {
        setIsPhoneValid(false);
        setPhoneValidationText("Phone has the wrong format.");
      }
    }
  }

  function checkDateValue(birthdate: string) {

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
            setIsBirthdateValid(true);
            console.log(isBirthdateValid);
            setBirthdateValidationText("");
          } else {
            setIsBirthdateValid(false);
            console.log(isBirthdateValid);
            setBirthdateValidationText(`The day must be smaller than the current day - ${currentDay}`);
          }
        } else {
          setIsBirthdateValid(false);
          console.log(isBirthdateValid);
          setBirthdateValidationText(`The month must be smaller than the current month - ${currentMonth}`);
        }
      } else {
        setIsBirthdateValid(true);
        console.log(isBirthdateValid);
        setBirthdateValidationText("");
      }
    } else {
      setIsBirthdateValid(false);
      console.log(isBirthdateValid);
      setBirthdateValidationText(`The year must be between 1900 and ${currentYear}.`);
    }
  }

  return (
    <div className="container-update-info">
      Jméno: <input className="input-update-info" type="text" name="name" id="name" value={tmpUserData?.name} onChange={handleOnChange} />
      Příjmení: <input className="input-update-info" type="text" name="surname" id="surname" value={tmpUserData?.surname} onChange={handleOnChange} />
      Datum narození:
      <div>
        <input className="input-update-info" type="date" name="age" id="age" value={birthdate} onChange={changeDate} />
        <ValidationLabel reference={""} isMatching={isBirthdateValid} errorMessage={birthdateValidationText} />
      </div>

    </div>
  )
}
