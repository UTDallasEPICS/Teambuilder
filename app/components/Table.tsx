import React  from "react";

import {BsFillTrashFill, BsFillPencilFill} from "react-icons/bs";

export const Table = () => {
    return <div className=" m-0 pl-7 pt-2  bg-[rgba(48,100,162,0.29)] w-full">
        <table style={{display: 'block', }}>
            <thead>
                <tr>
                    <th>Project Number</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Project 1</td>
                    <td>This is the first project</td>
                    <td>
                        <span>Complete</span>
                    </td>
                    <td>
                        <span>
                            <BsFillTrashFill />
                            <BsFillPencilFill />
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Project 2</td>
                    <td>This is the second project</td>
                    <td>
                        <span>Incomplete</span>
                    </td>
                    <td>
                        <span>
                            <BsFillTrashFill />
                            <BsFillPencilFill />
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Project 3</td>
                    <td>This is the third project</td>
                    <td>
                        <span>Incomplete</span>
                    </td>
                    <td>
                        <span>
                            <BsFillTrashFill />
                            <BsFillPencilFill />
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>;
};