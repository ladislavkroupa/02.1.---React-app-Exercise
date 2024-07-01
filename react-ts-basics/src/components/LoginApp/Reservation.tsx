import { useState, useEffect } from "react";
import { Flip, ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import profileImg from "../assets/lk_dev_logo.png";

import "./Reservation.css";


type ReservationProps = {
  date: string;
  time: string;
}

export default function Reservation({ date, time }: ReservationProps) {

  const handleClickDetail = () => {
  }

  return (
    <div className="reservation" onClick={handleClickDetail}>
      <div className="flex flex-col">
        <span> <strong>{date}</strong></span>
        <span>{time}</span>
      </div>
    </div>

  )
}
