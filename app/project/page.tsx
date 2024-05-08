"use client";

import styles from "./page.module.css";
import Head from "next/head";
import "../globals.css";
import Navbar from "../components/Navbar";
import ProjectCardDisplay from "../components/ProjectCardDisplay";
import { useState } from "react";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal";
import Display from "../display/page";

export default function Project() {
  const [modalOpen, setModalOpen] = useState(false);  //set state of Modal to be closed

  const [rows, setRows] = useState([]); //set state of Rows of Projects to be empty

  const [rowToEdit, setRowToEdit] = useState(null); //set state of editing a project to null as you aren't editing a project

  const handleDeleteRow = (targetIndex) => {
    setRows(rows.filter((_, idx) => idx !== targetIndex));  //filters throw the Projects to find the Project to delete based on index
  };

  //handles project editing and opens Modal
  const handleEditRow = (idx) => {  
    setRowToEdit(idx);  

    setModalOpen(true);
  };

  const handleSubmit = (newRow) => {
    if (rowToEdit === null) {
      setRows([...rows, newRow]); // Add a new row
    } else {
      // Update the specific row
      setRows(
        rows.map((currRow, idx) => (idx === rowToEdit ? newRow : currRow))
      );
    }
    // Reset rowToEdit state after submission
    setRowToEdit(null);
  };

  return (
    <div>
      <br></br>
      <div style={{ minHeight: "780px", borderRadius: "24px" }} className="h-screen border-solid rounded-t-3xl box-border m-10 bg-[rgba(90,91,88,0.49)] pl-4 pt-7 ">
        <div className="box-border border-solid rounded-3xl min-h-28 mt-1 mr-9 ml-5 mb-3 bg-[rgba(48,100,162,0.29)]  flex flex-col">
          <h1 className="ml-4 mt-3 text-xl">Instruction</h1>
          <h2 className="ml-4 mt-2 mr-3">
            Upload your project information here. Be sure to enter project name,
            project partner, target # of CS majors, and whether it is an archived project.
            Once you are ready, click Submit.
          </h2>
        </div>
        <br></br>
        <div style={{ marginLeft: "0px" }} className="flex">
          <div className="flex-col">
            <h1 style={{ fontSize: "30px" }} className=" ml-8 mt-3 ">
              Projects
            </h1>

            <Table
              rows={rows}
              deleteRow={handleDeleteRow}
              editRow={handleEditRow}
            />

            <button style={{ display: "block", margin: "auto", marginTop: "1rem", border: "none", backgroundColor: "aqua", color: "white", padding: "0.5rem 1rem", borderRadius: "10px", cursor: "pointer", boxShadow: "0px 5px 5px #ccc",
              }} //opens Modal when clicked
              onClick={() => setModalOpen(true)}  > 
              Add
            </button>
          </div>

          <div className="flex-col">
            <h1 style={{ fontSize: "30px" }} className=" ml-16 mt-3 ">
              Edit Project
            </h1>
            <div
              style={{
                marginLeft: "50px",
                width: "475px",
                minHeight: "300px",
                marginRight: "25px",
              }} className="customMargin box-border border-solid rounded-3xl  bg-[rgba(48,100,162,0.29)]  flex flex-col">
              {modalOpen && (
                <Modal  //closes Modal
                  closeModal={() => { 
                    setModalOpen(false);
                    setRowToEdit(null);
                  }}
                  onSubmit={handleSubmit} //handles submission
                  defaultValue={rowToEdit !== null && rows[rowToEdit]}  //checks if a Project should be edited
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
