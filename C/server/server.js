const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const mongoose = require('mongoose')
const MONGODB_URI = "mongodb+srv://salamander:7d0MZzbJxRXwlgCd@cluster0.zq0fq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'SECRETKEY!@#$!@#$!@#$!@#$'

console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String = null, genre: String = null): [Book!]
    allAuthors: [Author!]
    me: User
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: String!
    author: Author!
    id: ID!
    genres: [String!]
  }
  type Author {
    name: String!
    id: ID!
    born: String
    bookCount: Int
  }
  type Mutation {
    addBook(
      title:String!
      author:String!
      published:String!
      genres:[String!]
    ): Book
    editAuthor(
      name: String!
      setBornTo: String!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const Books = await Book.find({}).populate('author')
      if(args.author && args.genre){
        return Books.filter(book => book.author.name === args.author && book.genres.includes(args.genre))
      } else if (args.author) {
        return Books.filter(book => book.author.name === args.author)
      } else if (args.genre) {
        return Books.filter(book => book.genres.includes(args.genre))
      } return Books 
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({}).populate('author')
      return authors.map(author => {
        author.bookCount = books.filter(book => book.author.id === author.id ).length
        console.log(author.bookCount)
        return author
      })
    },
    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if(!currentUser){
        throw new AuthenticationError("not authenticated")
      }
      const newBook = new Book({ ...args })
      const author = await Author.findOne({ name: args.author })
      try {
        if(author) {
        newBook.author = author.id
        return newBook.save()
      }
      const newAuthor = new Author({ name: args.author})
      await newAuthor.save()
      newBook.author = newAuthor.id
      return newBook.save() 
      } catch (error) {
        throw UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },

    editAuthor: async (root, args, {currentUser}) => {
      if(!currentUser){
        throw new AuthenticationError("not authenticated")
      }
      const author = await Author.findOne({ name: args.name })
      if(!author) {
        return null
      }
      author.born = args.setBornTo
      return author.save()
        .catch (error => {
          console.log(error.message)
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },

    createUser: async (root, args) => {
      const user = new User({ ...args})
      return user.save()
        .catch (error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if ( !user || args.password !== 'secred' ) {
        throw new UserInputError(" wrong credentials ")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET)}
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
