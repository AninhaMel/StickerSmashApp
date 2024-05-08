import { useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import ImageViewer from './src/components/ImageViewer';
import Button from './src/components/Button';
import CircleButton from './src/components/CircleButton';
import IconButton from './src/components/IconButton';
import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from './src/components/EmojiPicker';
import EmojiList from './src/components/EmojiList';
import EmojiSticker from './src/components/EmojiSticker';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import * as MedialLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import DomToImage from 'dom-to-image';

const PlaceHolderImage = require('./assets/images/background-image.png');

export default function App() {
  const [selectedImage, setSelectImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MedialLibrary.usePermissions();
  const imageRef = useRef();

 if (status === null) {
  requestPermission();
 }

  const onReset = () => {
    setShowAppOptions(false);
  }

  const onAddSticker = () => {
    setIsModalVisible(true);
  }

  const onSaveImageAsync = async() => {
    if (Platform.OS != 'web') {
    try {
      const localUri = await captureRef(imageRef, {
        height:440,
        quality:1,
      });
      await MedialLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('imagem Salva!')
      }
    } catch (e) {
      console.log(e);
    };
  } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality:0.95,
        width: 320,
        height:440,  
      });
      let link = document.createElement('a');
      link.download = 'sticker-smash.jpeg';
      link.href = dataUrl;
      link.click();
      } catch (e) {
        console.log(e);
      };
  }
  }

  const onModalClose = () => {
    setIsModalVisible(false);
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1, 
    });
    if (!result.canceled){
      setSelectImage(result.assets[0].uri);
      setShowAppOptions(true); 
    } else {
      alert("Você não selecionou uma imagem");
    }
  }; 
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.ImageContainer}>
      <View ref={imageRef} collapsable = {false}>
      <ImageViewer 
      placeholderImageSource={PlaceHolderImage}
      selectedImage={selectedImage}
      />
      {pickedEmoji &&
       <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> }
       </View>
      </View>
      {showAppOptions ? (
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <IconButton icon="refresh" label="Reiniciar" onPress={onReset} />
          <CircleButton onPress={onAddSticker} />
          <IconButton icon="save-alt" label="Salvar" onPress={onSaveImageAsync} />
        </View>
        </View>
      ) : (
      <View style={styles.footerContainer}>
        <Button 
        label= "Escolher Foto" 
        theme="primary"
        onPress={pickImageAsync}
        />
        <Button 
        label= "Usar esta Foto"
        onPress={() => setShowAppOptions(true)}
        />
        </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      <StatusBar style="ligth"/>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  ImageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  }
});
