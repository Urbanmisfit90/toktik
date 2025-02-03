import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ResizeMode, Video } from "expo-av";

export default function UploadScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);

  /**
   * Pick a video from the user's gallery.
   */
  const pickVideoFromGallery = async () => {
    // 1) Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    // 2) Launch gallery picker (filter for videos only)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    // 3) If user didn't cancel, set URI
    if (!result.canceled) {
      const pickedVideo = result.assets[0];
      console.log("Picked video from gallery:", pickedVideo.uri);
      setVideoUri(pickedVideo.uri);
    } else {
      console.log("User canceled gallery picker.");
    }
  };

  /**
   * Record a new video with the device camera.
   */
  const recordVideoWithCamera = async () => {
    // 1) Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }

    // 2) Launch camera (filter for videos only)
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    // 3) If user didn't cancel, set URI
    if (!result.canceled) {
      const pickedVideo = result.assets[0];
      console.log("Recorded video URI:", pickedVideo.uri);
      setVideoUri(pickedVideo.uri);
    } else {
      console.log("User canceled camera.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Video</Text>

      <TouchableOpacity style={styles.button} onPress={pickVideoFromGallery}>
        <Text style={styles.buttonText}>Pick from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={recordVideoWithCamera}>
        <Text style={styles.buttonText}>Record with Camera</Text>
      </TouchableOpacity>

      {videoUri && (
        <Video
          source={{ uri: videoUri }}
          style={styles.videoPreview}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff0050",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  videoPreview: {
    width: "100%",
    height: 300,
    backgroundColor: "#333",
  },
});
