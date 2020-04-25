import React, { useState, useEffect } from "react"

// Import assets
import "quill/dist/quill.snow.css"
import "./Mail.scss"

// Import components
import NavigationBar from "../../components/NavigationBar/NavigationBar"
import Quill from "quill"

const Mailing = () => {
    const [html, setHTML] = useState("")

    useEffect(() => {
        const editor = new Quill('#editor', {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }]
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['link', 'image']
                ]
            },
            theme: 'snow'
        })

        editor.on('text-change', onHandledChangeText)
    }, [])


    const onHandledChangeText = () => {
        const content = document.getElementsByClassName("ql-editor")[0].innerHTML


        setHTML(content)
    }

    return (
        <div className="container-mailing">
            <NavigationBar />

            <div className="content">
                <div className="editor-container">
                    <div id="editor"></div>
                </div>

                <div className="preview">
                    <div className="results" dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </div>
        </div>
    )
}

export default Mailing