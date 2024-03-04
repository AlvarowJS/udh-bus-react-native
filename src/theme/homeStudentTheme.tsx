import { StyleSheet } from "react-native";

export const HomeStudentStyle = StyleSheet.create({

    header: {
        position: 'absolute',
        width: '100%',
        marginTop: 0,
        height: 80,
        backgroundColor: '#0CBB70',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    photo: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 200,
        marginTop: 50,
        marginLeft: 20
    },
    name: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 60,
        marginLeft: 80,
        position: 'absolute',
    },
    logout: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 50,
        right: 10,
        // marginLeft: 320,
        position: 'absolute',
    }    
    
});