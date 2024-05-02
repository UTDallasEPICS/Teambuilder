import React  from "react";
import "./table.css"

import {BsFillTrashFill, BsFillPencilFill} from "react-icons/bs";

export const Table = ({ rows, deleteRow, editRow }) => {
    return <div style={{borderRadius: '10px'}} className=" m-0  bg-[rgba(48,100,162,0.29)] w-full "> 
        <table className="table" style={{padding: '10px', marginLeft: '15px', marginRight: '10px', display: 'block', overflow: 'hidden', tableLayout: 'auto', borderCollapse: 'collapse', whiteSpace: 'nowrap', maxWidth: '100%', margin: 'auto', overflowX: 'auto' }}>
            <thead style={{backgroundColor: 'rgb(136, 120, 120)', color: 'white', borderRadius: '10px'}}>
                <tr>
                    <th>Project Name</th>
                    <th className="expand">Project Partner</th>
                    <th>CS Target #</th>
                    <th>Archived</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {console.log("Is rows an array?", Array.isArray(rows))}
                {
                    rows.map((row, idx) => {
                        const statusText = 
                            row.archive.charAt(0).toUpperCase() + row.archive.slice(1);

                        return (<tr key={idx}>
                            <td>{row.Project_name}</td>
                            <td className="expand">{row.Project_partner}</td>
                            <td>{row.CS_target_number}</td>
                            <td>
                                <span className={`label label-${row.archive}`}>{row.archive}</span>
                            </td>
                            <td>
                                <span className="actions">
                                    <BsFillTrashFill className="delete-btn" onClick={() => deleteRow(idx)}/>
                                    <BsFillPencilFill onClick={() => editRow(idx)}/>
                                </span>
                            </td>
                        </tr>
                        );
                    })
                }
            </tbody>
        </table>
    </div>;
};