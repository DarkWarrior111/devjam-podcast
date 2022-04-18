import Head from 'next/head'
import React from 'react'

const NotFound = () => {
  return (
    <div className="absolute inset-0 text-center dark:text-white">
      <Head>
        <title>404 | Not Found</title>
      </Head>
      <h1 className="mt-[40vh] text-3xl font-extrabold">404 | Not Found</h1>
    </div>
  )
}

export default NotFound
