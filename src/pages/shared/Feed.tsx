import { Key } from 'react'
import Pagination from 'react-js-pagination'
import { Link } from 'react-router-dom'
import { Micropost } from '../../app/api/micropostApi'
import { UserState } from '../../features/session/sessionSlice'

const Feed: React.FC<{
  feed_items: Micropost[]
  userData: UserState
  removeMicropost: any
  page: number
  total_count: number
  handlePageChange: any
}> = ({ feed_items, userData, removeMicropost, page, total_count, handlePageChange }) => {
  return (
    <>
      <ol className='microposts'>
        { feed_items.map((i:any, t: Key | null | undefined) => (
            <li key={t} id= {'micropost-'+i.id} >
              <Link to={'/users/'+i.user_id}>
                <img alt={i.user_name} className='gravatar' src={'https://secure.gravatar.com/avatar/'+i.gravatar_id+'?s='+i.size} />
              </Link>
              <span className='user'><Link to={'/users/'+i.user_id}>{i.user_name}</Link></span>
              <span className='content'>
                {i.content}
                { i.image &&
                  <img alt='Example User' src={''+i.image+''} />
                }
              </span>
              <span className='timestamp'>
              {'Posted '+i.timestamp+' ago. '}
              {userData.value.id === i.user_id &&
                <Link to={'#/microposts/'+i.id} onClick={() => removeMicropost(i.id)}>delete</Link>
              }
              </span>
            </li>
        ))}
      </ol>

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

export default Feed
