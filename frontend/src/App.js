import './App.css';
import { BrowserRouter as Router, Route, Link, NavLink, Routes } from 'react-router-dom';
import Home from './component/Home';
import NewPost from './component/NewPost';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className='App-header'>
            <h1 className='App-title'>
              Binterest App
            </h1>
            <nav>
              <NavLink className='navlink' to='/'>
                Home
              </NavLink>
              <NavLink className='navlink' to='/my-bin'>
                my-bin
              </NavLink>
              <NavLink className='navlink' to='/my-posts'>
                my-posts
              </NavLink>
            </nav>
            </header>
            <Routes>
              <Route path='/' element={<Home type={"main"} />} />
						  <Route path='/my-bin' element={<Home type={"my-bin"} />}/>    {/*my bin page need to refresh the page to show the newest data*/}
              <Route path='/my-posts' element={<Home type={"my-posts"} />} />
          		<Route path='/new-post' element={<NewPost />} />
            </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
