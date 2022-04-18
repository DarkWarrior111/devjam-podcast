import React from 'react'

const ErrorMessage = ({
  message,
  retry,
}: {
  message: string
  retry?: () => void
}) => {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center">
      <div className="text-lg font-bold text-red-500">{message}</div>
      {retry && (
        <button
          className="rounded bg-green-500 px-2 py-1 font-bold text-white drop-shadow hover:scale-105 active:scale-95"
          onClick={() => retry()}
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
