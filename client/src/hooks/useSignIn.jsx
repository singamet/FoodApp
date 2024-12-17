import { useState } from "react"
import {useAuthContext} from './useAuthContext'

export const useSignIn = () => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const {dispatch} = useAuthContext()

    const signin = async (email, password) => {
        setError(null)
        setIsLoading(true)
        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({email, password})
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
    return {signin, error, isLoading}
}