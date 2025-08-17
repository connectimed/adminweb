import { UserAuth } from "@/lib/AuthContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UnAuthorized = () => {
  const { userData, fetchUserData, firebaseUser, logOut } = UserAuth();

  return (
    <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="flex  justify-center w-full mx-auto">
          <Image
            className="h-16 w-16"
            src="/icons/error.svg"
            height={512}
            width={512}
            alt="error icon"
          />
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-balance text-dark-bg sm:text-5xl">
          Access Denied
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
          You are not authorized to access this website.
          <br />
          If you belive this is by accident please contact support.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="https://www.imedconnect.or.tz"
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Go To Main
          </Link>
          <div
            onClick={logOut}
            className="rounded-md text-sm font-semibold text-dark border border-dark px-4 py-2 cursor-pointer"
          >
            Log out <span aria-hidden="true">&rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorized;
