import Router from 'next/router'

export default function NotFound(){
    return(
        <>
        <div className="mt-20 mx-6 bg-purple-800 text-white rounded-xl shadow-xl p-10 flex items-center flex-col lg:w-96 lg:mx-auto">
            <p className="font-bold text-9xl">404</p>
            <p>Not Found</p>
            <button className="bg-white px-10 py-2 text-purple-800 rounded-lg my-5" onClick={() => Router.push('/')}>Home</button>
        </div>
        </>
    )
}