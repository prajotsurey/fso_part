const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String = null, genre: String = null): [Book!]
    allAuthors: [Author!]
  }
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]
  }
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
  type Mutation {
    addBook(
      title:String!
      author:String!
      published:Int!
      genres:[String!]
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if(args.author === null && args.genre === null) {
        return books
      } else if (args.author === null ) {
        return books.filter(book => book.genres.includes(args.genre))
      } else if (args.genre === null ) {
        return books.filter(book => book.author === args.author)
      }

      return books.filter(book => book.author === args.author && book.genres.includes(args.genre))
    },
    allAuthors: () => authors.map(a => {
      a.bookCount = books.filter(book => book.author === a.name).length
      return a
      }
    )
  },
  Mutation: {
    addBook: (root, args) => {
      const Book = { ...args, id: uuid() }
      books = books.concat(Book)
      if (authors.some(author => author.name === args.author)){
        authors = authors.concat({
          name: args.author,
          born: null,
          bookCount: 1
        })
      } else {
          authors = authors.map( author => { 
            if(author.name === args.author)
            {
              updatedAuthor = {
                ...author,
                bookCount: author.bookCount + 1
              }
              return updatedAuthor
            } 
            return author
          } 
        )
      }


      return Book
    },

    editAuthor: (root, args) => {
      const authorToUpdate = authors.find(author => author.name === args.name)
      if(!authorToUpdate) {
        return null
      }
      const updatedAuthor = {
        ...authorToUpdate, 
        born: args.setBornTo
      }
      authors = authors.map(author => (author.name === args.name) ? updatedAuthor : author)
      return updatedAuthor
    }

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})