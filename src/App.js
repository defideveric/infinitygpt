import { useState, useEffect } from "react";



const App = () => {
  //for changing input
  const [value, setValue] = useState(null)
  //save and return as object
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  //for creating new chat when you click button
  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }


  const getMessage = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type" : "application/json"
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      //save and return as object
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

    useEffect(() => {
      console.log(currentTitle, value, message)
      if (!currentTitle && value && message) {
        setCurrentTitle(value)
      }
      if(currentTitle && value && message) {
        setPreviousChats(previousChats => (
          [...previousChats, {
            title: currentTitle,
            role: "user",
            content: value
          }, 
          { 
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
        ))
      }
    },[message, currentTitle, value])

    console.log(previousChats)

    //filter through chat requests and get unique titles
    const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
    const uniqueTitles = Array.from(new Set(previousChats.map(previousChats => previousChats.title)))
    console.log(uniqueTitles)


  return (
    <div className="App">
      <section className='side-bar'>
        <button onClick={createNewChat}><ion-icon name="person-circle"></ion-icon> New Chat</button>
        <ul className='history'>
            {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Infinity</p>
        </nav>
      </section>

      <section className='main'>
        {!currentTitle && <h1>infinityGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessage}><ion-icon name="caret-forward-circle"></ion-icon></div>
          </div>
          <p className="info">
            infinityGPT May 29 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>

        </div>
      </section>
    </div>
  );
}

export default App;
