"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Link } from "@react-email/components";
import { Button } from "./ui/button";

const NavBar: React.FC = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;

  return (
    <nav className=" p-4 md:6 shadow-md">
      <div className=" container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="#">
          Mistory Message
        </a>
        {session ? (
          <>
            <span className="mr-4 ">welcome, {user?.name || user?.email}</span>
            <Button
              onClick={() => {
                signOut();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in ">
            {" "}
            <Button className="w-full md:w-auto ">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
