import React, { useState } from 'react'
import Sidebar from './Sidebar'

const Details = () => {
    const [activeContent, setActiveContent] = useState('');

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };
  return (
    <React.Fragment>
      <Sidebar onButtonClick={handleButtonClick} activeContent={activeContent}/>
      
    </React.Fragment>
  )
}

export default Details
