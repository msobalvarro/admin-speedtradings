import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import './DetailRecords.scss'
import UserIcon from '../UserIcon/UserIcon'

// import utils
import { Petition, copyData, Moment, floor } from '../../utils/constanst'

// Import components
import Modal from '../../components/Modal/Modal'
import ActivityIndicator from '../../components/ActivityIndicator/Activityindicator'
import EmptyIndicator from '../../components/EmptyIndicator/EmptyIndicator'
import SecurityUserQuestion from '../../components/SecurityUserQuestion/SecurityUserQuestion'
import ConfirmPassword from '../../components/ConfirmPassword/ConfirmPassword'

const PERSON_TYPE = 1
const ENTERPRISE_TYPE = 2

/**
 * Visualiza el detalle de un usuario
 * @param {Number} id - id del usuario
 * @param {String} dateReport - mes en el que se generarán los reportes
 * @param {Function} showKYC - Especificar KYC  a mostrar
 */
const DetailRecords = ({ id = -1, dateReport = '', showKYC }) => {
    //Constantes para abortar las peticiones AXIOS
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    const [data, setData] = useState({})
    const [questionsList, setQuestionsList] = useState([])

    const [loader, setLoader] = useState(false)
    const [loaderFullScreen, setLoaderFullScreen] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showQuestionSecurityForm, setShowQuestionSecurityForm] = useState(
        false
    )

    // Obtiene el detalle de un usuario
    const fetchDetail = async _ => {
        try {
            setLoader(true)

            const { data: dataDetail } = await Petition.get(
                `/admin/records/${id}`,
                {
                    cancelToken: source.token,
                }
            )

            if (dataDetail.error) {
                throw String(dataDetail.message)
            }

            console.log(dataDetail)
            setData(dataDetail)
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message)
            } else {
                // handle error
                console.error(error)
                Swal.fire('Ha ocurrido un error', error.toString(), 'error')
            }
        } finally {
            setLoader(false)
        }
    }

    /**
     * Cambia el estado de un usuario (activado/desactivado)
     */

    const toDisableUser = async _ => {
        try {
            setLoaderFullScreen(true)

            const user = {
                email: data.email,
                active: !data.status,
            }

            const result = await Petition.post(
                '/admin/utils/activate-account',
                user
            )

            if (result.error) {
                throw String(result.message)
            }

            setData({ ...data, status: !data.status })
        } catch (error) {
            console.error(error)
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setLoaderFullScreen(false)
        }
    }

    // Obtiene la lista de las preguntas de control disponibles
    const fetchQuestionsList = async _ => {
        try {
            const { data: dataResult } = await Petition.get(
                '/collection/control-questions'
            )

            if (dataResult.error) {
                throw String(dataResult.message)
            }

            setQuestionsList(dataResult)
        } catch (error) {
            console.error(error)
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        }
    }

    const onChangeUserStatus = () => {
        Swal.fire({
            title: 'Estas seguro?',
            text: 'De querer cambiar el estado de este usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2e8b12',
            cancelButtonColor: '#c0392b',
            confirmButtonText: 'Sí, cambiar!',
        }).then(result => {
            if (result.value) {
                toDisableUser()
                Swal.fire(
                    'Deshabilitado!',
                    'El estado del usuario ha sido modificado',
                    'success'
                )
            }
        })
    }

    /**
     * Registra una pregunta de control de usuario
     * @param {Object} dataSend - datos con la información de la pregunta de control
     */
    const submitSecurityQuestion = async dataSend => {
        try {
            setLoaderFullScreen(true)

            const { data: dataResult } = await Petition.post(
                `/admin/records/${id}/security-question`,
                dataSend
            )

            if (dataResult.error) {
                throw String(dataResult.message)
            }

            Swal.fire(
                'Finalizado',
                'Se ha establecido correctamente la pregunta de control',
                'success'
            )
        } catch (error) {
            console.error(error)
            Swal.fire('Ha ocurrido un error', error.toString(), 'error')
        } finally {
            setShowQuestionSecurityForm(false)
            setLoaderFullScreen(false)
        }
    }

    /**
     * Envpia la usuario su reporte de estado de cuenta
     * @param {String} _password
     */
    const onSendReportUSer = async _password => {
        try {
            setLoaderFullScreen(true)

            const dataSend = {
                password: _password,
                date: dateReport,
                email: data.email,
            }

            const { data: result } = await Petition.post(
                '/admin/reports-users/delivery/user',
                dataSend
            )

            if (result.error) {
                throw String(result.message)
            }

            Swal.fire('Finalzado', 'Reporte enviado con éxito', 'success')
        } catch (error) {
            console.error(error)
            Swal.fire('Ha ocurrido  un error', error.toString(), 'error')
        } finally {
            setShowConfirmPassword(false)
            setLoaderFullScreen(false)
        }
    }

    /* useEffect(_ => {
        fetchQuestionsList()
    }, []) */

    useEffect(
        _ => {
            if (id !== -1) {
                fetchDetail()

                // Devolvemos una función para abortar la petición AXIOS
                return () => {
                    source.cancel('Operation canceled by the user.')
                }
            }
        },
        [id]
    )

    return (
        <div className='DetailRecords'>
            {loader && (
                <div className='center-element'>
                    <ActivityIndicator size={48} />
                </div>
            )}

            {!loader && id === -1 && (
                <div className='center-element'>
                    <EmptyIndicator message='Sin usuario para mostrar' />
                </div>
            )}

            {!loader && Object.keys(data).length > 0 && (
                <>
                    <div className='container'>
                        <div className='name-container'>
                            <span className='name-label'>{data.name}</span>

                            <span className='type-user label'>
                                <UserIcon type={data.type_users} />
                                {data.type_users === PERSON_TYPE && 'Persona'}
                                {data.type_users === ENTERPRISE_TYPE &&
                                    'Empresa'}
                            </span>
                        </div>

                        <div className='general-info'>
                            <div>
                                <span className='label'>Correo</span>
                                <span className='value'>{data.email}</span>
                            </div>

                            <div>
                                <span className='label'>Teléfono</span>
                                <span className='value'>{data.phone}</span>
                            </div>

                            <div>
                                <span className='label'>Sponsor</span>
                                <span>
                                    {data.email_sponsor || 'SIN SPONSOR'}
                                </span>
                            </div>
                            <div>
                                <span className='label'>País</span>
                                <span className='value'>{data.country}</span>
                            </div>
                        </div>

                        <h3 className='caption'>Planes activos</h3>

                        <div className='plan-container'>
                            {data.amount_btc !== null && (
                                <div className='plan-item'>
                                    <div className='name-and-date'>
                                        <h4 className='plan-title'>
                                            Plan bitcoin
                                        </h4>
                                        {data.date_plan_btc && (
                                            <h5 className='plan-title'>
                                                <Moment
                                                    date={data.date_plan_btc}
                                                    format='DD-MM-YYYY'
                                                />
                                            </h5>
                                        )}
                                    </div>
                                    <hr className='divisor' />

                                    <div className='results'>
                                        <div className='result-card'>
                                            <span className='label'>
                                                Monto Actual
                                            </span>
                                            <span className='value'>
                                                {data.amount_btc ? (
                                                    `${floor(
                                                        data.amount_btc,
                                                        8
                                                    )} BTC`
                                                ) : (
                                                    <i>SIN MONTO</i>
                                                )}
                                            </span>
                                        </div>
                                        <div className='result-card'>
                                            <span className='label'>
                                                Monto a duplicar
                                            </span>
                                            <span className='value'>
                                                {data.amount_duplicate_btc ? (
                                                    `${floor(
                                                        data.amount_duplicate_btc,
                                                        8
                                                    )} BTC`
                                                ) : (
                                                    <i>SIN MONTO</i>
                                                )}
                                            </span>
                                        </div>
                                        <div className='result-card'>
                                            <span className='label'>
                                                Porcentaje
                                            </span>
                                            <span className='value'>
                                                {data.percentage_btc ? (
                                                    `${data.percentage_btc} %`
                                                ) : (
                                                    <i>SIN DATOS</i>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='wallet-container'>
                                        <div>
                                            <span className='label'>
                                                Retiros
                                            </span>
                                            <span className='value'>
                                                {data.withdrawals_btc ||
                                                    'SIN DATOS'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className='label'>
                                                Wallet
                                            </span>
                                            <span
                                                onClick={_ =>
                                                    copyData(data.wallet_btc)
                                                }
                                                className='value wallet'
                                            >
                                                {data.wallet_btc ||
                                                    'SIN WALLET'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.amount_eth !== null && (
                                <div className='plan-item'>
                                    <div className='name-and-date'>
                                        <h4 className='plan-title'>
                                            Plan ethereum
                                        </h4>
                                        {data.date_plan_eth && (
                                            <h5 className='plan-title'>
                                                <Moment
                                                    date={data.date_plan_eth}
                                                    format='DD-MM-YYYY'
                                                />
                                            </h5>
                                        )}
                                    </div>
                                    <hr className='divisor' />

                                    <div className='results'>
                                        <div className='result-card'>
                                            <span className='label'>
                                                Monto Actual
                                            </span>
                                            <span className='value'>
                                                {data.amount_eth ? (
                                                    `${floor(
                                                        data.amount_eth,
                                                        8
                                                    )} ETC`
                                                ) : (
                                                    <i>SIN MONTO</i>
                                                )}
                                            </span>
                                        </div>
                                        <div className='result-card'>
                                            <span className='label'>
                                                Monto a duplicar
                                            </span>
                                            <span className='value'>
                                                {data.amount_duplicate_eth ? (
                                                    `${floor(
                                                        data.amount_duplicate_eth,
                                                        8
                                                    )} ETC`
                                                ) : (
                                                    <i>SIN MONTO</i>
                                                )}
                                            </span>
                                        </div>
                                        <div className='result-card'>
                                            <span className='label'>
                                                Porcentaje
                                            </span>
                                            <span className='value'>
                                                {data.percentage_eth ? (
                                                    `${data.percentage_eth} %`
                                                ) : (
                                                    <i>SIN DATOS</i>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='wallet-container'>
                                        <div>
                                            <span className='label'>
                                                Retiros
                                            </span>
                                            <span className='value'>
                                                {data.withdrawals_eth ||
                                                    'SIN DATOS'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className='label'>
                                                Wallet
                                            </span>
                                            <span
                                                onClick={_ =>
                                                    copyData(data.wallet_eth)
                                                }
                                                className='value wallet'
                                            >
                                                {data.wallet_eth ||
                                                    'SIN WALLET'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <section className='security-question'>
                            <h3 className='caption'>Pregunta de seguridad</h3>
                            {data?.controlQuestion &&
                                Object.keys(data?.controlQuestion).length ===
                                    0 && (
                                    <button
                                        style={{ display: '' }}
                                        onClick={_ =>
                                            setShowQuestionSecurityForm(true)
                                        }
                                        className='button secondary'
                                    >
                                        Añadir pregunta de seguridad
                                    </button>
                                )}

                            {data?.controlQuestion &&
                                Object.keys(data?.controlQuestion).length >
                                    0 && (
                                    <div className='result-card'>
                                        <span className='label'>
                                            {data.controlQuestion.question}
                                        </span>

                                        <span className='value'>
                                            {data.controlQuestion.answer}
                                        </span>
                                    </div>
                                )}
                        </section>

                        <section className='buttons-container'>
                            {data.type_users && (
                                <button
                                    type='button'
                                    className='button large'
                                    onClick={() => showKYC(data.type_users)}
                                >
                                    Ver KYC
                                </button>
                            )}

                            <div>
                                <Link
                                    to={`/reports/${data.id}?date=${dateReport}`}
                                    target={'_blank'}
                                    className='button secondary'
                                >
                                    Generar reporte
                                </Link>

                                <button
                                    onClick={_ => setShowConfirmPassword(true)}
                                    className='button'
                                >
                                    Enviar Reporte
                                </button>

                                <button
                                    className={`button ${
                                        data.status
                                            ? 'desactivate-user'
                                            : 'activate-user'
                                    }`}
                                    type='button'
                                    onClick={onChangeUserStatus}
                                >
                                    {data.status ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                            </div>
                        </section>
                    </div>
                </>
            )}

            {showQuestionSecurityForm && (
                <SecurityUserQuestion
                    questions={questionsList}
                    onCancel={_ => setShowQuestionSecurityForm(false)}
                    onSubmit={dataSend => submitSecurityQuestion(dataSend)}
                />
            )}

            {showConfirmPassword && (
                <ConfirmPassword
                    onSubmit={_password => onSendReportUSer(_password)}
                    onCancel={_ => setShowConfirmPassword(false)}
                />
            )}

            {loaderFullScreen && (
                <Modal persist={true} onlyChildren>
                    <ActivityIndicator size={64} />
                </Modal>
            )}
        </div>
    )
}

export default DetailRecords
