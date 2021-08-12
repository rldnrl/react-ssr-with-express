# React SSR with Express
## 처음부터 서버 사이드 렌더링 구현해보기

> 시작 동기<br> Next.js가 어떻게 돌아가는지 궁금해서


### 막혔던 부분
Redux State를 주입해야하는데 다음과 같은 에러를 만났다.<br>
```
ReferenceError: window is not defined
```

✅ index.server.tsx 내부에서 window를 써서 그런 듯<br>

---

```ts
// Users.tsx
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Preloader } from '../libs/PreloadContext'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getUsers, selectUsers } from '../store/users/userSlice'

const Users = () => {
  ...
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

...

export default Users

```
✅ thunk를 이용한 prefetching이 되지 않는다.<br>

```
// before
<Preloader resolve={getUsers} />

// after
<Preloader resolve={() => dispatch(getUsers())} />
```

너무 당연하지만, `dispatch`를 해서 `users`를 채운 후에 해야하는 건데 그 부분을 놓쳤다.
