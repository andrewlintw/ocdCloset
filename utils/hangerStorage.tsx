import AsyncStorage from '@react-native-async-storage/async-storage';

export type Hanger = {
    id: number;
    occupied: boolean;
    picture: string;      // permanent URI from FileSystem
    wearCount: number;    // for tracking later
};

const KEY = 'hangers';

export async function getHangers(): Promise<Hanger[]> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
}

export async function saveHangers(hangers: Hanger[]): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(hangers));
}

export async function addClothingToHanger(pictureUri: string): Promise<void> {
    const hangers = await getHangers();
    const freeHanger = hangers.find(h => !h.occupied);
    if (freeHanger) {
        freeHanger.occupied = true;
        freeHanger.picture = pictureUri;
        await saveHangers(hangers);
    }
}