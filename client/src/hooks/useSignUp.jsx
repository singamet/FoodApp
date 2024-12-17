import { useState } from "react"
import {useAuthContext} from './useAuthContext'

export const useSignUp = () => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const {dispatch} = useAuthContext()

    const signup = async (fullname, email, password) => {
        setError(null)
        setIsLoading(true)
        try {
            const response = await fetch("/api/user/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({fullname, email, password})
            })
            const json = await response.json()
            if (!response.ok) {
                setError(json.error)
            }
            else {
                localStorage.setItem('user', JSON.stringify(json))
                dispatch({ type: "SIGNIN", payload: json })
            }
            setIsLoading(false)
        }
        catch (err) {
            setError(err.message)
        }
    }
    return {signup, error, isLoading}
}