import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { ALL_BOOKS, BOOK_ADDED } from './queries'
import { useSubscription } from '@apollo/client'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
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

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => {
      return set.map(b => b.id).includes(object.id)
    }

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if(!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook)}
      })
    }

  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      updateCacheWith(addedBook)
      window.alert(`${addedBook.title}`)
    }
  })
  
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