import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css'
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './pages/layouts/header'
import Footer from './pages/layouts/footer'
import routes from './routes'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { fetchCurrentUser } from './features/session/sessionSlice'
store.dispatch(fetchCurrentUser())
const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <div className="App">
      <Header />

      <div className="container">
        <ToastContainer
          transition={Flip} // Bounce Slide Zoom Flip
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
        />
        <Routes>
          {routes.map((route, index) => (
            <Route
                key={index}
                path={route.path}
                element={route.element}
            />
          ))}
        </Routes>

        <Footer />
      </div>
    </div>
    </BrowserRouter>
    </Provider>
  )
}

export default App
