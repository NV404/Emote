import Link from 'next/link'
import { useState } from 'react'

export default function post({
  id,
  username,
  imageUrl,
  caption,
  profileimage
}) {
  const [imageLoaded, setimageLoaded] = useState(false)

  return (
    <div className="w-full mx-auto my-5 px-4 py-3 bg-white rounded-lg shadow-xl tracking-wide uppercase ">
      <Link href={'/User/'+username}>
        <a>
      <div className="flex items-center">
        <img className="h-9 w-9 rounded-full cursor-pointer" src={profileimage}/>
        <p className="font-bold ml-3 cursor-pointer">{username}</p>
      </div>
      </a>
      </Link>
      <div>
        {imageLoaded ?  null : <div className="h-80 animate-pulse w-full rounded-xl mx-auto bg-purple-800 "></div>}
      <img src={imageUrl} className="rounded-xl my-2 mx-auto"  onLoad={() => setimageLoaded(true)}/>
      </div>
      <p><b>{username} :</b> {caption}</p>
    </div>
  )
}
