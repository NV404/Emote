import React, { useState, useEffect, useContext, createContext } from 'react';
import { auth,db } from './firebase';
import Router from 'next/router'

const authContext = createContext();

export function AuthProvider({ children }) {
  const authsuer = useFirebaseAuth();
  return <authContext.Provider value={authsuer}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, seterrorMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);


  const register = (email, password, username) => {
    auth.createUserWithEmailAndPassword(email, password).then((authuserr) => {
        return authuserr.user.updateProfile({
            displayName: username,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/emote-8f3bc.appspot.com/o/images%2Favater.gif?alt=media&token=59933fc6-8e18-4daa-8c05-2e0e2879a811?alt=media",
        }).then(
          db.collection("users").doc(username).set({
            username: username,
            email: email,
            profileimage: "https://firebasestorage.googleapis.com/v0/b/emote-8f3bc.appspot.com/o/images%2Favater.gif?alt=media&token=59933fc6-8e18-4daa-8c05-2e0e2879a811?alt=media",
        })
        )
    }).catch((error) => {
      var errorMessage = error.message;
        seterrorMessage(errorMessage);
        console.log(errorMessage);
    });
}

const signin = (email, password) => {
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
        var errorMessage = error.message;
        seterrorMessage(errorMessage);
        console.log(errorMessage);
      });
      
}

  const signout = () => {
    auth.signOut()
    Router.push("/")
  };

  return {
    user,
    loading,
    signin,
    register,
    signout,
    errorMessage,
  };
}