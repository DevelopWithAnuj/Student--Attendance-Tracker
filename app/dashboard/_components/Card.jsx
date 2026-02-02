import React from "react";

function Card({ icon, title, value }) {
  return (
    <div className="flex items-center gap-5 p-7 bg-sky-blue-gradient rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-border">
      <div className="p-3 h-12 w-12 rounded-full bg-background text-primary shadow-sm flex items-center justify-center ">
        {icon}
      </div>
      <div>
        <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">{title}</h2>
        <h2 className="text-2xl font-bold text-foreground">{value}</h2>
      </div>
    </div>
  );
}

export default Card;
