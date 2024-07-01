import { PropsWithChildren } from "react"

type ValidationLabelProps = {
  reference: string;
  isMatching: boolean;
  errorMessage: string;
  alignmentText?: 'left' | 'center' | 'right';
  darkMode?: boolean;
}

export default function ValidationLabel({ reference, isMatching, errorMessage, alignmentText, darkMode }: PropsWithChildren<ValidationLabelProps>) {

  return (
    <label htmlFor={reference} className="validationLabel" style={{ color: isMatching ? "#00B602" : "crimson", textAlign: alignmentText, backgroundColor: darkMode ? "#3A4346" : "transparent", padding: darkMode ? "0rem" : "0rem" }}>{errorMessage}</label>
  )
}