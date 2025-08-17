import Image from "next/image";
import React from "react";

const FunderLogo = () => {
  return (
    <div className="flex flex-row border border-slate-400 mt-6 rounded-lg px-2 py-2 space-x-3">
      <Image
        alt="finish logo"
        src="/icons/info.svg"
        className="h-8 w-8 object-cover"
        height={512}
        width={512}
      />

      <p className=" text-slate-300 text-xs tracking-wide font-light">
        Access to this website is restricted to authorized personnel only.
      </p>
    </div>
  );
};

export default FunderLogo;
