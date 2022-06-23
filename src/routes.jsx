import Home from './pages'
import About from './pages/about'
import Contact from './pages/contact'
import Help from './pages/help'
import Users from './pages/users'
import UserNew from './pages/users/new'
import UserShow from './pages/users/show'
import UserEdit from './pages/users/edit'
import SessionNew from './pages/sessions/new'
import ShowFollow from './pages/users/showFollow'
import React from './pages/react'
import Counter from './pages/counter'

const routes = [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <Contact /> },
    { path: "/help", element: <Help /> },
    { path: "/users", element: <Users /> },
    { path: "/users/new", element: <UserNew /> },
    { path: "/users/:id", element: <UserShow /> },
    { path: "/users/:id/edit", element: <UserEdit /> },
    { path: "/signup", element: <UserNew /> },
    { path: "/login", element: <SessionNew /> },
    { path: "/users/:id/following", element: <ShowFollow /> },
    { path: "/users/:id/followers", element: <ShowFollow /> },
    { path: "/react", element: <React /> },
    { path: "/counter", element: <Counter /> },
]

export default routes
