
import { useEffect } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {

    const nav = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            nav('/signin')
            return;
        }

        axios.get('http://localhost:3000/api/v1/user/me', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }).then(res=>{
            nav('/dashboard')
        }).catch(err=> nav('/signin'))
    }, [])


    return (
        <>{children}</>
    )
}
