import React from "react";

const Cards = ({
  keyName,
  value,
  icon,
  color,
}: {
  keyName: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <>
      <div className="text-primary-text bg-primary-border rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{keyName}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="bg-primary-text/20 rounded-full p-2">{icon}</div>
        </div>
      </div>
    </>
  );
};

export default Cards;
