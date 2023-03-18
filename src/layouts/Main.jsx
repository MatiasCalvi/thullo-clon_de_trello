import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { useHref } from "react-router-dom";

export default function Main(props) {
  const href = useHref();

  return href === "" ? null : (
    <>
      <Navbar />
      <div className="Main">{props.children}</div>
    </>
  );
}