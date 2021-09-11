# React SSR with Express
## 사용한 기술 스택

> React, TypeScript, Redux-Toolkit, React-Query, Express

## 처음부터 서버 사이드 렌더링 구현해보기

> 시작 동기<br> Next.js가 어떻게 돌아가는지 궁금해서


### 막혔던 부분
Redux State를 주입해야하는데 다음과 같은 에러를 만났다.<br>
```
ReferenceError: window is not defined
```

✅ index.server.tsx 내부에서 window를 써서 그런 듯<br>

---

<br>

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

---

<br>

✅ `loadable` 이용해서 `code-splitting` 적용 <br />
✅ `React-Query` 적용

---

<br />

### 아이소모픽
브라우저가 아닌 **플랫폼(여러 플랫폼)**에서 리액트를 렌더링한다는 뜻이다. 구체적으로 UI를 서버에서 렌더링한 결과를 브라우저에 보내서 표시한다는 뜻이다. 서버 렌더링의 강점을 살리면서 애플리케이션의 성능, 이식성, 보안을 향상시킬 수 있다.

<br/>

### 유니버셜
완전히 같은 코드를 여러 환경에서 실행할 수 있다. 오류 없이 서버와 브라우저에서 실행될 수 있는 자바스크립트 코드를 말한다.

<br/>

### RenderDOM.hydrate
render와 hydrate는 동일하다. 연산 과정은 다음과 같다.
1. 앱의 정적인 버전을 렌더링한다. 이를 통해 페이지가 완전히 로딩 되기 전에 무언가 사용자에게 보여줄 수 있다.
2. 동적 자바스크립트를 요청한다
3. 정적 콘텐츠를 동적 콘텐츠로 교체한다
4. 사용자가 콘텐츠 각 부분을 클릭하거나 키보드로 입력하면 제대로 동작한다.

서버 쪽 렌더링이 끝난 다음 앱을 `rehydrate` 시킨다. `rehydrate`는 콘텐츠를 정적 HTML로 정적 로딩한다는 말이다. 이로 인해 사용자는 우리가 원하는 성능을 느낄 수 있다.
