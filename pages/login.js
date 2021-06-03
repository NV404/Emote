import { useState } from "react";
import { useAuth } from '../lib/auth'
import Header from '../src/components/Header/header.js'
import Router from 'next/router'
import Head from 'next/head'
import { db } from '../lib/firebase'


export default function authenticate() {
    const { signin, register, user, errorMessage } = useAuth();
    const [login, setlogin] = useState(true);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [loginshowerror, setloginshowerror] = useState(null)
    const [registershowerror, setregistershowerror] = useState(null)

    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var usernameformat = /^(?=[a-zA-Z0-9._]{4,12}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    const signinuser = () => {
        if (email != null && password != null) {
            if (email.match(mailformat) && password.length >= 6) {
                setloginshowerror(null);
                signin(email,password)
            }
            else{
                setloginshowerror(<p className='text-center text-red-700 font-bold'>*Email Required<br/>*Password length Must be at least 6 Letters</p>);
            }
        } else {
            setloginshowerror(<p className='text-center text-red-700 font-bold'>*Email Required<br/>*Password length Must be at least 6 Letters</p>);
        }
        
    }

    const registeruser = () => {
        if (email != null && password != null && username != null) {
            if (email.match(mailformat) && password.length >= 6 && username.match(usernameformat)) {
                setregistershowerror(null);
                db.collection("users")
            .doc(username)
            .onSnapshot((snapshot) => {
                {snapshot.data() == undefined ? register(email,password,username) : setregistershowerror(<p className="text-center text-red-700 font-bold">*Username Already Taken</p>);}
            },(error) =>{
                console.log(error)
            });
            setregistershowerror(null);
            }
            else{
                setregistershowerror(<p className="text-center text-red-700 font-bold">*Email Required<br/>*Password length Must be at least 6 Charaters<br/>*Username lenght 4-12 Charaters without Space without _ or . in end and beginning</p>);
            }
        } else {
            setregistershowerror(<p className="text-center text-red-700 font-bold">*Email Required<br/>*Password length Must be at least 6 Charaters<br/>*Username lenght 4-12 Charaters without Space without _ or . in end and beginning</p>);
        }
    }

    if (user) {
        Router.push("/");
    }


    return (
        <>
        <Head>
            <title>Login</title>
        </Head>
        <Header></Header>
        <div className="bg-white flex flex-col mt-40 mx-10 px-8 py-10 rounded-lg lg:w-96 lg:mx-auto">
            <h3 className="text-center font-bold text-xl mb-3">{login == false ? "REGISTER" : "LOG IN" }</h3>
            <div className="relative flex w-full flex-wrap items-stretch mb-3">
                <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"></span>
                <input onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full " />
            </div>
            <div className="relative flex w-full flex-wrap items-stretch mb-3">
                <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"></span>
                <input onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full " />
            </div>

            {login == false ? <div className="relative flex w-full flex-wrap items-stretch mb-3">
                <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"></span>
                <input onChange={(e) => setUsername((e.target.value).toLowerCase())} required type="text" placeholder="UserName" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full " />
            </div> : <></> }

            {login == false ? 
            <><button onClick={registeruser} className=" px-10 py-2 bg-blue-700 text-white rounded-lg mb-3">Register</button>
             <button className="border-2 px-10 py-2 text-blue-700 rounded-lg mb-3 border-blue-700" onClick={() => setlogin(true)}>Login</button></>
            : <> <button className="bg-blue-700 px-10 py-2 text-white rounded-lg mb-3" onClick={signinuser}>Login</button>
            <button className="border-2 px-10 py-2 text-blue-700 border-blue-700 rounded-lg mb-3" onClick={() => setlogin(false)}>Register</button> </> }
            {loginshowerror? loginshowerror : null}
            {errorMessage? <p className='text-center text-red-700 font-bold'>{errorMessage}</p> : null}
            {registershowerror? registershowerror : null}
            <p className="text-center font-bold" >Created with ❤️ By Naman</p>
        </div>
        </>
    )
}
