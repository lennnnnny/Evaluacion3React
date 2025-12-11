import { StyleSheet, Text, View } from 'react-native';


export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Tareas</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,   
    alignItems: 'center',
    justifyContent: 'center',
  },
    textColor:{
    color: '#fff',
  },
  titleText:{
    color: '#000000ff',
    fontSize: 40,
    fontWeight: 'bold',
  }
});