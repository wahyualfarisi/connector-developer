import React from 'react';
import spinner from './../../img/spinner.gif';

const Spinner = () => {
    return (
      <div>
        <img src={spinner} alt="loading ..." style={{ width: '60px' , margin: 'auto', display: 'block' }} />  
      </div>
    )
}

export default Spinner;
