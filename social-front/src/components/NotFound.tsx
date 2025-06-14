const NotFound = () => {
  return (
    <div
      className='not-found-container'
      style={{ textAlign: 'center', marginTop: '50px' }}
    >
      <h1>404</h1>
      <p>Page Not Found</p>
      <a href='/' className=''>
        Go back to Home
      </a>
    </div>
  );
};

export default NotFound;
