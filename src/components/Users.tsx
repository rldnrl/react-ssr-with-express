import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Preloader } from '../libs/PreloadContext'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getUsers, selectUsers } from '../store/users/userSlice'

const Users = () => {
  const { users } = useAppSelector(selectUsers)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (users) return
    dispatch(getUsers())
    console.log("실행");
  }, [dispatch, users])

  return (
    <>
      <div>
        <ul>
          {users?.map((user) => (
            <User
              key={user.id}
              userId={user.id}
              username={user.username}
            />
          ))}
        </ul>
      </div>
      <Preloader resolve={() => dispatch(getUsers())} />
    </>
  )
}

type UserProps = {
  userId: number
  username: string
}

const User = ({ userId, username }: UserProps) => {
  return (
    <li>
      <Link to={`/users/${userId}`}>{username}</Link>
    </li>
  )
}

export default Users
