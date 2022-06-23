import { Link } from 'react-router-dom'

const Stats: React.FC<{
  id: number
  following: number
  followers: number
}> = ({ id, following, followers }) => {
  return (
    <div className='stats'>
      <Link to={'/users/'+id+'/following'}>
        <strong id='following' className='stat'>
          {following}
        </strong> following
      </Link>
      <Link to={'/users/'+id+'/followers'}>
        <strong id='followers' className='stat'>
          {followers}
        </strong> followers
      </Link>
    </div>
  )
}

export default Stats