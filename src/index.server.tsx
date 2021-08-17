import React from 'react'
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from 'react-router-dom'
import express, { Request, Response, NextFunction } from 'express'
import App from './App'
import path from 'path'
import { Provider } from "react-redux";
import thunk from 'redux-thunk'
import { applyMiddleware, createStore } from "@reduxjs/toolkit";
import PreloadContext from "./libs/PreloadContext";
import rootReducer from "./store/rootReducer";
import { QueryClient, QueryClientProvider } from "react-query";
import { dehydrate, Hydrate } from 'react-query/hydration'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import { fetchUsers } from "./components/Users";

// asset-manifest.json에서 파일 경로들을 조회한다.
// const manifest = JSON.parse(
//   fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8')
// )

// const chunks = Object.keys(manifest.files)
//   .filter(key => /chunk\.js$/.exec(key))
//   .map(key => `<script src=${manifest.files[key]}></script>`)
//   .join('')

const statsFile = path.resolve('./build/loadable-stats.json')

function createPage(root: string, tags: any): string {
  return `
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content="#000000" />
      <title>React Redux App</title>
      ${tags.styles}
      ${tags.links}
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">
        ${root}
      </div>
      ${tags.scripts}
    </body>
  </html>
  
  `
}

const app = express()

// SSR을 처리할 핸들러 함수
const serverRender = async (req: Request, res: Response, next: NextFunction) => {
  // 이 함수는 404가 떠야하는 상황에서 404를 띄우지 않고 SSR을 한다.

  const context = {}
  const store = createStore(rootReducer, applyMiddleware(thunk))
  const preloadContext = {
    done: false,
    promises: []
  }

  const extractor = new ChunkExtractor({ statsFile })

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery('users', fetchUsers)
  const dehydratedState = dehydrate(queryClient)

  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <PreloadContext.Provider value={preloadContext}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
              <StaticRouter location={req.url} context={context}>
                <App />
              </StaticRouter>
            </Hydrate>
          </QueryClientProvider>
        </Provider>
      </PreloadContext.Provider>
    </ChunkExtractorManager>
  )

  ReactDOMServer.renderToStaticMarkup(jsx)

  try {
    await Promise.all(preloadContext.promises)
  } catch (error) {
    return res.status(500)
  }
  preloadContext.done = true
  const root = ReactDOMServer.renderToString(jsx) // 렌더링하고

  // JSON -> 문자열
  // 악성 스크립트가 실행되는 것을 방지하기 위해서 <를 치환 처리한다.
  const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c')
  const stateScript = `
    <script>__REDUX_STATE__=${stateString}</script>
    <script>__REACT_QUERY_STATE__=${JSON.stringify(dehydratedState)}</script>
  ` // 리덕스 초기 상태와 React-Query 초기 상태를 스크립트로 주입한다.

  const tags = {
    scripts: stateScript + extractor.getScriptTags(), // 스크립트 앞 부분에 리덕스와 React-Query 상태 넣기
    links: extractor.getLinkTags(),
    styles: extractor.getStyleTags()
  } as any

  res.send(createPage(root, tags)) // 결과물을 응답
}

const serve = express.static(path.resolve('./build'), {
  index: false
})

app.use(serve)
app.use(serverRender)

app.listen(5000, () => {
  console.log('Running on http://localhost:5000');
})