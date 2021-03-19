import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
  }

  useEffect(() => {
    const localToken = window.localStorage.getItem('library-user-token')
    if (localToken) {
      setToken(localToken)
    }
  }, [])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token === null 
          ? 
          <button onClick={() => setPage('login')}>login</button>
          :<span>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}> logout </button>
            <button onClick={() => setPage('recommend')}> recommend </button>
          </span>
        }
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />
      
      <Recommend 
        show={page === 'recommend'}
        token={token}
      />
      
      <LoginForm 
        show={page === 'login'}
        setToken={setToken}
      />
    </div>
  )
}

export default App