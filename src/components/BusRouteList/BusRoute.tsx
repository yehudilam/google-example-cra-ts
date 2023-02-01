import React from "react";

const Route = ({ route }: any) => {
  return (
    <>
      <div className="flex" 
      >
        <div className="text-bold mr-2">{route.routec}</div>
        <div>{route.startc} - {route.destinc}</div>
      </div>
    </>
  )
};

export default Route;
