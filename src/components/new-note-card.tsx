import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated : (content: string) => void
}

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')

    function handleTextEditor() {
      setShouldShowOnboarding(false)
    }

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
      setContent(event.target.value)

      if(event.target.value === ''){
        setShouldShowOnboarding(true)
      }
    }

    function handleSaveNote(event: FormEvent) {
      event.preventDefault()

      onNoteCreated(content)

      setContent('')
      setShouldShowOnboarding(true)

      toast.success('Note created successfully!')
    }

    return (
        <Dialog.Root>
          <Dialog.Trigger className="flex flex-col gap-3 text-left rounded-md bg-slate-700 p-5 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
            <span className="text-sm font-medium text-slate-200">
              Add note
            </span>
            <p className="text-sm leading-6 text-slate-400">
              Record an audio note to be automatically converted into text.
            </p>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="inset-0 fixed bg-black/50"/>
            <Dialog.DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none overflow-hidden">
              <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
                <X className="size-5" />
              </Dialog.Close>

              <form onSubmit={handleSaveNote} className="flex flex-col flex-1">
                <div className="flex flex-1 flex-col gap-3 p-5  ">
                  <span className="text-sm font-medium text-slate-300">
                    Add note
                  </span>
                  {
                    shouldShowOnboarding ? (
                      <p className="text-sm leading-6 text-slate-400">
                        <button className="font-medium text-lime-400 hover:underline">Record</button> and audio or <button onClick={handleTextEditor} className="font-medium text-lime-400 hover:underline">type</button> a text.
                      </p>

                    ) : ( 
                      <textarea 
                        autoFocus
                        className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                        onChange={handleContentChange}
                        value={content}
                      />
                    )
                  }
                </div>

                <button 
                  type='submit'
                  className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 font-medium outline-none hover:bg-lime-500  "
                >
                  Salvar nota
                </button>
              </form>
            </Dialog.DialogContent>
          </Dialog.Portal>
        </Dialog.Root>
    )
}