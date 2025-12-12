import { Task } from '@/constants/types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface TaskItemProps {
   task: Task;
   onToggle?: (id: string) => void;
   onRemove?: (id: string) => void;
}

export default function TaskListItem({ task, onToggle, onRemove }: TaskItemProps) {
   return (
      <View style={styles.container}>
         <TouchableOpacity
            style={[styles.circle, task.completed && styles.completedCircle]}
            onPress={() => onToggle?.(task.id)}
         />

         <Text style={[styles.title, task.completed && styles.completedTitle]}>
            {task.title}
         </Text>

         <TouchableOpacity onPress={() => onRemove?.(task.id)}  style={styles.removeButton}>
          <IconSymbol name="trash.circle" size={24} color="#575c53ff" />
         </TouchableOpacity>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
   },
   circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#000',
      backgroundColor: 'transparent',
   },
   completedCircle: {
      backgroundColor: '#000',
   },
   title: {
      fontSize: 16,
      marginLeft: 10,
   },
   completedTitle: {
      textDecorationLine: 'line-through',
      color: '#999',
   },
   removeButton:{   
      alignSelf: 'flex-end',
      padding: 5,
   }
});