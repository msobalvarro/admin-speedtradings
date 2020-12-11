import React, { useState } from 'react'
import { ReactComponent as ArrowDown } from '../../static/images/arrow-down.svg'
import { ReactComponent as ArrowUp } from '../../static/images/arrow-up.svg'
import { getCountry } from '../../utils/constanst'

import './CollapsibleTable.scss'

const Row = ({ beneficiary }) => {
  const [collapseIsOpen, setCollapseIsOpen] = useState(false)

  const toggleCollapse = () => {
    setCollapseIsOpen(!collapseIsOpen)
  }

  return (
    <>
      <div className="table-row">
        <span>
          {!collapseIsOpen ? (
            <div className="arrow-icon-container">
              <ArrowDown
                className="icon"
                fill="#fff"
                onClick={toggleCollapse}
              />
            </div>
          ) : (
            <div className="arrow-icon-container">
              <ArrowUp className="icon" fill="#fff" onClick={toggleCollapse} />
            </div>
          )}
        </span>
        <span className="table-cell card-value">{beneficiary?.fullname}</span>
        <span className="table-cell card-value">
          {beneficiary?.participationPercentage} %
        </span>
        <span className="table-cell card-value">
          {beneficiary?.chargeTitle}
        </span>
        <span className="table-cell card-value">
          {beneficiary?.passportNumber}
        </span>
        <span className="table-cell card-value">
          {getCountry(beneficiary?.originCountry)}
        </span>
      </div>
      {collapseIsOpen && (
        <div className="collapse three-columns">
          <div>
            <div className="label-group-small">
              <span className="label">Pais de emisión del pasaporte</span>
              <p className="value">
                {getCountry(beneficiary?.passportEmissionCountry)}
              </p>
            </div>

            <div className="label-group-small">
              <span className="label">Correo</span>
              <p className="value">{beneficiary?.email}</p>
            </div>
          </div>

          <div>
            <div className="label-group-small">
              <span className="label">Estado / provincia / Región</span>
              <p className="value">{beneficiary?.province}</p>
            </div>

            <div className="label-group-small">
              <span className="label">Identificación tributaria</span>
              <p className="value">{beneficiary?.identificationTaxNumber}</p>
            </div>
          </div>

          <div>
            <div className="label-group-small">
              <span className="label">Ciudad</span>
              <p className="value">{beneficiary?.city}</p>
            </div>

            <div className="label-group-small">
              <span className="label">Dirección</span>
              <p className="value">{beneficiary?.direction}</p>
            </div>
          </div>

          <div>
            <div className="label-group-small">
              <span className="label">Código postal</span>
              <p className="value">{beneficiary?.postalCode}</p>
            </div>

            <div className="label-group-small">
              <span className="label">Fecha de nacimiento</span>
              <p className="value">{beneficiary?.birthday}</p>
            </div>
          </div>
          <div className="button-identifications">
            <span className="value">Identificaciones</span>

            <button className="button secondary">Ver identificacion</button>
            <button className="button secondary">Ver pasaporte</button>
          </div>
        </div>
      )}

      <div className="separator" />
    </>
  )
}

const CollapsibleTable = ({ beneficiaries }) => {
  if (!beneficiaries) return <h2>Sin beneficiarios</h2>

  return (
    <div className="table" aria-label="collapsible table">
      <div className="table-head">
        <div className="table-row">
          <span></span>
          <span className="table-cell card-label">Nombre completo</span>
          <span className="table-cell card-label">Participación %</span>
          <span className="table-cell card-label">Titulo del cargo</span>
          <span className="table-cell card-label">N0 pasaporte </span>
          <span className="table-cell card-label">Pais de origen</span>
        </div>
      </div>
      <div className="table-body">
        {beneficiaries.map((beneficiary, index) => (
          <Row key={index} beneficiary={beneficiary} />
        ))}
      </div>
    </div>
  )
}

export default CollapsibleTable
