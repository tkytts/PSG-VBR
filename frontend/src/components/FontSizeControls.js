import React from "react";

export default function FontSizeControls({ onIncrease, onDecrease }) {
  return (
    <>
      <button onClick={onIncrease} className="btn btn-primary">
        A+
      </button>
      <button onClick={onDecrease} className="btn btn-secondary">
        A-
      </button>
    </>
  );
}