import React from "react";
import Link from "next/link";
import './navbar.css'

const Navbar = () => {
  return (
    <>
      <div className= "w-full h-20 bg-[rgba(99,168,163,0)] sticky top-0 ">
        <div className="container mx-auto px-4 h-full bg-[#629e91]">
          <div className="flex justify-between items-center h-full">
            
            <div className="flex">
              <img className=' h-20 w-64' src="logo1.png" alt="EPICS Logo" width="50"/>
              <div>
                <img className=' h-20 w-64' src="team-formation-text.png" alt="Team Formation Logo" width="100"/>
              </div>
            </div>

            

            <ul className="hidden md:flex gap-x-6 text-white backgroundFont">
              <li>
                <Link href="/sign-in"> Sign In
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