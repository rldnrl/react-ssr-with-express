# React SSR with Express
## 처음부터 서버 사이드 렌더링 구현해보기

> 시작 동기<br> Next.js가 어떻게 돌아가는지 궁금해서


### 막혔던 부분
Redux State를 주입해야하는데 다음과 같은 에러를 만났다.<br>
```
ReferenceError: window is not defined
```

$\rightarrow$ index.server.tsx 내부에서 window를 써서 그런 듯(해결)