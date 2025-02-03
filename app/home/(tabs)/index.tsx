import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  ViewToken,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Image,
} from "react-native";
import { Video, Audio } from "expo-av";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

const SCREEN_HEIGHT = Dimensions.get("window").height;

// Simple placeholder avatars
const AVATARS = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/women/23.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

interface Comment {
  id: number;
  text: string;
  avatar: string;
}

interface VideoItem {
  id: string;
  videoUrl: string;
  description: string;
  likes: number;
  comments: Comment[];
}

const videoData: VideoItem[] = [
  {
    id: "1",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetsOfJapan.mp4",
    description: "Short clip #1",
    likes: 0,
    comments: [],
  },
  {
    id: "2",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "Short clip #2",
    likes: 0,
    comments: [],
  },
  {
    id: "3",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetsOfJapan.mp4",
    description: "Short clip #3",
    likes: 0,
    comments: [],
  },
];

export default function HomeFeedScreen() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState(videoData);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true }).catch(console.warn);
  }, []);

  const onViewableItemsChanged = useRef<
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void
  >(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleLike = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos[index].likes += 1;
    setVideos(updatedVideos);
  };

  const openCommentsModal = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsCommentsModalVisible(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalVisible(false);
    setSelectedVideo(null);
  };

  /** Add a new comment with random avatar */
  const handleAddComment = () => {
    if (!selectedVideo || currentComment.trim() === "") return;

    const updatedVideos = [...videos];
    const videoIndex = updatedVideos.findIndex(
      (v) => v.id === selectedVideo.id
    );
    updatedVideos[videoIndex].comments.push({
      id: Date.now(),
      text: currentComment.trim(),
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    });

    setVideos(updatedVideos);
    setCurrentComment("");
  };

  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <VideoContainer>
      <StyledVideo
        source={{ uri: item.videoUrl }}
        resizeMode="cover"
        isLooping
        shouldPlay={currentIndex === index}
      />
      <Overlay>
        <DescriptionText>{item.description}</DescriptionText>
      </Overlay>
      <InteractionContainer>
        <TouchableOpacity onPress={() => handleLike(index)}>
          <FontAwesome
            name="heart"
            size={32}
            color="red"
            style={{ marginBottom: 10 }}
          />
          <LikeCount>{item.likes} likes</LikeCount>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openCommentsModal(item)}>
          <FontAwesome name="comment-o" size={32} color="white" />
        </TouchableOpacity>
      </InteractionContainer>
    </VideoContainer>
  );

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentRow}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={SCREEN_HEIGHT}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        getItemLayout={(_, i) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * i,
          index: i,
        })}
      />

      {/* Bottom Drawer Comments Modal */}
      <Modal
        visible={isCommentsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCommentsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.drawerContainer}>
            <Text style={styles.drawerTitle}>Comments</Text>

            <FlatList
              data={selectedVideo?.comments || []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCommentItem}
              style={{ marginVertical: 10 }}
            />

            <View style={styles.commentInputContainer}>
              <TextInput
                placeholder="Add a comment..."
                placeholderTextColor="#aaa"
                value={currentComment}
                onChangeText={setCurrentComment}
                style={styles.commentInput}
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.commentButton}
              >
                <Text style={styles.commentButtonText}>Post</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeCommentsModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ----- STYLES -----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  drawerContainer: {
    backgroundColor: "#222",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  drawerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentText: {
    color: "#fff",
    fontSize: 16,
    flexShrink: 1,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 5,
    color: "#fff",
    paddingHorizontal: 10,
  },
  commentButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    backgroundColor: "#555",
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

// ----- STYLED COMPONENTS -----
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
  bottom: 150px;
  left: 20px;
`;

const DescriptionText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const InteractionContainer = styled.View`
  position: absolute;
  bottom: 100px;
  right: 20px;
  align-items: center;
`;

const LikeCount = styled.Text`
  color: #fff;
  font-size: 14px;
`;
