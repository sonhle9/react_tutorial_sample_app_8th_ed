import { MutableRefObject, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import errorMessage from '../shared/errorMessages'
import flashMessage from '../shared/flashMessages'
import userApi from '../../app/api/userApi'

const initialState = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  errorMessage: [] as string[],
};

export default function New() {
  let navigate = useNavigate();
  const [state, setState] = useState(initialState)
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    const { name, email, password, password_confirmation } = state

    userApi.create(
      {
        user: {
          name,
          email,
          password,
          password_confirmation
        }
      }
    ).then(response => {
      inputEl.current.blur()
      if (response.user) {
        setState({
          ...state,
          errorMessage: [],
        });
        flashMessage(...response.flash as [message_type: string, message: string])
        navigate("/")
        // window.location.assign('https://mail.google.com/mail/u/0')  
      }
      if (response.error) {
        setState({
          ...state,
          errorMessage: response.error,
        });
      }
    })
    .catch(error => {
      console.log(error)
    })
    e.preventDefault()
  }

  return (
    <>
    <h1>Sign up</h1>

    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <form
        className="new_user"
        id="new_user" action="/users"
        acceptCharset="UTF-8"
        method="post"
        onSubmit={handleSubmit}
        >
          { state.errorMessage.length !== 0 &&
            errorMessage(state.errorMessage)
          }

          <label htmlFor="user_name">Name</label>
          <input
          className="form-control"
          type="text"
          name="name"
          id="user_name"
          autoComplete="off"
          value={state.name}
          onChange={handleChange}
          />

          <label htmlFor="user_email">Email</label>
          <input
          className="form-control"
          type="email"
          name="email"
          id="user_email"
          value={state.email}
          onChange={handleChange}
          />

          <label htmlFor="user_password">Password</label>
          <input
          className="form-control"
          type="password"
          name="password"
          id="user_password"
          value={state.password}
          onChange={handleChange}
          />

          <label htmlFor="user_password_confirmation">Confirmation</label>
          <input
          className="form-control"
          type="password"
          name="password_confirmation"
          id="user_password_confirmation"
          value={state.password_confirmation}
          onChange={handleChange}
          />

          <input ref={inputEl} type="submit" name="commit" value="Create my account" className="btn btn-primary" data-disable-with="Create my account" />
        </form>  
      </div>
    </div>
    </>
  )
}
