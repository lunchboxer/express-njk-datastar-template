document.addEventListener('click', event => {
  const target = event.target.closest('a')

  if (target?.href && target.origin === window.location.origin) {
    event.preventDefault()
    history.pushState(null, '', target.href)
  }
})
