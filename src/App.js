import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isRecession, setIsRecession] = useState('');
  const [cssClass, setcssClass] = useState('');
  const serverHost = process.env.SERVERHOST;
  useEffect(() => {
    fetch(serverHost+'/sahm')
      .then((response) => {return response.json();})
      .then(function(json) {
        if(json.isRecession){
          setIsRecession('yes.');
          setcssClass('Yes');
        }
        else{
          setIsRecession('no.');
          setcssClass('No');
        }
      })
       .catch((err) => {
          console.log(err.message);
       });
 }, []);

  return (
    <div className={'App ' +cssClass}>
      <h1><a href="https://fred.stlouisfed.org/series/SAHMREALTIME">{isRecession}</a></h1>
    </div>
  );
}

export default App;
