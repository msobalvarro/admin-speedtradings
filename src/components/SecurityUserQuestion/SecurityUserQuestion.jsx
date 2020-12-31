import React, { useState } from 'react'
import './SecurityUserQuestion.scss'

// Import components
import Modal from '../Modal/Modal'

// Import constant
import { randomKey } from '../../utils/constanst'


const SecurityUserQuestion = ({
    questions = [],
    onSubmit = _ => { },
    onCancel = _ => { }
}) => {
    const [question, setQuestion] = useState(-1)
    const [response, setResponse] = useState('')

    return (
        <Modal persist={true} onlyChildren>
            <div className="SecurityUserQuestion">
                <h3>Establecer pregunta de seguridad</h3>

                <select
                    className="picker"
                    value={question}
                    onChange={e => setQuestion(parseInt(e.target.value))}>
                    <option value="-1" disabled hidden>Seleccione una pregunta</option>
                    {
                        questions.map(item => (
                            <option key={randomKey()} value={item.id}>{item.question}</option>
                        ))
                    }
                </select>

                <textarea
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                    className="text-input"></textarea>

                <section className="buttons-group">
                    <button
                        onClick={onCancel}
                        className="button">Cancelar</button>

                    <button
                        disabled={!(response.trim().length >= 4 && question !== -1)}
                        onClick={_ => onSubmit({ question, response })}
                        className="button">Guardar</button>
                </section>
            </div>
        </Modal>
    )
}

export default SecurityUserQuestion