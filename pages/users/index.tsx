import { User } from '@/models/user'
import React, { useEffect, useState } from 'react'

const Users = () => {
  const [users, setUsers] = useState<User[]>()

  const generateFullName = (g: string, m: string, f: string) => `${g} ${m} ${f}` 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/users')
        const data = await res.json()

        setUsers(data.users)
      } catch (e) {
        console.error(e);
      }
    }

    fetchData();
  }, [])

  return (
    <div className='mx-auto mt-[120px] w-[60vw]'>
      <h1 className='text-2xl mb-[32px]'> SCIM Users </h1>
      {users && (
        <ul>
          {users.map((user: User) => (
            <li
              key={user.id}
              className="py-[12px] border-b"
            >
              {generateFullName(user.givenName, user.middleName || "", user.familyName)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Users
