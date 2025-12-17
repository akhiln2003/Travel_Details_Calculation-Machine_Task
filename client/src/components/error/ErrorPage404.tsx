
const ErrorPage404 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black dark:text-white">404</h1>
        <p className="text-2xl text-gray-700 dark:text-gray-500 mt-4">Oops! Page Not Found</p>
        <p className="text-lg text-gray-500 dark:text-gray-300 mt-2">
          Sorry, the page you are looking for doesn't exist.
        </p>
        {/* <a
          href="/"
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400"
        >
          Go to Homepage
        </a> */}
      </div>
    </div>
  );
};

export default ErrorPage404;
