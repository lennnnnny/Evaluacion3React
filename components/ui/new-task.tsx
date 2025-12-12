import { IconSymbol } from '@/components/ui/icon-symbol';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Title, { TitleProps } from './title';

interface NewTaskProps {
  setCreatingNew?: (v: boolean) => void;
  addTodo?: (title: string) => void;
  titleProps?: TitleProps;
}


export default function NewTask({ setCreatingNew, addTodo }: NewTaskProps) {
    return (
        <View style={styles.wrapper}>
            <Title> Nueva Tarea </Title>
            <TouchableOpacity 
              style={styles.newTaskButton} 
              onPress={() => { setCreatingNew?.(false); addTodo?.('Nueva Tarea'); }}>
              <IconSymbol name="plus" size={30} color="#fff" />
              <Text style={{ color: '#fff', textAlign: 'center' }}>Volver</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  newTaskButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  }
});