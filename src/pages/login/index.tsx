
export function Login() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto w-12 rounded-full md:w-24 lg:w-36" src="/src/assets/logo.png" alt="logo" />
        <h2 className="mt-10 text-center text-sm font-semibold leading-9 tracking-tight text-gray-900 md:text-lg lg:text-xl">Login Dashboard Gabi Raposo</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-500">Digite seu usuário</label>
            <div className="mt-2">
              <input type="email" name="email" id="email" required className="block w-full rounded-md border-2 border-gray-400 py-1 px-2 text-gray-600 md:text-sm"/>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mt-2">
              <label htmlFor="pw" className="block text-sm font-bold text-gray-500">Digite sua senha</label>
            </div>
            <div className="mt-2">
              <input type="pw" name="pw" id="pw" autoComplete="show-password" required className="block w-full rounded-md border-2 border-gray-400 py-1 px-2 text-gray-600 md:text-sm" />
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-lg bg-wine-black px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-95 hover:shadow-lg hover:border-black ">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}
