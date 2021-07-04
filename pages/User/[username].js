import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Header from '../../src/components/Header/header'
import { db } from '../../lib/firebase'
import Head from 'next/head'

export default function user() {
    const router = useRouter()
    const { username } = router.query;
    const [UserProfile, setUserProfile] = useState(null);

    useEffect(() => {
        db.collection("users")
            .doc(username)
            .onSnapshot((snapshot) => {
                setUserProfile(snapshot.data());
            });
    })

    return (
        <>
        <Head>
            <title>{username}</title>
        </Head>
            <Header />
            {UserProfile ?

                <div className="mt-20 mx-10 rounded-xl bg-white pt-5 shadow-xl max-w-xs mx-auto">
                    <div className="flex flex-col justify-center items-center px-5">
                        <img className="w-full rounded-lg" src={UserProfile.profileimage} />
                        <h1 className="font-bold text-xl">Profile</h1>
                    </div>
                    <div className="pl-4 my-5">
                        <p className='py-2'><b>Username :</b> {UserProfile.username}</p>
                    </div>
                </div>

                :
                <div className="w-full flex justify-center item-center mt-40">
                    <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                </div>
            }
        </>
    )
}

