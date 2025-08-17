"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import ErrorBody from "@/components/ErrorBody";
import FunderLogo from "@/components/FunderLogo";
import { UserAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebase";
import MainButton from "@/components/MainButton";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { firebaseUser } = UserAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    // Only update state if the entered value is numeric, its length is 9 or less, and it does not start with 0
    if (
      /^\d*$/.test(value) &&
      value.length <= 9 &&
      (value.length === 0 || value[0] !== "0")
    ) {
      setPhoneNumber(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 24) {
      setPassword(value);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    const email = `255${phoneNumber}@gmail.com`;
    if (phoneNumber.length < 9 || password.length < 6) {
      setError("Please fill everything!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setLoading(true);
      setError(null);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setLoading(false);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError("Incorrect credentials!");
          setTimeout(() => {
            setError("");
          }, 2000);
          console.log("Error: ", errorMessage);
          setLoading(false);
        });
    }
  };

  if (firebaseUser) router.push("/");

  return (
    <div className="flex w-full h-screen flex-wrap bg-dark-bg">
      <div className="flex w-full h-full flex-col justify-center md:w-1/2 lg:w-1/3">
        <div className="flex flex-col overflow-auto px-6 py-6 sm:px-24 md:px-8 bg-deep-dark h-full md:ml-8 md:my-8 md:rounded-2xl md:max-w-sm justify-center">
          <Image
            alt="logo"
            src="/images/logo_tra.png"
            className="h-16 w-16 object-cover"
            height={512}
            width={512}
          />
          <div className="flex flex-row text-lg gap-2 font-medium tracking-wider mt-6">
            <p className=" text-white">IMEDConnect</p>
          </div>

          <p className="mt-1 text-slate-400 text-sm tracking-wide">
            Login to the admin console
          </p>

          <div className="mt-6 sm:mx-auto sm:w-full">
            <form className="space-y-6 text-base-regular text-slate-800">
              <div className="relative">
                <span className="absolute inset-y-0 start-0 grid place-content-center px-4 text-white">
                  +255
                </span>
                <input
                  type="text"
                  className="w-full bg-transparent border rounded-md border-gray-300 px-4 py-2 ps-16 text-white outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                  placeholder="Phone number"
                  disabled={loading}
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </div>

              <input
                type="text"
                className="w-full py-2 pe-12 !bg-transparent border rounded-md border-gray-300 px-4 text-white outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                placeholder="Password"
                value={password}
                disabled={loading}
                onChange={handlePasswordChange}
              />

              <div className="w-full">
                <MainButton
                  className="flex justify-center items-center gap-3 w-full"
                  onClick={(e) => handleSignIn(e)}
                >
                  <Image
                    src="/icons/circle-chase.svg"
                    className={`h-4 w-4 animate-spin ${
                      loading ? "block" : "hidden"
                    }`}
                    height={20}
                    alt="image"
                    width={20}
                  />
                  <p>Sign In</p>
                </MainButton>
              </div>
            </form>

            {error && (
              <div className="mt-6">
                <ErrorBody error={error} />
              </div>
            )}
          </div>
          <FunderLogo />
        </div>
      </div>
      <div className="h-screen pointer-events-none hidden select-none bg-primary-deep-dark md:block md:w-1/2 lg:w-2/3">
        <Image
          className=" w-full h-full object-contain object-bottom"
          src="/images/robot.png"
          height={100}
          width={1000}
          alt="robot"
        />
      </div>
    </div>
  );
};

export default page;
