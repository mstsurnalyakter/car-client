import axios from "axios"
import { useEffect } from "react";
import useContextData from "./useContextData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials:true
});
const useAxiosSecure = () => {
    const {logout} = useContextData();
    const navigate = useNavigate()
    useEffect(()=>{
        axiosSecure.interceptors.response.use(res=>{
            return res;
        },error=>{
            console.log("error tracked in the interceptors", error.response);
            if (
              error.response.status === 401 ||
              error.response.status === 404
            ) {
                console.log("logout the user");
                 logout()
                   .then(() => {
                    navigate("/login")
                   })
                   .catch((error) => toast.error(error.message));
            }
        })
    },[logout,navigate])
    return axiosSecure;
}

export default useAxiosSecure