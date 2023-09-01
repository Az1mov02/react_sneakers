import React from 'react';
import AppContext from '../context'


const Info = ({title, image, description }) => {
  const { setCartOpened }  = React.useContext(AppContext);

  return (
    <div  style={{height:"100%"}} className="d-flex justify-center" >
      <div className="cartEmpty d-flex align-center justify-center flex-column" >
        <img className="mb-20" width={120}  src={image} alt="Empty"/>
        <h2>{title}</h2>
        <p className="opacity-6">{description}</p>
        <button onClick={() => setCartOpened(false)} className="greenButton">
          <img src="/img/arrow.svg" alt="Arrow" />Вернуться назад
        </button>
      </div>
    </div>
  )
}


export default Info;