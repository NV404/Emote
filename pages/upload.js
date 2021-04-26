import Header from '../src/components/Header/header.js'
import { useAuth } from '../lib/auth'
import { useState } from 'react'
import { db, storage } from '../lib/firebase'
import { useRouter } from 'next/router'
import NotFound from '../src/components/NotFound/NotFound'
import firebase from "firebase/app";
import Head from 'next/head'

export default function Index() {
    const { user, loading } = useAuth();
    const [Image, setImage] = useState(null);
    const [ImagePreview, setImagePreview] = useState(null);
    const [Caption, setCaption] = useState(null);
    const [Progress, setProgress] = useState(0);
    const [showerror, setshowerror] = useState(false);
    const router = useRouter();
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

    const Checkinput = () => {
        if (Image != null && Caption != null) {
            setshowerror(false);
            uplaodpost();
        }
        else {
            setshowerror(true);
        }
    }

    const uplaodpost = () => {
        
        var randomtxt = randomstring.generate(10);
        var uploadTask = storage.ref(`images/${randomtxt+Image.name}`).put(Image);
        uploadTask.on('state_changed',
            (snapshot) => {

                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 1000
                );
                setProgress(progress);

                if (snapshot.bytesTransferred === snapshot.totalBytes) {
                    router.push("/");
                }
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
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: Caption,
                            imageUrl: url + "?alt=media",
                            username: user.displayName,
                            profileimage: user.photoURL,
                        });

                        setProgress(0);
                        setCaption(null);
                        setImage(null);
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
            <title>Upload Post</title>
        </Head>
            <Header />
            {loading == true ? 
            <> <div className="w-full flex justify-center item-center mt-40">
            <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            </div> </> : <>{user ? 
            <div className="mt-20 px-8">
            <div className="flex m-auto lg:w-96">
                {Image ?
                    <img src={ImagePreview} className=" rounded-lg shadow-xl m-auto" />
                    : <label className="w-full m-auto flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border-2 border-purple-700 cursor-pointer hover:bg-purple-700 hover:text-white lg:w-96">
                        <span className="mt-2 text-base leading-normal">Select a Image</span>
                        <input type='file' accept="image/*" onChange={addimage} className="hidden" />
                    </label>
                }
            </div>
            <div className='mt-7 flex flex-col m-auto lg:w-96'>
                <textarea placeholder="Caption" rows="5" onChange={(e) => setCaption(e.target.value)} className=" rounded-lg p-1 shadow-lg resize-none" ></textarea>
                <button className="bg-purple-700 px-10 py-2 text-white rounded-lg my-5 shadow-lg" onClick={Checkinput}>uplaodpost</button>
            </div>
            {showerror == true ? <p className="text-center font-bold text-red-700 font-xl uppercase">Image And Caption is Required</p> : null}
            {Progress != 0 ?
                <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                        <div style={{ width: Progress }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                    </div>
                </div>
                : null}
        </div>
            : <NotFound/> }</> }
        </>
    )
}