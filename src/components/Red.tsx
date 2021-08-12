import React from 'react'
import { css } from '@emotion/css'

const Red = () => {
  return (
    <div className={redStyles}>
      Red
    </div>
  )
}

const redStyles = css`
  background-color: red;
  font-size: 1.5rem;
  color: white;
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default Red
