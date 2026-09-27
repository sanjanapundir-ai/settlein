"use client";

import { useState } from "react";
import { Plus, Sparkles, Trash } from "lucide-react";

export default function ListingsToolbar({
  onAdd,
  onLoadExamples,
  onClearAll,
}: {
  onAdd: () => void;
  onLoadExamples: () => void;
  onClearAll: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button type="button" onClick={onAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add a flat</button>
      <button type="button" onClick={onLoadExamples} className="btn-soft"><Sparkles className="h-4 w-4 text-violet-500" /> Load example listings</button>
      <div className="sm:ml-auto">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-2 rounded-full bg-rose-50 p-1 pl-4">
            <span className="text-sm font-bold text-rose-700">Clear everything?</span>
            <button type="button" onClick={() => { onClearAll(); setConfirming(false); }} className="btn-danger">Yes, clear</button>
            <button type="button" onClick={() => setConfirming(false)} className="btn-soft">Cancel</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="btn-soft w-full text-rose-600 sm:w-auto"><Trash className="h-4 w-4" /> Clear all data</button>
        )}
      </div>
    </div>
  );
}
