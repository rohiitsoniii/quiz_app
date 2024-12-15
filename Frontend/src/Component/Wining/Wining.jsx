import React from 'react'
import "./Wining.css"
const Wining = ({score,totalQuestions}) => {
    return (
        <>
            <div   className='live_backcolor'>

            <div  className='main_box_win'>
                <p className='won'>Congrats Quiz is completed</p>
                <img src="/won.svg" alt="" className='imgs' />
                <p className='score'>Your Score is  <p className='score_value'>0{score}/0{totalQuestions}</p> </p>
                </div>
                </div>

      </>
  )
}

export default Wining