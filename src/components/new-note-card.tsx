export function NewNoteCard() {
    return (
        <div className="rounded-md bg-slate-700 p-5 space-y-3 overflow-hidden relative">
          <span className="text-sm font-medium text-slate-200">
            Add note
          </span>
          <p className="text-sm leading-6 text-slate-400">
            Record an audio note to be automatically converted into text.
          </p>
        </div>
    )
}