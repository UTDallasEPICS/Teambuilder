import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-blue-700 bg-opacity-40 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            
            <div className="flex">
              <img className='object-left-top object-contain h-20 w-64' src="logo1.png" alt="EPICS Logo" width="50"/>
              <div>
                <img className='object-left npobject-contain  h-20 w-64' src="team-formation-text.png" alt="Team Formation Logo" width="100"/>
              </div>
            </div>

            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/sign-in">
                  <p>Sign In</p>
                </Link>
              </li>
              <li>
                <Link href="/project">
                    <p>Project</p>
                </Link>
                
              </li>
              <li>
                <Link href="/dashboard">
                  <p>Student Upload</p>
                </Link>
                
              </li>
              <li>
                <Link href="/display">
                    <p>Generate</p>
                </Link>
              </li>
              
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;