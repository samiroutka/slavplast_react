import React, { useRef } from 'react'
import 'ckeditor5-custom-build/build/ckeditor.d.ts';
import { CKEditor } from '@ckeditor/ckeditor5-react'

// Не доконца рабочий Ckeditor (я так и не разобрался с тем, как импортировать Editor из папки myBuild)

export const CustomCkeditor = ({inputValue, setEditorGetContent}) => {
  let editorRef = useRef()
  return (
    <CKEditor ref={editorRef}
      editor={ClassicEditor}
      onReady={editor => {
        // фиксированная высота для ckeditor
        editor.editing.view.change((writer) => {
          writer.setStyle(
              "height",
              "50vh",
              editor.editing.view.document.getRoot()
          )
        })

        editorRef.current.editor.setData(inputValue)
        setEditorGetContent(() => {
          return () => {
            return editorRef.current.editor.getData() // Я точно не знаю, но скорее всего нужно оборачивать функцию в другую (в данном случае стрелочную, но можно и в обычнку) чтобы сохранялся контекст. Иначе выдет ошибка (которая скорее всего связана с потерей контекста)
          }
        })
      }}
    />
  )
}
