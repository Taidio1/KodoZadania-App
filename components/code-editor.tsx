"use client"

import { useEffect, useRef } from 'react'
import * as monaco from '@monaco-editor/react'
import { Button } from '@/components/ui/button'

interface CodeEditorProps {
  language: string
  code: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function CodeEditor({ language, code, onChange, onSubmit, isSubmitting = false }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-[400px]">
        <monaco.Editor
          height="100%"
          defaultLanguage={language}
          defaultValue={code}
          theme="vs-dark"
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Solution'}
        </Button>
      </div>
    </div>
  )
}
