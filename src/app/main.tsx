import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

// Manteniendo los colores y estilos de GOTG
const COLORS = {
  primary: '#000',
  accent: '#FF69B4', // Color rosa de GOTG
  background: '#fff',
  text: '#000',
  textSecondary: '#666',
  border: 'rgba(0, 0, 0, 0.1)',
};

export default function Main() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: () => null,
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.primary,
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="search" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="notifications" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerIcon}
                onPress={handleSignOut}
              >
                <Ionicons name="log-out" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Image 
                source={require('../../assets/images/gotg-logo.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        {/* Stories Section */}
        <View style={styles.storiesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.storyItem}>
              <View style={styles.storyAddButton}>
                <Ionicons name="add-circle" size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.storyText}>Add Story</Text>
            </TouchableOpacity>
            {[1, 2, 3, 4, 5].map((item) => (
              <TouchableOpacity key={item} style={styles.storyItem}>
                <Image
                  source={{ uri: `https://picsum.photos/200/300?random=${item}` }}
                  style={styles.storyImage}
                />
                <Text style={styles.storyText}>User {item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Create Post Section */}
        <View style={styles.createPostContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/200' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.createPostInput}>
            <Text style={styles.createPostText}>What's on your mind?</Text>
          </TouchableOpacity>
        </View>

        {/* Posts Section */}
        {[1, 2, 3].map((post) => (
          <View key={post} style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: `https://picsum.photos/200?random=${post}` }}
                style={styles.postProfileImage}
              />
              <View style={styles.postHeaderInfo}>
                <Text style={styles.postName}>User {post}</Text>
                <Text style={styles.postTime}>2 hours ago</Text>
              </View>
            </View>
            <Text style={styles.postText}>
              This is a sample post {post} for Girls on the Go community. Join us in our next event!
            </Text>
            <Image
              source={{ uri: `https://picsum.photos/400/300?random=${post}` }}
              style={styles.postImage}
            />
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="heart-outline" size={24} color={COLORS.textSecondary} />
                <Text style={styles.postActionText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="chatbubble-outline" size={24} color={COLORS.textSecondary} />
                <Text style={styles.postActionText}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postAction}>
                <Ionicons name="share-social-outline" size={24} color={COLORS.textSecondary} />
                <Text style={styles.postActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={COLORS.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="people" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="menu" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 210,
    height: 65,
  },
  headerRight: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: -55,
  },
  headerIcon: {
    marginLeft: 15,
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  storiesContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  storyImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  storyAddButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.background,
    borderWidth: 3,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyText: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.text,
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  createPostInput: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    padding: 12,
  },
  createPostText: {
    color: COLORS.textSecondary,
  },
  postContainer: {
    backgroundColor: COLORS.background,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  postHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  postProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postHeaderInfo: {
    flex: 1,
  },
  postName: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: 16,
  },
  postTime: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  postText: {
    padding: 15,
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postActions: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  postAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  postActionText: {
    marginLeft: 5,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
}); 