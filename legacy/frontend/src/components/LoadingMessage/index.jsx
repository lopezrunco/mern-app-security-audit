function LoadingMessage({title, message}) {
  return (
    <div className="text-center">
        <p><b>{title}</b></p>
        <p>{message}</p>
    </div>
  )
}

export default LoadingMessage