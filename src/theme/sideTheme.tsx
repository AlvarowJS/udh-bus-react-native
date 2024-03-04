import { StyleSheet } from "react-native";

export const sideStyles = StyleSheet.create({
    container: {
        backgroundColor: '#39D793',
        height: '100%',
        paddingTop: 40,
        paddingHorizontal: 40,
        
    },
    option: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
        
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    icon: {
        color: 'white',
        fontSize: 25
    }, 
    logo: {
        width: 210,
        height: 210,
        backgroundColor: 'white',
        borderRadius: 200,
        marginBottom: 40
    }
})