"use client";
import { useState, cloneElement } from "react";

export default function EditToggle({ children }) {
  const [open, setOpen] = useState(false);

  const enhancedChild = cloneElement(children, {
    onSubmit: () => setOpen(false),
  });

  return (
    <div>
      <button onClick={() => setOpen(!open)}>Edit</button>
      {open && enhancedChild}
    </div>
  );
}
