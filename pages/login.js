import { useState } from "react";
import { useAuth } from '../lib/auth'
import Header from '../src/components/Header/header.js'
import Router from 'next/router'


export default function authenticate() {
    const { signin, register, user } = useAuth();
    const [login, setlogin] = useState(true);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [loginshowerror, setloginshowerror] = useState(false)
    const [registershowerror, setregistershowerror] = useState(false)

    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var usernameformat = /^(?=[a-zA-Z0-9._]{4,12}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    const signinuser = () => {
        if (email != null && password != null) {
            if (email.match(mailformat) && password.length >= 6) {
                setloginshowerror(false);
                signin(email,password)
            }
            else{
                setloginshowerror(true);
            }
        } else {
            setloginshowerror(true);
        }
        
    }

    const registeruser = () => {
        if (email != null && password != null && username != null) {
            if (email.match(mailformat) && password.length >= 6 && username.match(usernameformat)) {
                setregistershowerror(false);
                register(email,password,username);
            }
            else{
                setregistershowerror(true);
            }
        } else {
            setregistershowerror(true);
        }
    }

    if (user) {
        Router.push("/");
    }


    return (
        <>
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
                <input onChange={(e) => setUsername(e.target.value)} required type="text" placeholder="UserName" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full " />
            </div> : <></> }

            {login == false ? 
            <><input type="submit" value="Register" onClick={registeruser} className=" px-10 py-2 bg-blue-700 text-white rounded-lg mb-3"/>
             <button className="border-2 px-10 py-2 text-blue-700 rounded-lg mb-3 border-blue-700" onClick={() => setlogin(true)}>Login</button></>
            : <> <button className="bg-blue-700 px-10 py-2 text-white rounded-lg mb-3" onClick={signinuser}>Login</button>
            <button className="border-2 px-10 py-2 text-blue-700 border-blue-700 rounded-lg mb-3" onClick={() => setlogin(false)}>Register</button> </> }
            {loginshowerror == true? <p className="text-center text-red-700 font-bold">*Email Required<br/>*Password length Must be at least 6 Letters</p> : null}
            {registershowerror == true? <p className="text-center text-red-700 font-bold">*Email Required<br/>*Password length Must be at least 6 Charaters<br/>*Username lenght 4-12 Charaters without Space without _ or . in end and beginning</p> : null}
            <p className="text-center font-bold" >Created with ❤️ By Naman</p>
        </div>
        </>
    )
}
