import React  from "react";
import "./table.css"

import {BsFillTrashFill, BsFillPencilFill} from "react-icons/bs";

export const Table = () => {
    return <div style={{borderRadius: '10px'}} className=" m-0  bg-[rgba(48,100,162,0.29)] w-full "> 
        <table className="table" style={{padding: '10px', marginLeft: '15px', marginRight: '10px', display: 'block', overflow: 'hidden', tableLayout: 'auto', borderCollapse: 'collapse', whiteSpace: 'nowrap', maxWidth: '100%', margin: 'auto', overflowX: 'auto' }}>
            <thead style={{backgroundColor: 'rgb(136, 120, 120)', color: 'white', borderRadius: '10px'}}>
                <tr>
                    <th>Project ID</th>
                    <th className="expand">Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Project 1</td>
                    <td>This is the first project</td>
                    <td>
                        <span className="label label-complete">Complete</span>
                    </td>
                    <td>
                        <span className="actions">
                            <BsFillTrashFill className="delete-btn"/>
                            <BsFillPencilFill />
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Project 2</td>
                    <td>This is the second project</td>
                    <td>
                        <span className="label label-incomplete">Incomplete</span>
                    </td>
                    <td>
                        <span className="actions">
                            <BsFillTrashFill className="delete-btn"/>
                            <BsFillPencilFill />
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Project 3</td>
                    <td>This is the third project</td>
                    <td>
                        <span className="label label-incomplete">Incomplete</span>
                    </td>
                    <td>
                        <span className="actions">
                            <BsFillTrashFill className="delete-btn"/>
                            <BsFillPencilFill />
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>;
};