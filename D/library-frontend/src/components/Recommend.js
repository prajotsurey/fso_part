import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = ({ show, token }) => {
  const response = useQuery(ME)
  const [ filteredBooks, result ] = useLazyQuery(ALL_BOOKS)
  const [ favoriteGenre, setFavoriteGenre ] = useState(null)
  const [ booksToShow, setBooksToShow ] = useState([])

  useEffect( () => {
    if(response.data) {
      setFavoriteGenre(response.data.me.favoriteGenre)
    }
  },[response.data])

  useEffect( () => {
    if(favoriteGenre) {
      filteredBooks({ variables : { genre: favoriteGenre }})
    }
  },[favoriteGenre, filteredBooks])
  
  useEffect( () => {
    if(result.data) {
      setBooksToShow(result.data.allBooks)
    }
  },[result.data])

  if(!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favourite genre <strong>{favoriteGenre}</strong>
      </div>
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
    </div>
  )
}

export default Recommend