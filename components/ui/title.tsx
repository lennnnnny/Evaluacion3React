import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

interface TitleProps {  
    style?: StyleProp<TextStyle>; //el ? indica que es opcional
    children?: React.ReactNode;
}

//un children es un objeto dentro de otro objeto, en este caso es un texto dentro del componente Title
//el componente Title recibe un estilo y un texto como props y se puede utilizar en otros componentes
// utilizando <Title>>Texto</Title> , como un componente reutilizable
export default function Title({ style, children }: TitleProps) {
    return (
        <Text style={[styles.titleText, style]}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 60,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#000',
        textAlign: 'center',
    }
});