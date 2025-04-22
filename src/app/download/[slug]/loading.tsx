export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] p-4">
      <div className="bg-[#161b22] rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-3xl font-extrabold mb-2 text-gray-100">
          Preparando seu download
        </h1>
        <p className="text-gray-300">
          Por favor, aguarde enquanto preparamos seu ebook...
        </p>
      </div>
    </div>
  );
} 