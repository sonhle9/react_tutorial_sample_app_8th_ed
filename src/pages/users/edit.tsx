import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import userApi from "../../app/api/userApi"
import errorMessage from "../shared/errorMessages"
import flashMessage from "../shared/flashMessages"

const initialState = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  gravatar: '',
  errorMessage: [] as string[],
};

export default function Edit() {
  let { id } = useParams()
  const [state, setState] = useState(initialState)
  let navigate = useNavigate();
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>

  const getUserInfo= useCallback(async () => {
    if (state.name === ''
      || state.email === ''
    ) {
    userApi.edit(id as string
    ).then(res => {
      if (res.user) {
        setState({
          ...state,
          name: res.user.name,
          email: res.user.email,
          gravatar: res.gravatar,
        });
      }
      if (res.flash) {
        flashMessage(...res.flash)
        navigate('/')
      }
    })
    .catch(error => {
      console.log(error)
    })
    }
  }, [id, navigate, state])

  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    const { name, email, password, password_confirmation } = state

    userApi.update(id as string,
      { 
        user: {
          name,
          email,
          password,
          password_confirmation
        },
      }
    ).then(response => {
      inputEl.current.blur()
      if (response.flash_success) {
        flashMessage(...response.flash_success)
        setState({
          ...state,
          password: '',
          password_confirmation: '',
        });
        getUserInfo()
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
    <h1>Update your profile</h1>
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <form
        action="/users/1"
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
          value={state.name}
          name="name"
          id="user_name"
          onChange={handleChange}
          />

          <label htmlFor="user_email">Email</label>
          <input
          className="form-control"
          type="email"
          value={state.email}
          name="email"
          id="user_email"
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

          <input ref={inputEl} type="submit" name="commit" value="Save changes" className="btn btn-primary" data-disable-with="Save changes" />
        </form>
        <div className="gravatar_edit">
          <img alt={state.name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+state.gravatar+"?s=80"} />
          <a href="https://gravatar.com/emails" target="_blank" rel="noopener noreferrer">change</a>
        </div>
      </div>
    </div>
    </>
  )
}
