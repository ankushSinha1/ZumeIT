import React from 'react'
import './Loader.scss'
export const Loader = () => {
  return (
      <div className='loader'>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
    </div>
  )
}
