import Header from '../src/components/Header/header.js'
import Post from '../src/components/Post/post'
import { useAuth } from '../lib/auth'
import { db } from '../lib/firebase'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import InfiniteScroll from "react-infinite-scroll-component";

export default function Index() {

  const { user, loading, signout } = useAuth();
  const [PostDetails, setPostDetails] = useState(null);
  const [UserDetails, setUserDetails] = useState(null);
  const [lastVisible, setlastVisible] = useState(null)
  const [checkstring, setcheckstring] = useState(null)


  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .limit(5)
      .onSnapshot((snapshot) => {
        var lastVisible = snapshot.docs[snapshot.docs.length-1];
        setlastVisible(lastVisible);
        const tempPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }));
        setPostDetails(tempPosts);
      });

    db.collection("users")
      .limit(5)
      .onSnapshot((snapshot) => {
        const tempUsers = snapshot.docs.map((doc) => ({
          username: doc.username,
          ProfileImage: doc.data(),
        }));
        setUserDetails(tempUsers);

      });

  }, []);

  const postIndex = () => {
    db.collection("posts")
    .orderBy("timestamp", "desc")
    .startAfter(lastVisible)
    .limit(5)
    .onSnapshot((snapshot) => {
      var lastVisible = snapshot.docs[snapshot.docs.length-1];
        setlastVisible(lastVisible);
      const tempPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data(),
      }));
      setPostDetails(PostDetails => [...PostDetails, ...tempPosts])
    });
    setcheckstring(lastVisible.id)
  }


  return (
    <>
      <Header />
      {loading == true ?
        <div className="w-full flex justify-center item-center mt-40">
          <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        </div> : <>{user ?
          <div>
            <div className="mt-20 px-8 flex justify-evenly">
              <div className="w-96 max-h-56 bg-white hidden rounded-xl shadow-xl overflow-hidden lg:flex lg:flex-col">
                <button className="bg-purple-500 px-10 py-4 text-white uppercase" onClick={() => Router.push("/Profile")}>Profile</button>
                <button className="bg-blue-500 px-10 py-4 text-white uppercase" onClick={() => Router.push("/upload")}>Upload Post</button>
                <button className="bg-red-500 px-10 py-4 text-white uppercase" onClick={signout}>signout</button>
                <p className="text-center font-bold py-3">Created with ❤️ By Naman</p>
              </div>
              <div className="mx-3 flex flex-col w-full lg:w-2/5">
                <div onClick={() => Router.push("/upload")} className="w-full m-auto flex flex-col justify-center items-center px-4 py-3 bg-white text-gray-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-purple-700 cursor-pointer hover:bg-purple-700 hover:text-white lg:m-0 lg:h-20">
                  <span className="mt-2 text-bold leading-normal">Create New Post</span>
                </div>
                {PostDetails == null ?
                  <div className="w-full flex justify-center item-center mt-40">
                    <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                  </div>
                  :
                  <InfiniteScroll
                    dataLength={PostDetails.length}
                    next={postIndex}
                    hasMore={lastVisible ? <>{lastVisible.id == checkstring ? false : true}</>: null}
                    loader={
                      <div className="w-full flex justify-center item-center mt-4">
          <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        </div>
                    }
                    endMessage={
                      <h4 className="text-center font-bold mb-4">The End</h4>
                    }
                  >
                    { 
                      PostDetails.map((post, Index) => (
                        <Post
                        key={Index}
                        id={post.id}
                        username={post.post.username}
                        imageUrl={post.post.imageUrl}
                        caption={post.post.caption}
                        profileimage={post.post.profileimage}
                        />
                      ))
                    }
                  </InfiniteScroll>
                }
              </div>
              <div className="w-96 self-start bg-white hidden rounded-xl shadow-xl flex-col lg:flex">
                <p className="py-2 font-bold text-center">Explore Other Profiles</p>
                {UserDetails == null ?
                  <div className="w-full flex justify-center item-center mt-40">
                    <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                  </div>
                  :
                  UserDetails.map(user => (
                    <div
                      onClick={() => Router.push(`/User/${user.ProfileImage.username}`)}
                      key={user.ProfileImage.username}
                      className="flex items-center py-2 px-5 m-4 shadow-xl bg-purple-700 text-white rounded-lg cursor-pointer hover:bg-purple-500"
                    >
                      <img className="h-9 w-9 rounded-full" src={user.ProfileImage.profileimage} />
                      <p className="font-bold ml-3">{user.ProfileImage.username} </p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          :
          <div className="mt-20 mx-6 w-4/5 bg-purple-800 text-white rounded-xl shadow-xl p-10 flex items-center mx-auto justify-center lg:justify-evenly">
            <img src='/static/images/doge.jpg' className="hidden h-96 rounded-xl lg:block" />
            <div className="flex flex-col items-center">
              <p className="font-bold text-9xl uppercase">yoo</p>
              <button className="bg-white px-10 py-2 text-purple-800 rounded-lg my-5" onClick={() => Router.push('/login')}>LOGIN</button>
            </div>
          </div>
        }</>}
    </>
  )
}
