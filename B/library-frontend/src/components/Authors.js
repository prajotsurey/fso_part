import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'
import React, { useState } from 'react'

const AuthorEditForm = () => {
  const [ updateAuthor ] = useMutation( UPDATE_AUTHOR,{
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  const [ name, setName ] = useState("")
  const [ born, setBorn ] = useState("")
  const authors = useQuery(ALL_AUTHORS)
  let options = []

  if(!authors.loading) {
    options = authors.data.allAuthors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(born,name)
    updateAuthor({ variables: { name, born } })
  }

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={handleSubmit}>
        <div>
        <label>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>            
            { options.map( author => 
              <option key={author.id} value={author.name}>{ author.name }</option>    
              )}
          </select>
        </label>
        </div>
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        < button type='submit' >update author</button>
      </form>
    </div>
  )
}

const Authors = (props) => {
  const response  = useQuery( ALL_AUTHORS )
  let authors = []
  if (!props.show) {
    return null
  }
  
  if(!response.loading) {
    authors = response.data.allAuthors
  }
  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <AuthorEditForm />
    </div>
  )
}

export default Authors
