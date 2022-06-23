import React, { useMemo } from 'react'
import { MutableRefObject, SetStateAction, Suspense, useCallback, useDeferredValue, useEffect, useRef, useState, useTransition } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import micropostApi, { CreateResponse, ListResponse, Micropost } from '../app/api/micropostApi'
import { useAppSelector } from '../app/hooks'
import { selectUser } from '../features/session/sessionSlice'
import logoReactRedux from '../logo.svg'
import logoReact from './logo.svg'
import errorMessage from './shared/errorMessages'
import flashMessage from './shared/flashMessages'
import { Spinner } from './shared/Spinner'
import Stats from './shared/Stats'
// import loadable from '@loadable/component';
// Selected all Import Line section --> Alt + Shift + O  --> Sort by alphabet

// https://loadable-components.com/
// const Feed = loadable(() => import('./shared/Feed'),
const Feed = React.lazy(() => import('./shared/Feed'))

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [page, setPage] = useState(1)
  const [feed_items, setFeedItems] = useState([] as Micropost[])
  const deferredValue = useDeferredValue(feed_items)
  const [total_count, setTotalCount] = useState(1)
  const [following, setFollowing] = useState(Number)
  const [followers, setFollowers] = useState(Number)
  const [micropost, setMicropost] = useState(Number)
  const [gravatar, setGavatar] = useState(String)
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imageName, setImageName] = useState('')
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>
  const inputImage = useRef() as MutableRefObject<HTMLInputElement>
  const [errors, setErrors] = useState([] as string[])
  const userData = useAppSelector(selectUser)

  const setFeeds= useCallback(async () => {
    startTransition(() => {
    setIsLoading(true)
    micropostApi.getAll({page: page}
    ).then((res: ListResponse<Micropost>) => {
      if (res.feed_items) {
        setFeedItems(res.feed_items)
        setTotalCount(res.total_count)
        setFollowing(res.following)
        setFollowers(res.followers)
        setMicropost(res.micropost)
        setGavatar(res.gravatar)
      } else {
        setFeedItems([])
      }
      setIsLoading(false)
    })
    .catch((error: any) => {
      console.log(error)
      setIsLoading(false)
    })
    })
  }, [page])

  useEffect(() => {
    if (!userData.loggedIn) return
    setFeeds()
  }, [setFeeds, userData.loggedIn])

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setPage(pageNumber)
  }

  const handleContentInput = (e: { target: { value: SetStateAction<string> } }) => {
    setContent(e.target.value)
  }

  const handleImageInput = (e: any) => {
    if (e.target.files[0]) {
      const size_in_megabytes = e.target.files[0].size/1024/1024
      if (size_in_megabytes > 512) {
        alert('Maximum file size is 512MB. Please choose a smaller file.')
        setImage(null)
        e.target.value = null
      } else {
        setImage(e.target.files[0])
        setImageName(e.target.files[0].name)
      }
    }
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    setIsLoading(true)
    const formData2 = new FormData()
    formData2.append('micropost[content]',
      content
    )
    if (image) {
    formData2.append('micropost[image]',
      image || new Blob(),
      imageName
    )
    }

    var BASE_URL = ''
    if (process.env.NODE_ENV === 'development') {
      BASE_URL = 'http://localhost:3003/api'
    } else if (process.env.NODE_ENV === 'production') {
      BASE_URL = 'https://railstutorialapi.herokuapp.com/api'
    }

    fetch(BASE_URL+`/microposts`, {
      method: 'POST',
      body: formData2,
      credentials: 'include',
      headers: {
        'Authorization': localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined' ?
        `Bearer ${localStorage.getItem('token')} ${localStorage.getItem('remember_token')}` :
        `Bearer ${sessionStorage.getItem('token')} ${sessionStorage.getItem('remember_token')}`
      }
    })
    .then((res: any) => res.json().then((data: CreateResponse) => {
      
      if (data.flash) {
        inputEl.current.blur()
        flashMessage(...data.flash)
        setContent('')
        setImage(null)
        inputImage.current.value = ''
        setErrors([])
        setFeeds()
        setIsLoading(false)
      }
      if (data.error) {
        inputEl.current.blur()
        setErrors(data.error)
        setIsLoading(false)
      }

    })
    )

    e.preventDefault()
  }

  const feeds = useMemo(() => {
    const removeMicropost = (micropostId: number) => {
      setIsLoading(true)
      let sure = window.confirm('You sure?')
      if (sure === true) {
        micropostApi.remove(micropostId
        ).then(res => {
          if (res.flash) {
            flashMessage(...res.flash)
            setFeeds()
          }
          setIsLoading(false)
        })
        .catch((error: any) => {
          console.log(error)
        })
      } else {
        setIsLoading(false)
      }
    }
    return (
    <Feed
      feed_items={deferredValue}
      userData={userData}
      removeMicropost={removeMicropost}
      page={page}
      total_count={total_count}
      handlePageChange={handlePageChange}
    />
    )
  }, [deferredValue, page, setFeeds, total_count, userData])

  if (userData.status === 'loading') {
    return <>
      <Skeleton height={304} />
      <Skeleton circle={true} height={60} width={60} />
    </>
  }

  if (userData.error) {
    return (
      <h2>{userData.error}</h2>
    )
  }

  if (userData.loggedIn) {
    return (
      <div className='row'>
        {(isLoading || isPending) && <Spinner />}
        <aside className='col-md-4'>
          <section className='user_info'>
            <img alt={userData.value.name} className='gravatar' src={'https://secure.gravatar.com/avatar/'+gravatar+'?s=50'} />
            <h1>{userData.value.name}</h1>
            <span><Link to={'/users/'+userData.value.id}>view my profile</Link></span>
            <span>{micropost} micropost{micropost !== 1 ? 's' : ''}</span>
          </section>

          <section className='stats'>
            <Stats
              id={userData.value.id}
              following={following}
              followers={followers}
            />
          </section>

          <section className='micropost_form'>
            <form
            encType='multipart/form-data'
            action='/microposts'
            acceptCharset='UTF-8'
            method='post'
            onSubmit={handleSubmit}
            > 
              <Suspense fallback={<Spinner />}>
              { errors.length !== 0 &&
                errorMessage(errors)
              }
              </Suspense>
              <div className='field'>
                  <textarea
                  placeholder='Compose new micropost...'
                  name='micropost[content]'
                  id='micropost_content'
                  value={content}
                  onChange={handleContentInput}
                  >
                  </textarea>
              </div>
              <input disabled={isLoading} ref={inputEl} type='submit' name='commit' value='Post' className='btn btn-primary' data-disable-with='Post' />
              <span className='image'>
                <input
                ref={inputImage}
                accept='image/jpeg,image/gif,image/png'
                type='file'
                name='micropost[image]'
                id='micropost_image'
                onChange={handleImageInput}
                />
              </span>
            </form>
          </section>
        </aside>

        <div className='col-md-8'>
          <h3>Micropost Feed</h3>     
          {deferredValue.length > 0 &&
          <Suspense fallback={<Spinner />}>
            {feeds}
          </Suspense>
          }         
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='center jumbotron'>
          <h1>Welcome to the Sample App</h1>
          <h2>
          This is the home page for the <a href='https://reactjs.org/' target='_blank' rel='noopener noreferrer'>React Tutorial</a> sample application.
          </h2>
          <Link to='/signup' className='btn btn-lg btn-primary'>Sign up now!</Link>
      </div>
      <Link to='https://reactjs.org/' target='_blank'><img alt='React Redux logo' width='70' height='49.48' src={logoReact} className='App-logo2'/></Link>
      <Link to='https://react-redux.js.org/' target='_blank'><img alt='React Redux logo' width='70' height='49.48' src={logoReactRedux} className='App-logo'/></Link>
    </>
  )
}
