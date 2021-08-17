import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Preloader } from '../libs/PreloadContext'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getUsers, selectUsers } from '../store/users/userSlice'
import { useQuery } from 'react-query'
import axios from 'axios'
import { User } from '../types'

export const fetchUsers = async () => {
  try {
    const { data } = await axios.get<User[]>(
      "https://jsonplaceholder.typicode.com/users"
    );
    return data;
  } catch (error) {
    throw error;
  }
}

const Users = () => {
  // const { users } = useAppSelector(selectUsers)
  // const dispatch = useAppDispatch()

  // useEffect(() => {
  //   if (users) return
  //   dispatch(getUsers())
  //   console.log("실행");
  // }, [dispatch, users])

  const { data: users, refetch } = useQuery('users', fetchUsers)

  return (
    <>
      <div>
        <ul>
          {users?.map((user) => (
            <UserComponent
              key={user.id}
              userId={user.id}
              username={user.username}
            />
          ))}
        </ul>
      </div>
      <Preloader resolve={refetch} />
    </>
  )
}

type UserComponentProps = {
  userId: number
  username: string
}

const UserComponent = ({ userId, username }: UserComponentProps) => {
  return (
    <li>
      <Link to={`/users/${userId}`}>{username}</Link>
    </li>
  )
}

export default Users
