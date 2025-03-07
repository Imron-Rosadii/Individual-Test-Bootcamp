import React from "react";

const Label = ({ labelClassname, children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassname}`}>
      {children}
    </label>
  );
};

export default Label;
