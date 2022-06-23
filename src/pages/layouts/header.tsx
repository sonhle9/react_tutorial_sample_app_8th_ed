import { fetchCurrentUser, selectUser } from '../../features/session/sessionSlice'
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import React from 'react';
import sessionApi from '../../app/api/sessionApi';

export default function Header(){
  let navigate = useNavigate();
  const userData = useAppSelector(selectUser);
  const dispatch = useAppDispatch()

  const onClick = () => {
    sessionApi.destroy(
    ).then(() => {   
      localStorage.removeItem("token")
      localStorage.removeItem("remember_token")
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("remember_token")
      dispatch(fetchCurrentUser())
      navigate("/")
    })
    .catch((error) => {
      console.log("logout error", error)
    })
  }

  return (
    <header className="navbar navbar-fixed-top navbar-inverse">
      <div className="container">
        <Link id="logo" to="/">react {React.version} app</Link>
        <nav>
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed"
                    data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1"
                    aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <ul className="nav navbar-nav navbar-right collapse navbar-collapse"
              id="bs-example-navbar-collapse-1">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/help">Help</Link></li>
            {
            userData.status === 'loading' ? (
            <li><Link to="/">Loading</Link></li>
            ) : userData.error ? (
            <li><Link to="/">{userData.error}</Link></li>
            ) : userData.loggedIn ? (
            <>
            <li><Link to="/users">Users</Link></li>
            {/* <li className="dropdown">
              <Link to="#" className="dropdown-toggle" data-toggle="dropdown">
                Account <b className="caret"></b>
              </Link>
              <ul className="dropdown-menu">
                <li><Link to={"/users/"+userData.value.id}>Profile</Link></li>
                <li><Link to={"/users/"+userData.value.id+"/edit"}>Settings</Link></li>
                <li className="divider"></li>
                <li>
                  <Link to="#logout" onClick={onClick}>Log out</Link>
                </li>
              </ul>
            </li> */}
            <li><Link to={"/users/"+userData.value.id}>Profile</Link></li>
            <li><Link to={"/users/"+userData.value.id+"/edit"}>Settings</Link></li>
            <li className="divider"></li>
            <li>
              <Link to="#logout" onClick={onClick}>Log out</Link>
            </li>
            </>
            ) : (
            <li><Link to="/login">Log in</Link></li>
            )
            }
          </ul>
        </nav>
      </div>
    </header>
  )
}