import { useAuth } from '../../../lib/auth'
import Image from 'next/image'
import Link from 'next/link'

export default function header() {
const { user } = useAuth();

  return (
    <div className="absolute top-0 w-full left-0 flex py-3 items-center bg-white justify-evenly lg:px-10">
      <Link href='/'>
        <a>
      <div className="flex items-center justify-center cursor-pointer">
        <Image height="40px" width="40px" loading="eager" src="/static/images/logo.png" alt="logo" />
        <p className="font-bold text-xl">Emote</p>
      </div>
      </a>
      </Link>
      {user ?
        <Link href="/Profile">
          <a>
          <button className="flex justify-center items-center border-2 blue-700 border-blue-700 rounded-lg px-3">
            <img className="h-9 w-9 rounded-full" src={user.photoURL} />
            <p className="pl-2 font-bold text-md">Profile</p>
          </button>
          </a>
        </Link>
        : <div>
          
        </div>}
    </div>
  )
}
