import Header from '../src/components/Header/header.js'
import { useAuth } from '../lib/auth'
import { useState } from 'react'
import { auth, storage, db } from '../lib/firebase'
import NotFound from '../src/components/NotFound/NotFound'
import Router from 'next/router'
import Head from 'next/head'

export default function Index() {

    const { user, loading, signout } = useAuth();
    const [Image, setImage] = useState(null);
    const [ImagePreview, setImagePreview] = useState(null);
    const [Progress, setProgress] = useState(0);
    var randomstring = require("randomstring");

    const addimage = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            var reader = new FileReader();
            reader.onload = function () {
                var dataURL = reader.result;
                setImagePreview(dataURL);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const uplaodpost = () => {
        var randomtxt = randomstring.generate(10);
        var uploadTask = storage.ref(`images/${randomtxt+Image.name}`).put(Image);
        uploadTask.on('state_changed',
            (snapshot) => {

                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 1000
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(randomtxt+Image.name)
                    .getDownloadURL()
                    .then((url) => {
                        auth.currentUser.updateProfile({
                            photoURL: url + "?alt=media",
                        })
                        db.collection("users")
                        .doc(auth.currentUser.displayName).update({
                            profileimage: url + "?alt=media",
                        })
                        setImage(null);
                        setImagePreview(null);
                        setProgress(0);
                        Router.push('/');
                    })
            },
            (error) => {
                // Handle unsuccessful uploads
            }
        );
    }


    return (
        <>
        <Head>
            <title>Profile</title>
        </Head>
            <Header />
            {loading == true ?
                <div className="w-full flex justify-center item-center mt-40">
                    <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                </div> : <>{user ?

                    <>
                        <div className="mt-20 mx-10 rounded-xl bg-white pt-5 shadow-xl max-w-xs mx-auto">
                            <div className="flex flex-col justify-center items-center px-5">
                                <img className="w-full rounded-lg" src={user.photoURL} />
                                {Progress != 0 ?
                    <div className="w-full relative pt-1">
                        <div className="w-full overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                            <div style={{ width: Progress+"%" }} className="w-full shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                        </div>
                    </div>
                    : null}
                                {ImagePreview != null ? <img className=" rounded-lg mt-5" src={ImagePreview} /> : null}
                                {Image != null ? <button className="bg-purple-800 px-5 py-2 text-white rounded-lg my-5" onClick={uplaodpost}>Upload</button> : 
                                <label className="bg-purple-800 px-5 py-2 text-white rounded-lg my-5">
                                <p>Change Image</p>
                            <input type='file' accept="image/*" onChange={addimage} className="hidden" />
                            </label>
                                }
                                <h1 className="font-bold text-xl">Profile</h1>
                            </div>
                            <div className="pl-4 mt-5">
                                <p className='py-2'><b>UserName:</b> {user.displayName}</p>
                                <p className='py-2'><b>Email:</b> {user.email}</p>
                            </div>
                            <div className="flex justify-center">
                                <button className="bg-red-500 px-10 py-2 text-white rounded-lg my-5" onClick={signout}>Log Out</button>
                            </div>
                        </div>
                    </>

                    : <NotFound/>
                }</>}
        </>
    )
}
