import React from "react";

const ErrorBody = ({ error }) => {
  return (
    <div className="w-full bg-red-100 text-red-700 text-center text-sm font-light py-1.5 rounded-md tracking-wide">
      {error}
    </div>
  );
};

export default ErrorBody;
