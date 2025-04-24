'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Todo App</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4 ml-10">
              <Link
                href="/todos"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/todos'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos
              </Link>
              <Link
                href="/calendar"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/calendar'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Calendar
              </Link>
              <Link
                href="/board"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/board'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Board
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="ml-4 bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 