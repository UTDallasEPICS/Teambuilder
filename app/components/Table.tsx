import React  from "react";
import "./table.css"

import {BsFillTrashFill, BsFillPencilFill} from "react-icons/bs";

export const Table = () => {
    return <div className=" m-0 pl-7 pt-2  bg-[rgba(48,100,162,0.29)] w-full"> 
        <table style={{display: 'block', overflow: 'hidden', tableLayout: 'auto', borderCollapse: 'collapse', borderRadius: '10px', whiteSpace: 'nowrap', maxWidth: '100%', margin: 'auto', overflowX: 'auto' }}>
            <thead style={{backgroundColor: '#ccc', color: '#222'}}>
                <tr>
                    <th>Project Number</th>
                    <th className="expand">Description</th>
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