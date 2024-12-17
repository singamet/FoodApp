import { useContext, useState } from "react"
import { CartContext } from "../context/CartContext"
import { useAuthContext } from "./useAuthContext"

export const useCartContext = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw Error("Shopping Cart Items Context Provider Error!")
    }
    return context
}

export const useAddToCart = () => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { setCart } = useCartContext()
    const {user} = useAuthContext()

    const addToCart = async (foodId, quantity) => {
        setError(null)
        setIsLoading(true)
        try {
            const response = await fetch('/api/user/cart/', {
                method: "POST",
                headers: {
                    'Authorization' : `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({foodId, quantity})
            })
            const json = await response.json()
            if (!response.ok) {
                setError(json.error)
            }
            else {
                setCart(json.cart)
            }
        }
        catch (err) {
            setError(err.message)
        }
        finally {
            setIsLoading(false)
        }
    }
    return {addToCart, isLoading, error}
}

export const useUpdateCartItem = () => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { setCart } = useCartContext()
    const {user} = useAuthContext()

    const updateCartItem = async (cartId, quantity) => {
        setError(null)
        setIsLoading(true)
        try {
            const response = await fetch(`/api/user/cart/${cartId}`, {
                method: "PATCH",
                headers: {
                    'Authorization' : `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({quantity})
            })
            const json = await response.json()
            if (!response.ok) {
                setError(json.error)
            }
            else {
                setCart(json.cart)
            }
        }
        catch (err) {
            setError(err.message)
        }
        finally {
            setIsLoading(false)
        }
    }
    return {updateCartItem, isLoading, error}
}

export const useDeleteCartItem = () => {
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { setCart } = useCartContext()
    const {user} = useAuthContext()

    const deleteCartItem = async (_id) => {
        setError(null)
        setIsLoading(true)
        try {
            const response = await fetch(`/api/user/cart/${_id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            if (!response.ok) {
                setError(json.error)
            }
            else {
                setCart(json.cart)
            }
        }
        catch (err) {
            setError(err.message)
        }
        finally {
            setIsLoading(false)
        }
    }
    return {deleteCartItem, isLoading, error}
}