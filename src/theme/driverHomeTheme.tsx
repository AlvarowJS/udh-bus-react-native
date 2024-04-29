import { StyleSheet } from "react-native";

export const HomeDriverStyle = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0CBB70'
    },
    perfil: {
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    bienvenido: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20
    },
    person: {
        color: 'white',
        textAlign: 'center'
    },
    nombre: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center'
    },
  
    busesback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9'
    },
    busesTitle: {
        color: '#0CBB70',
        fontWeight: '900',
        fontSize: 20,
        marginBottom: 20

    },
    busCard: {
        backgroundColor: 'white',
        padding: 16,
        margin: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    busCardActive: {
        backgroundColor: '#0CBB70',
        padding: 16,
        margin: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    busTitleBusActive: {
        color: 'white',
        textAlign: 'center',
        fontSize: 30        
    },
    busSubtitleBusActive: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
    },
    busTitleBusFree: {
        textAlign: 'center',
        fontSize: 30
    },
    busSubtitleBusFree: {
        textAlign: 'center',
        fontSize: 15
    },
    busTitleBusBusy: {
        textAlign: 'center',
        fontSize: 30,
        color: '#D9D9D9'
    },
    busSubtitleBusBusy: {
        textAlign: 'center',
        fontSize: 15,
        color: '#D9D9D9'
    },
    busesCollection: {
        // backgroundColor: 'red',
        height: '50%'
    },
    busPlayGreen: {
        color: '#0CBB70',
        textAlign: 'center'
    },



    // Menu
    photo: {
        position: 'absolute',
        color: 'white',
        borderRadius: 200,
        marginTop: 40,
        marginLeft: 20,
        right: 10
    },

    name: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 55,
        marginRight: 40,
        right: 10,
        position: 'absolute'
    },
    menu: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        marginTop: 50,
        left: 10,
        zIndex: 10
        
    },
    logout: {
        color: 'white',
        fontWeight: 'bold',
        top: 50,
        right: 10,
        // marginLeft: 320,
        position: 'absolute',
    },
});