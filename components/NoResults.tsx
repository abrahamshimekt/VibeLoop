import React, { FC } from "react";
interface IProps {
  text: string;
  icon:FC
}
const NoResults = ({ text ,icon:Icon}: IProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <p className="text-8xl">
      <Icon/>
      </p>
      <p className="text-2xl text-center">{text}</p>
    </div>
  );
};

export default NoResults;
