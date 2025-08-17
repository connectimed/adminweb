import Image from "next/image";
import React from "react";

const RingLoader = () => {
  return (
    <div className="flex h-[60vh] w-screen items-center justify-center">
      <Image
        className="h-10 w-10 animate-spin"
        src="/images/loading.svg"
        height={512}
        width={512}
        alt="loading icon"
      />
    </div>
  );
};

export default RingLoader;
