import { fetchCurrentUser } from '../../features/session/sessionSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import flashMessage from '../shared/flashMessages'
import { useState, useRef, MutableRefObject } from 'react'
import sessionApi from '../../app/api/sessionApi'

const initialState = {
  email: '',
  password: '',
  remember_me: "1"
};


export default function New() {
  let navigate = useNavigate()
  const [state, setState] = useState(initialState)
  const dispatch = useAppDispatch()
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    const { email, password, remember_me } = state

    sessionApi.create(
      {
        session: {
          email,
          password,
          remember_me
        }
      }
    ).then(response => {
      inputEl.current.blur()
      if (response.user) {
        if (remember_me === "1") {
          localStorage.setItem("token", response.jwt)
          localStorage.setItem("remember_token", response.token)
        } else {
          sessionStorage.setItem("token", response.jwt)
          sessionStorage.setItem("remember_token", response.token)
        }
        dispatch(fetchCurrentUser())
        navigate("/users/" + response.user.id)
      }
      if (response.flash) {
        flashMessage(...response.flash)
      }
    })
    .catch(error => {
      console.log(error)
    })
    e.preventDefault()
  }

  return (
    <>
      <h1>Log in</h1>
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <form
            action="/login"
            acceptCharset="UTF-8"
            method="post"
            onSubmit={handleSubmit}
          >

            <label htmlFor="session_email">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              id="session_email"
              value={state.email}
              onChange={handleChange}
            />

            <label htmlFor="session_password">Password</label>
            <a href="/password_resets/new">(forgot password)</a>
            <input
              className="form-control"
              type="password"
              name="password"
              id="session_password"
              value={state.password}
              onChange={handleChange}
            />

            <label className="checkbox inline" htmlFor="session_remember_me">
              <input
                name="remember_me"
                type="hidden"
                value="0" />
              <input
                checked
                type="checkbox"
                name="remember_me"
                id="session_remember_me"
                value={state.remember_me}
                onChange={handleChange}
              />
              <span>Remember me on this computer</span>
            </label>
            <input ref={inputEl} type="submit" name="commit" value="Log in" className="btn btn-primary" data-disable-with="Log in" />
          </form>
          <p>New user? <Link to="/signup">Sign up now!</Link></p>
        </div>
      </div>
    </>
  )
}
