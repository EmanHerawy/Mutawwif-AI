import { Audio } from 'expo-av';

class AudioService {
  private sound: Audio.Sound | null = null;

  async playAzkar(audioFile: string): Promise<void> {
    try {
      await this.stop();
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioFile },
        { shouldPlay: true }
      );
      this.sound = sound;
    } catch {
      // Audio playback failure is non-critical
    }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }

  async setVolume(volume: number): Promise<void> {
    await this.sound?.setVolumeAsync(Math.min(1, Math.max(0, volume)));
  }
}

export const audioService = new AudioService();
