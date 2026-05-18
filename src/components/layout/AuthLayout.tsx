import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[40%] bg-[#2D4A3E] relative p-8 flex-col">
        <Link to="/" className="flex items-center gap-0 cursor-pointer">
          <span className="font-bold text-2xl text-white">Nexora</span>
          <span className="text-[#C9A84C]">.</span>
        </Link>

        <div className="mt-16">
          <h1 className="text-3xl font-bold text-white leading-tight">
            Aprende.
            <br />
            Certifícate.
            <br />
            Consigue el trabajo.
          </h1>
          <p className="mt-6 text-white/70">
            Únete a más de 12,000 profesionales que ya están aprendiendo con Nexora.
          </p>
        </div>

        <div className="mt-auto flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#2D4A3E] bg-[#4A7C59] flex items-center justify-center text-white font-medium">M</div>
            <div className="w-10 h-10 rounded-full border-2 border-[#2D4A3E] bg-[#4A7C59] flex items-center justify-center text-white font-medium">C</div>
            <div className="w-10 h-10 rounded-full border-2 border-[#2D4A3E] bg-[#4A7C59] flex items-center justify-center text-white font-medium">T</div>
          </div>
          <span className="text-white/70 text-sm">+12,000 estudiantes activos</span>
        </div>

        <div className="absolute w-96 h-96 rounded-full border border-white/10 -bottom-20 -right-20" />
      </div>

      <div className="lg:w-[60%] w-full bg-[#FAF7EF] flex flex-col">
        <div className="lg:hidden border-b border-[#E8E0D0] px-6 py-4 bg-[#FAF7EF]">
          <Link to="/" className="flex items-center gap-0 cursor-pointer">
            <span className="font-bold text-xl text-[#2D4A3E]">Nexora</span>
            <span className="text-[#C9A84C]">.</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="max-w-md w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}