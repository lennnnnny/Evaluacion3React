import { useTheme } from '@/components/context/theme-context';
import { Task } from '@/constants/types';
import { launchCameraAsync, requestCameraPermissionsAsync } from 'expo-image-picker';
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/auth-context';
import Button from './button';
import Title from './title';

interface NewTaskProps {
    onClose: () => void;
    onTaskSave: (task:Task) => void;
}

export default function NewTask({ onClose, onTaskSave }: NewTaskProps) {
    const [photoUri, setPhotoUri] =  useState<string | null>(null);
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [isCapturingPhoto, setIsCapturingPhoto] = useState<boolean>(false);   
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { user } = useAuth();
    async function handleTakePhoto() {
      console.log('handleTakePhoto called');
        //lógica para obtener ubicación
        

        //lógica para tomar foto
        if (isCapturingPhoto) return; //evita multiples capturas (debounce)

        try{
            setIsCapturingPhoto(true);

            const { status } = await requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'No se puede acceder a la cámara.');
                setIsCapturingPhoto(false);
                return;
            }

            const result = await launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                aspect: [4,3],
                quality: 0.7,
                exif: false,
            })

            if (!result.canceled && result.assets.length > 0) {
                setPhotoUri(result.assets[0].uri);
            }   
        } catch (error) {
            console.error('Error al tomar la foto:', error);
            Alert.alert('Error', 'No se pudo tomar la foto. Inténtalo de nuevo.');
        } finally {
            setIsCapturingPhoto(false);
        }
    }

    async function handleSaveTask() {
      if (isSaving) return; //evita multiples guardados
      let location = null;
      try{
        setIsSaving(true);
        //lógica para obtener ubicación
        const {status} = await requestForegroundPermissionsAsync();

        if (status === 'granted') {
          const locationResult = await getCurrentPositionAsync({
            accuracy: Accuracy.Balanced
          });
          location = {
            latitude: locationResult.coords.latitude.toFixed(6).toString(),
            longitude: locationResult.coords.longitude.toFixed(6).toString(),
          };
        }

        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9), //genera un id aleatorio simple
          title: taskTitle,
          completed: false,
          photoUri: photoUri || undefined,
          coordinates: location || {  
            latitude: '0.000000',
            longitude: '0.000000',
          },
          userId: user ? user.id : '',
        };
        onTaskSave?.(newTask);
        onClose();
      } catch (error) {
        console.error('Error al guardar la tarea:', error);
        Alert.alert('Error', 'No se pudo guardar la tarea. Inténtalo de nuevo.');
      } finally {
        setIsSaving(false);
      }
    }

    const { colors, scheme } = useTheme();
    const translateY = useRef(new Animated.Value(12)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, friction: 10, useNativeDriver: true }),
      ]).start();
    }, [opacity, translateY]);
    const stylesWithTheme = [styles.input, { borderColor: colors.icon, color: colors.text, backgroundColor: scheme === 'dark' ? '#1a1a1a' : '#ffffff' }];
    return ( //operador ternario ) : ( basicamente un if else
            <Animated.View style={[styles.wrapper, { transform: [{ translateY }], opacity }]}> 
                    <Title style={{ fontSize: 24, marginBottom: 8 }}> Añadir Nueva Tarea </Title>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={stylesWithTheme}
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                    placeholder="Título"
                    placeholderTextColor={colors.icon}
                    accessibilityLabel="Título"
                  />
                </View>
                {photoUri ? (
                    <View style={{marginBottom:12}}>
                        <Image resizeMode = "contain" source={{ uri: photoUri }} style={{ width: '100%', height: 200, borderRadius: 4 }} />
                        <Text style={{ color: colors.text }}> Foto agregada </Text>
                    </View>
                ) : (
                <>
                    <TouchableOpacity style={[styles.emptyPhotoContainer, { backgroundColor: colors.icon + '1a', borderColor: colors.icon }]} onPress={handleTakePhoto} activeOpacity={0.8}>
                    <Text style={styles.emptyPhotoIcon}> 📸  </Text>
                    <Text style={[styles.emptyPhotoText, { color: colors.text, fontSize: 16 }]}> Agregar imagen  </Text>
                  </TouchableOpacity>
                </>
                )}
                <Button type="outlined" text={photoUri ? "Volver a tomar foto" : "Tomar Foto"} onPress={handleTakePhoto} disabled={isCapturingPhoto} />
                <View style={{gap:12,flexDirection:'column', marginTop: 12}}>
                    <Button type='primary' text='Guardar Tarea' onPress={handleSaveTask} disabled={isSaving || taskTitle.trim().length === 0} /> 
                    <Button type='danger' text='Cancelar' onPress={onClose} />
                </View>
              </Animated.View>
    );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20, position: 'relative', paddingBottom: 90 },
  newTaskButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#FF3B30',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  newTaskButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  inputContainer: {
    marginVertical: 10,
  },
    input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,    
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  label: 
    {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptyPhotoContainer: {
    position: 'relative',
    height: 200,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyPhotoText: {
    color: '#635b5bff',
  },
    emptyPhotoIcon: {
    fontSize: 48,
    marginBottom: 8,
    },
});