import React from 'react'
import { css } from '@emotion/css'

const Blue = () => {
  return (
    <div className={blueStyles}>
      Blue
    </div>
  )
}

const blueStyles = css`
  background-color: blue;
  font-size: 1.5rem;
  color: white;
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default Blue
