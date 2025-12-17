
const ErrorPage500 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="text-center">
        <h1 className="text-6xl font-bold  text-black dark:text-white">500</h1>
        <p className="text-2xl text-gray-700 dark:text-gray-500  mt-4">Internal Server Error</p>
        <p className="text-lg text-gray-500 dark:text-gray-300 mt-2">
          Something went wrong on our end. Please try again later.
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

export default ErrorPage500;
