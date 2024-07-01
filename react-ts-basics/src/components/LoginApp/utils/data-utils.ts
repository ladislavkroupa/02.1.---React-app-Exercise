import { type UserData } from "../WelcomePage/OnboardingComponent";

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  checkedUser?: UserData;
}

export const getData = async <T>(
  url: string,
  email: string,
  password: string
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await res.json();

    let checkedUser: UserData | undefined;

    if (responseData.checkedUser) {
      // Pokud je checkedUser řetězec, převeď ho na objekt UserData
      if (typeof responseData.checkedUser === "string") {
        checkedUser = JSON.parse(responseData.checkedUser);
      } else {
        checkedUser = responseData.checkedUser;
      }
    }

    return {
      statusCode: res.status,
      data: responseData,
      message: responseData.message,
      checkedUser: checkedUser,
    };
  } catch (error) {
    console.error("Chyba při získávání dat:", error);
    throw error;
  }
};

export function isEmailRegexValidation(val: string) {
  let regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regEmail.test(val)) {
    return false;
  } else {
    console.log("email si valid " + val);
    return true;
  }
}

export function isPhoneNumberRegexValidation(val: string) {
  let regPhoneNumber =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  // Testování zadaného řetězce pomocí regulárního výrazu
  if (!regPhoneNumber.test(val)) {
    return false; // Neplatné telefonní číslo
  } else {
    console.log("phone si valid " + val);
    return true; // Platné telefonní číslo
  }
}
