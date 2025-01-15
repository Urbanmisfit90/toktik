// app/(tabs)/index.tsx
import React, { useRef, useState, useEffect } from "react";
import { 
  View, 
  FlatList, 
  Dimensions, 
  ViewToken, 
  StyleSheet 
} from "react-native";
import { Video, Audio } from "expo-av";
import styled from "styled-components/native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface VideoItem {
  id: string;
  videoUrl: string;
  description: string;
}

const videoData: VideoItem[] = [
  {
    id: "1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetsOfJapan.mp4",
    description: "Short clip #1",
  },
  {
    id: "2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "Short clip #2",
  },
  {
    id: "3",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetsOfJapan.mp4",
    description: "Short clip #3",
  },
  // Add more if you'd like
];

export default function HomeFeedScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Let iOS play audio even if device is in silent mode
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true }).catch(console.warn);
  }, []);

  // This ref callback tracks which item is currently visible, so we know which to play
  const onViewableItemsChanged = useRef<
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void
  >(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  // Configure how much of an item needs to be visible to be “seen”
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Render each video item
  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <VideoContainer>
      <StyledVideo
        source={{ uri: item.videoUrl }}
        resizeMode="cover"
        isLooping
        // Only autoplay if it's the current visible item
        shouldPlay={currentIndex === index}
      />
      <Overlay>
        <DescriptionText>{item.description}</DescriptionText>
      </Overlay>
    </VideoContainer>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={videoData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        // Make the list snap one full screen at a time
        pagingEnabled
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={SCREEN_HEIGHT}
        showsVerticalScrollIndicator={false}
        // Track which item is viewable
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        // Tell RN each item's layout (for smooth snapping & performance)
        getItemLayout={(_, i) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * i,
          index: i,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

// Each item fills the entire screen
const VideoContainer = styled.View`
  width: 100%;
  height: ${SCREEN_HEIGHT}px;
  position: relative;
`;

const StyledVideo = styled(Video)`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Overlay = styled.View`
  position: absolute;
  bottom: 100px;
  left: 20px;
`;

const DescriptionText = styled.Text`
  color: #fff;
  font-size: 16px;
`;
