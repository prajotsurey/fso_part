import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const response = useQuery(ALL_BOOKS)
  const [ filter, setFilter ] = useState(null)
  let books = []
  let genreList = []
  let flat = []
  let genres = []
  let booksToShow = [] 
  if (!props.show) {
    return null
  }
  
  if (!response.loading) {
    books = response.data.allBooks
    genreList = response.data.allBooks.map(a => a.genres)
    flat = genreList.flat(1)
    genres = flat.filter( (a,pos) => flat.indexOf(a) === pos )
    if( filter === null) {
      booksToShow = books
    } else {
      booksToShow = books.filter( book => book.genres.includes(filter))
    }
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
      {genres.map((a, index) => 
        <button key={index} onClick={() => setFilter(a)}>
          {a}
        </button>)}
        <button onClick={() => setFilter(null)}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books