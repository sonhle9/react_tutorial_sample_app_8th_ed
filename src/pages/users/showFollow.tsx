import { Link, useLocation, useParams } from 'react-router-dom'
import { selectUser } from '../../features/session/sessionSlice'
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import flashMessage from '../shared/flashMessages'
import Pagination from 'react-js-pagination'
import userApi, { IUserFollow, UserFollow } from '../../app/api/userApi'
import Stats from '../shared/Stats'

export default function ShowFollow() {
  const [users, setUsers] = useState([] as UserFollow[])
  const [xusers, setXusers] = useState([] as UserFollow[])
  const [page, setPage] = useState(1)
  const [total_count, setTotalCount] = useState(1)
  const current_user = useAppSelector(selectUser)
  const [user, setUser] = useState({} as IUserFollow)
  const { id } = useParams()
  const location = useLocation()
  // const lastUrlSegment = location.pathname.slice(location.pathname.lastIndexOf('/') + 1 , location.pathname.length)
  const lastUrlSegment = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)

  const setFollowPage= useCallback(async () => { 
    userApi.follow(id as string, page, lastUrlSegment as string
    ).then(response => {
      setUsers(response.users)
      setXusers(response.xusers)
      setTotalCount(response.total_count)
      setUser(response.user)
    })
    .catch((error: any) => {
      console.log(error)
    })
  }, [page, id, lastUrlSegment])

  useEffect(() => {
    setFollowPage()
  }, [setFollowPage])

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    setPage(pageNumber)
  }

  const removeUser = (userId: number) => {
    let sure = window.confirm('You sure?')
    if (sure === true) {
      userApi.destroy(userId
      ).then(response => {
          if (response.flash) {
            flashMessage(...response.flash)
            setFollowPage()
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <>
    <div className='row'>
      <aside className='col-md-4'>
        <section className='user_info'>
          <img alt={user.name} className='gravatar' src={'https://secure.gravatar.com/avatar/'+user.gravatar+'?s=80'} />
          <h1>{user.name}</h1>
          <span><Link to={'/users/'+user.id}>view my profile</Link></span>
          <span><b>Microposts:</b> {user.micropost}</span>
        </section>

        <section className='stats'>
          <Stats
            id={user.id}
            following={user.following}
            followers={user.followers}
          />

          <div className='user_avatars'>
            {xusers.length > 0 &&
            <>
            {xusers.map((u, i) => (
            <Link key={i} to={'/users/'+u.id}>
              <img alt='{u.name}' className='gravatar' src={'https://secure.gravatar.com/avatar/'+u.gravatar_id+'?s=30'} />
            </Link>
            ))}
            </>
            }
          </div>
        </section>
      </aside>

      <div className='col-md-8'>
        {users.length > 0 &&
        <>
        <h3>{lastUrlSegment?.toString()[0].toUpperCase()}{lastUrlSegment?.toString().slice(1)}</h3>
        {/* <h3>{follow?.toString().replace(/^\w/, (c) => c.toUpperCase())}</h3> */}
        {/* <h3>{follow?.toString().trim().replace(/^\w/, (c) => c.toUpperCase())}</h3> */}
        <ul className='users follow'>
        {users.map((u, i) => (
        <li key={i}>
          <img alt={u.name} className='gravatar' src={'https://secure.gravatar.com/avatar/'+u.gravatar_id+'?s='+u.size} />
          <a href={'/users/'+u.id}>{u.name}</a>
          {
            current_user.value.admin && current_user.value.id !== u.id ? (
              <>
              | <a href={'#/users/'+u.id} onClick={() => removeUser(u.id)}>delete</a>
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
        }
      </div>
    </div>
    </>
  )
}
