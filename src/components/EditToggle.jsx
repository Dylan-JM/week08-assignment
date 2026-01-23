"use client";

import { useState } from "react";

export default function EditToggle({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {!open && <button onClick={() => setOpen(true)}>Edit</button>}

      {open && (
        <div>
          {children}
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
