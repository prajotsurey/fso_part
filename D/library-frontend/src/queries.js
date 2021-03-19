import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`


export const ALL_BOOKS = gql`
  query($genre: String) {
    allBooks(genre: $genre) {
      title
      author{
        name
        bookCount
      }
      published
      genres
    }
  }
`


export const CREATE_BOOK = gql`
  mutation createBook ($title: String!, $author: String! , $published: String!, $genres: [String!]) {
    addBook (
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor( $name: String!, $born: String!) {
    editAuthor (
      name: $name,
      setBornTo: $born
    ) {
      name
      born
      bookCount
    }
  }
`

export const LOGIN = gql`
  mutation login( $username: String!, $password: String! ) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`

export const ME = gql
  `
    query {
      me {
        username
        favoriteGenre
      }
    }
  `
