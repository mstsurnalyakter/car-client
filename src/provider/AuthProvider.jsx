import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import axios from "axios";

import PropTypes from "prop-types";
import auth from "../firebase/firebase.config";
import toast from "react-hot-toast";


export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    setUser(null);
    return signOut(auth);
  };

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

      const userEmail = currentUser?.email || user?.email;
        const loggedUser = { email: userEmail };

      if (currentUser) {
        console.log("currentUser",currentUser);
        setUser(currentUser);

        //if user exists then issue a token
        axios
          .post(`http://localhost:5000/jwt`, loggedUser, {
            withCredentials: true,
          })
          .then((res) => {
            console.log("token response", res.data);
          })
          .catch((error) => {
            toast.error(error.message);
          });

      }else{
        console.log("else block",loggedUser);
        axios.post(`http://localhost:5000/logout`,loggedUser,{withCredentials:true})
        .then(res=>{
          console.log(res.data);
        })
        .catch(error=>{
          toast.error(error.message)
        })

      }



      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
