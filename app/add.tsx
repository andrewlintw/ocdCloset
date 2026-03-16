import { Text, View, Modal, Pressable, StyleSheet, Image } from "react-native";
import { useState } from "react";
import leftHanger from "@/utils/leftHanger";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { File, Directory, Paths } from 'expo-file-system';
import { addClothingToHanger } from "@/utils/hangerStorage";

const PlaceholderImg = require('@/assets/images/react-logo.png');

export default function Add() {
    const router = useRouter();
    const isUnusedHanger = leftHanger();
    const [popupVisible, setPopupVisible] = useState(!isUnusedHanger);
    const handleNotEnough = () => {
        setPopupVisible(false);
        router.navigate("/delete");
    }
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [tempUri, setTempUri] = useState<string | undefined>(undefined);
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            // Just preview it, don't copy yet
            setTempUri(result.assets[0].uri);
            setSelectedImage(result.assets[0].uri);
        } else {
            alert('未選擇圖片');
        }
    };

    const submit = async () => {
        if (!tempUri) return; // safety guard

        const filename = tempUri.split('/').pop() ?? `${Date.now()}.jpg`;
        const clothesDir = new Directory(Paths.document, 'clothes');
        clothesDir.create({ intermediates: true, idempotent: true });

        const srcFile = new File(tempUri);
        const destFile = new File(clothesDir, filename);
        srcFile.copy(destFile);

        await addClothingToHanger(destFile.uri);
        router.back(); // or wherever you want to go after confirming
    };
    return (
        <View
            style={styles.container}
        >
            <Modal
                style={styles.modal}
                visible={false}
                onRequestClose={() => {
                    setPopupVisible(!popupVisible);
                }}
            >
                <Text style={styles.normalText}>沒有空的衣架了！把一些衣服收起來吧？</Text>
                <Pressable
                    style={styles.button}
                    onPress={handleNotEnough}
                >
                    <Text style={styles.buttonText}>去刪除</Text>
                </Pressable>
            </Modal>
            <View
                style={styles.imageContainer}
            >
                <Image
                    source={selectedImage? {uri: selectedImage} : PlaceholderImg}
                    style={styles.image}
                />
            </View>
            <Pressable
                style={styles.button}
                onPress={pickImageAsync}
            >
                <Text style={styles.buttonText}>選擇圖片</Text>
            </Pressable>
            <Pressable
                style={selectedImage? styles.button: styles.disabledButton}
                onPress={submit}
            >
                <Text style={styles.buttonText}>確定</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 200,
        height: 200,
    },
    imageContainer: {
        width: 200, 
        height: 200,
        borderWidth: 3,
        borderColor: 'red',
        borderRadius: 3,
        justifyContent: 'center',
    },
    modal: {
        width: 100,
        height: 50,
        justifyContent: 'center',
    },
    normalText: {

    },
    button: {
        backgroundColor: 'green',
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    buttonText: {

    },
})