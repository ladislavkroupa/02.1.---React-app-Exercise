export interface UserDataDictionary {
  [key: string]: string;
}

export const userDataTextValidationDict: UserDataDictionary = {
  name: "nameText",
  surname: "surnameText",
  age: "ageText",
  phone: "phoneText",
};

export const userDataMatchingValidationDict: UserDataDictionary = {
  username: "isUsernameValid",
  password: "isPwdValid",
  name: "isNameValid",
  surname: "isSurnameValid",
  age: "isAgeValid",
  phone: "isPhoneValid",
  usernameConf: "isUsernameConfValid",
  passwordConf: "isPwdConfValid",
};
