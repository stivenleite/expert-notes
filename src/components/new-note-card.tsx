import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated : (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
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

      if(content === '') {return}

      onNoteCreated(content)

      setContent('')
      setShouldShowOnboarding(true)

      toast.success('Note created successfully!')
    }

    function handleStartRecording() {
      const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
      
      if(!isSpeechRecognitionAPIAvailable) {
        alert("Unfortunately, this browser do not support recording API!")
        return
      }
      
      setIsRecording(true)
      setShouldShowOnboarding(false)
      
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      speechRecognition = new SpeechRecognitionAPI()

      speechRecognition.lang = 'en-US'
      speechRecognition.continuous = true
      speechRecognition.maxAlternatives = 1
      speechRecognition.interimResults = true

      speechRecognition.onresult = (event) => {
        const transcription = Array.from(event.results).reduce((text, result) => {
          return text.concat(result[0].transcript)
        }, '')

        setContent(transcription)
      }

      speechRecognition.onerror = (event) => {
        console.log(event)
      }

      speechRecognition.start()
    }

    function handleStopRecording() {
      setIsRecording(false)

      if(speechRecognition != null) {
        speechRecognition.stop()
      }
    }

    function handleCloseButton() {
      handleStopRecording()

      setShouldShowOnboarding(true)
    }

    return (
        <Dialog.Root>
          <Dialog.Trigger className="flex flex-col gap-3 text-left rounded-md bg-slate-700 p-5 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
            <span className="text-sm font-medium text-slate-200">
              Add note
            </span>
            <p className="text-sm leading-6 text-slate-400">
              Record an audio note to be automatically converted into text or just type it.
            </p>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="inset-0 fixed bg-black/50"/>
            <Dialog.DialogContent className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden">
              <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
                <X className="size-5" onClick={handleCloseButton} />
              </Dialog.Close>

              <form className="flex flex-col flex-1">
                <div className="flex flex-1 flex-col gap-3 p-5  ">
                  <span className="text-sm font-medium text-slate-300">
                    Add note
                  </span>
                  {
                    shouldShowOnboarding ? (
                      <p className="text-sm leading-6 text-slate-400">
                        <button type='button' onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">Record</button> an audio or <button type='button' onClick={handleTextEditor} className="font-medium text-lime-400 hover:underline">type</button> a text.
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

                {
                  isRecording ? (
                    <button 
                      type='button'
                      onClick={handleStopRecording}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 font-medium outline-none hover:text-slate-100  "
                    >
                      <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                      Recording (Click to stop)
                    </button>
                  ) : (
                    <button 
                      type='button'
                      onClick={handleSaveNote}
                      className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 font-medium outline-none hover:bg-lime-500  "
                    >
                      Save note
                    </button>
                  )
                }

              </form>
            </Dialog.DialogContent>
          </Dialog.Portal>
        </Dialog.Root>
    )
}