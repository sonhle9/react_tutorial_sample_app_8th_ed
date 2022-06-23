// import { NextPage } from 'next'
// import { useRouter } from 'next/router'
// import React, { useCallback, useEffect, useState } from 'react'
// import Pagination from 'react-js-pagination'
// import { useAppSelector } from '../../../redux/hooks'
// import { selectUser } from '../../../redux/session/sessionSlice'
// import micropostApi, { Micropost } from '../../../components/shared/api/micropostApi'
// import relationshipApi from '../../../components/shared/api/relationshipApi'
// import userApi from '../../../components/shared/api/userApi'
// import flashMessage from '../../../components/shared/flashMessages'
// import FollowForm from '../../../components/users/FollowForm'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import micropostApi, { Micropost } from '../../app/api/micropostApi'
import relationshipApi from '../../app/api/relationshipApi'
import userApi from '../../app/api/userApi'
import { useAppSelector } from '../../app/hooks'
import { selectUser } from '../../features/session/sessionSlice'
import flashMessage from '../shared/flashMessages'
import Pagination from 'react-js-pagination'
import FollowForm from './FollowForm'
import Stats from '../shared/Stats'

export default function Show() {
  const [user, setUser] = useState(Object)
  const [microposts, setMicroposts] = useState([] as Micropost[])
  const [id_relationships, setIdRelationships] = useState<any | null>(null)
  const [page, setPage] = useState(1)
  const [total_count, setTotalCount] = useState(1)
  const current_user = useAppSelector(selectUser)
  let { id } = useParams()
  
  const setWall= useCallback(async () => { 
    userApi.show(id as string, {page: page}
    ).then(response => {
      if (response.user) {
        setUser(response.user)
        setMicroposts(response.microposts)
        setTotalCount(response.total_count)
        setIdRelationships(response.id_relationships)
      } else {
        setUser({})
        setMicroposts([])
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [page, id])

  useEffect(() => {
    if (id) { setWall() }
  }, [setWall, id])

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setPage(pageNumber)
  }

  const handleFollow = (e: { preventDefault: () => void }) => {
    relationshipApi.create({followed_id: id}
    ).then(response => {
      if (response.follow) {
        setWall()
      }
    })
    .catch(error => {
      console.log(error)
    })
    e.preventDefault()
  }

  const handleUnfollow = (e: { preventDefault: () => void }) => {
    relationshipApi.destroy(id_relationships
    ).then(response => {
      if (response.unfollow) {
        setWall()
      }
    })
    .catch(error => {
      console.log(error)
    })
    e.preventDefault()
  }

  const removeMicropost = (micropostId: number) => {
    let sure = window.confirm('You sure?')
    if (sure === true) {
      micropostApi.remove(micropostId
      ).then(response => {
        if (response.flash) {
          flashMessage(...response.flash)
          setWall()
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  return (
    <div className='row'>
      <aside className='col-md-4'>
        <section>
          <h1>
            <img alt='Example User' className='gravatar' src={'https://secure.gravatar.com/avatar/'+user.gravatar_id+'?s='+user.size} />
            {user.name}
          </h1>
        </section>
        <section className='stats'>
          <Stats
            id={user.id}
            following={user.following}
            followers={user.followers}
          />
        </section>
      </aside>

      <div className='col-md-8'>
        {current_user && current_user.value.id !== parseInt(id as string) &&
        <FollowForm
          id={id as string}
          user={user}
          handleUnfollow={handleUnfollow}
          handleFollow={handleFollow}
        />
        }
        {microposts.length > 0 &&
        <>
        <h3>{'Microposts ('+total_count+')'}</h3>
        <ol className='microposts'>
          { microposts.map((i, t) => (
              <li key={t} id= {'micropost-'+i.id} >
                <a href={'/users/'+user.id}>
                  <img alt={i.user_name} className='gravatar' src={'https://secure.gravatar.com/avatar/'+user.gravatar_id+'?s=50'} />
                </a>
                <span className='user'><a href={'/users/'+i.user_id}>{user.name}</a></span>
                <span className='content'>
                  {i.content}
                  { i.image &&
                    <img alt='Example User' src={''+i.image+''} />
                  }
                </span>
                <span className='timestamp'>
                {'Posted '+i.timestamp+' ago. '}
                {current_user.value.id === i.user_id &&
                  <a href={'#/microposts/'+i.id} onClick={() => removeMicropost(i.id)}>delete</a>
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
        }
      </div>
    </div>
  )
}