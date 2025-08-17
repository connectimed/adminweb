"use client";
// import { UserIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { UserAuth } from "@/lib/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Topbar = () => {
  const pathname = usePathname();
  const { userData, fetchUserData, firebaseUser, logOut } = UserAuth();

  if (!userData) return <></>;

  if (userData && userData.account_type !== "Admin") return <></>;

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-slate-300">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-teal-600 dark:text-teal-300"
        >
          <Image
            className="h-14 w-14"
            src="/images/imed_logo.png"
            height={512}
            width={512}
            alt="logo"
          />
          <div>
            <p className="text-md text-slate-800 font-extrabold">
              IMED<span className="text-dark-bg">Connect</span>
            </p>
            <p className="text-xs text-slate-800">Administration dashboard</p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <div></div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <div
              className="bg-slate-200 p-1 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              onClick={logOut}
            >
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {userData ? (
                <Image
                  className="h-10 w-10 rounded-full"
                  src={userData.user_image}
                  height={512}
                  width={512}
                  alt="user profile"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
