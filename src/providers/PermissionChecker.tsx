import React, { Children, PropsWithChildren, useEffect } from 'react'
import { AppState } from 'react-native'

export const PermissionChecker = ({ children }: PropsWithChildren) => {

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            console.log('AppState', nextAppState)
        })

        return() => {
            subscription.remove();
        }
    }, [])

    return (
        <>
            {Children}
        </>
    )
}
