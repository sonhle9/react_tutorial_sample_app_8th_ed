import { useCallback, useEffect, useState } from "react"
import userApi, { User } from "../../app/api/userApi"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/session/sessionSlice"
import flashMessage from "../shared/flashMessages"
import Pagination from 'react-js-pagination'

export default function Users() {
  const [users, setUsers] = useState([] as User[])
  const [page, setPage] = useState(1)
  const [total_count, setTotalCount] = useState(1)
  const current_user = useAppSelector(selectUser)

  const setUsersList= useCallback(async () => {
    userApi.index({page: page}
    ).then(response => {
      if (response.users) {
        setUsers(response.users)
        setTotalCount(response.total_count)
      } else {
        setUsers([])
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [page])

  useEffect(() => {
    setUsersList()
  }, [setUsersList])

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setPage(pageNumber)
  }

  const removeUser = (index: number, userId: number) => {
    let sure = window.confirm("You sure?")
    if (sure === true) {
      userApi.destroy(userId
      ).then(response => {
          if (response.flash) {
            flashMessage(...response.flash)
            setUsersList()
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <>
    <h1>All users</h1>

    <Pagination
      activePage={page}
      itemsCountPerPage={5}
      totalItemsCount={total_count}
      pageRangeDisplayed={5}
      onChange={handlePageChange}
    />

    <ul className="users">
      {users.map((u, i) => (
      <li key={i}>
        <img alt={u.name} className="gravatar" src={"https://secure.gravatar.com/avatar/"+u.gravatar_id+"?s="+u.size} />
        <a href={'/users/'+u.id}>{u.name}</a>
        {
          current_user.value.admin && current_user.value.id !== u.id ? (
            <>
            | <a href={'#/users/'+u.id} onClick={() => removeUser(i, u.id)}>delete</a>
            </>
          ) : (
            <></>
          )
        }
      </li>
      ))}
    </ul>

    <Pagination
      activePage={page}
      itemsCountPerPage={5}
      totalItemsCount={total_count}
      pageRangeDisplayed={5}
      onChange={handlePageChange}
    />
    </>
  )
}
