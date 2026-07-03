import * as secureStore from 'expo-secure-store'

import { Platform } from 'react-native'

export const secureStoreHelper = {
    async setItem(key: string, value: string): Promise<void> {
        try {
            if (Platform.OS === 'web') {
                localStorage.setItem(key, value)
            } else {
                await secureStore.setItemAsync(key, value)
            }
        } catch (error) {
            console.error(`Error writing secure store key ${key}:`, error)
        }
    },

    // Get an item from secure storage
    async getItem(key: string): Promise<string | null> {
        try {
            if (Platform.OS === 'web') {
                return localStorage.getItem(key)
            } else {
                return await secureStore.getItemAsync(key)
            }
        } catch (error) {
            console.error(`Error reading secure store key ${key}:`, error)
            return null
        }
    },

    // Delete an item from secure storage
    async deleteItem(key: string): Promise<void> {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem(key)
            } else {
                await secureStore.deleteItemAsync(key)
            }
        } catch (error) {
            console.error(`Error deleting secure store key ${key}:`, error)
        }
    },

    //set onBoardingCompleted flag
    async setOnBoardingCompleted(): Promise<void> {
        try {
            await this.setItem('onBoardingCompleted', 'true')
        } catch (error) {
            console.error('Error setting onBoardingCompleted flag:', error)
        }
    }
}

export default secureStoreHelper