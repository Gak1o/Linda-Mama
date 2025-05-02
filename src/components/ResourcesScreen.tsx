import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Text } from 'react-native-paper';

// Define the article interface
interface Article {
  id: string;
  title: string;
  image: string;
  content: string;
}

const ResourcesScreen = ({ navigation }: any) => {
  // State to track which article is being viewed
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Sample articles data
  const articles: Article[] = [
    {
      id: '1',
      title: 'Nutrition During Pregnancy',
      image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500',
      content: `Proper nutrition during pregnancy is crucial for both maternal health and fetal development. Here are some key nutrients to focus on:

1. Folate/Folic Acid: Essential for preventing neural tube defects. Found in leafy greens, fortified cereals, and beans.

2. Iron: Supports increased blood volume and prevents anemia. Good sources include lean meats, beans, and fortified cereals.

3. Calcium: Builds strong bones and teeth. Dairy products, fortified plant milks, and leafy greens are excellent sources.

4. Protein: Supports tissue growth. Include lean meats, poultry, fish, eggs, beans, and tofu in your diet.

5. Omega-3 Fatty Acids: Important for brain and eye development. Found in fatty fish, walnuts, and flaxseeds.

Remember to stay hydrated by drinking plenty of water throughout the day. Consult with your healthcare provider about prenatal vitamins to ensure you're getting all the necessary nutrients.`
    },
    {
      id: '2',
      title: 'Safe Exercises During Pregnancy',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500',
      content: `Staying active during pregnancy offers numerous benefits, including improved mood, better sleep, and preparation for childbirth. Here are some safe exercises to consider:

1. Walking: A gentle, low-impact activity that can be done throughout pregnancy.

2. Swimming: Provides cardiovascular benefits while supporting your weight and reducing strain on joints.

3. Prenatal Yoga: Improves flexibility, strengthens muscles, and teaches breathing techniques useful for labor.

4. Stationary Cycling: A safe way to get cardio exercise without risking falls.

5. Modified Strength Training: Using light weights helps maintain muscle tone.

Always consult with your healthcare provider before starting or continuing any exercise program during pregnancy. Listen to your body and avoid exercises that cause discomfort. Stay hydrated and avoid overheating during workouts.`
    },
    {
      id: '3',
      title: 'Managing Pregnancy Symptoms',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500',
      content: `Pregnancy brings various physical changes and symptoms. Here are some common symptoms and tips for managing them:

1. Morning Sickness: Try eating small, frequent meals, ginger tea, and avoiding triggering smells.

2. Fatigue: Rest when possible, maintain a regular sleep schedule, and consider short naps during the day.

3. Back Pain: Practice good posture, use proper body mechanics when lifting, and consider prenatal massage.

4. Heartburn: Eat smaller meals, avoid spicy or acidic foods, and don't lie down immediately after eating.

5. Swelling: Elevate your feet when sitting, avoid standing for long periods, and wear comfortable shoes.

6. Constipation: Stay hydrated, eat fiber-rich foods, and maintain physical activity as approved by your doctor.

Always discuss persistent or severe symptoms with your healthcare provider. Remember that each pregnancy is unique, and what works for one person may not work for another.`
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resources</Text>
      
      <ScrollView style={styles.articleContainer}>
        {articles.map(article => (
          <TouchableOpacity 
            key={article.id} 
            style={styles.articleItem}
            onPress={() => setSelectedArticle(article)}
          >
            <Image 
              source={{ uri: article.image }} 
              style={styles.articleImage} 
              resizeMode="cover"
            />
            <Text style={styles.articleTitle}>{article.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for displaying the full article */}
      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <Image 
                source={{ uri: selectedArticle.image }} 
                style={styles.modalImage} 
                resizeMode="cover"
              />
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
              <Text style={styles.modalText}>{selectedArticle.content}</Text>
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setSelectedArticle(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  articleContainer: {
    flex: 1,
    marginTop: 20,
  },
  articleItem: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  articleTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResourcesScreen;
