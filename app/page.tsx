export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 font-sans px-4">
      <main className="flex flex-col items-center justify-center text-center gap-6 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
            Under Maintenance
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Alqaswamarine.com
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            We're currently performing maintenance to improve your experience.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            We'll be back online shortly. Thank you for your patience!
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>If you have any questions, please contact us at support@alqaswamarine.com</p>
        </div>
      </main>
    </div>
  );
}
