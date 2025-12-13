import { useTheme } from '@/components/context/theme-context';
import { Colors as ColorsObj } from '@/constants/theme';
import { Task } from '@/constants/types';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface TaskItemProps {
   task: Task;
   onToggle?: (id: string) => void;
   onRemove?: (id: string) => void;
}

export default function TaskListItem({ task, onToggle, onRemove }: TaskItemProps) {
   const { colors } = useTheme();
   const styles = getStyles(colors);
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
       Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    }, [opacity]);
   return (
      <Animated.View style={[styles.container, { opacity }]}> 
         <TouchableOpacity
            style={[styles.circle, task.completed && styles.completedCircle]}
            onPress={() => onToggle?.(task.id)}
         />
         <View style={styles.imageContainer}>
            {task.photoUri ? (
               <Image
                  source={{ uri: task.photoUri }}
                  style={styles.image}
                  resizeMode="cover"
               />
            ) : (
               <View style={styles.emptyImage} />
            )}
         </View>
         <View style={styles.content}>
            <Text style={[styles.title, task.completed && styles.completedTitle]} numberOfLines={2} ellipsizeMode="tail">
               {task.title}
            </Text>
            {task.coordinates && (
               <View style={styles.locationRow}>
                  <IconSymbol name="mappin" size={12} color={colors.icon} />
                  <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                     {task.coordinates.latitude}, {task.coordinates.longitude}
                  </Text>
               </View>
            )}
         </View>


         <TouchableOpacity onPress={() => onRemove?.(task.id)}  style={styles.removeButton}>
          <IconSymbol name="trash.circle" size={24} color={colors.icon} />
         </TouchableOpacity>
      </Animated.View>
   );
}

const getStyles = (colors: typeof ColorsObj.light) => StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.icon,
   },
   circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.icon,
      backgroundColor: 'transparent',
   },
   completedCircle: {
      backgroundColor: colors.tint,
   },
   content: {
      flex: 1,
      marginLeft: 8,
      flexDirection: 'column',
      justifyContent: 'center',
   },
   title: {
      fontSize: 16,
      marginLeft: 0,
      fontWeight: '600',
      color: colors.text,
   },
   completedTitle: {
      textDecorationLine: 'line-through',
      color: colors.icon,
   },
   removeButton:{   
      alignSelf: 'flex-end',
      padding: 5,
   }
   ,
   imageContainer: {
       width: 48,
       height: 48,
       justifyContent: 'center',
       alignItems: 'center',
       marginLeft: 10,
    },
    image: {
       width: 40,
       height: 40,
       borderRadius: 4,
    },
    emptyImage: {
       width: 40,
       height: 40,
       borderRadius: 4,
       backgroundColor: colors.icon + '1a',
    }
   ,
   locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
   },
   locationText: {
      color: colors.icon,
      fontSize: 12,
      marginLeft: 6,
   }
});
