import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-[#505d74] sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            
            <div className="flex pb-5 pt-4">
              <img className=' h-20 w-64' src="logo1.png" alt="EPICS Logo" width="50"/>
              <div>
                <img className=' h-20 w-64' src="team-formation-text.png" alt="Team Formation Logo" width="100"/>
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