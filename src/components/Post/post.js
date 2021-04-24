import Link from 'next/link'

export default function post({
  id,
  username,
  imageUrl,
  caption,
  profileimage
}) {

  return (
    <div className="w-full mx-auto my-5 px-4 py-3 bg-white rounded-lg shadow-xl tracking-wide uppercase ">
      <Link href={'/User/'+username}>
      <div className="flex items-center">
        <img className="h-9 w-9 rounded-full cursor-pointer" src={profileimage} />
        <p className="font-bold ml-3 cursor-pointer">{username}</p>
      </div>
      </Link>
      <img src={imageUrl} className="rounded-xl my-2 mx-auto"/>
      <p><b>{username} :</b> {caption}</p>
    </div>
  )
}
