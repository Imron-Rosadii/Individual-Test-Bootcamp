import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import React from "react";

const InputForm = ({ label, name, type, placeholder, value, onChange }) => {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input name={name} id={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
};

export default InputForm;
