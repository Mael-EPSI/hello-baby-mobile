import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Bonjour ! Je suis votre assistant parental IA. Je peux vous aider avec des questions sur votre bébé, des conseils de santé, ou simplement discuter de vos préoccupations de parent. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const quickQuestions = [
    "Mon bébé pleure beaucoup, que faire ?",
    "Quand commencer la diversification ?",
    "Conseils pour le sommeil",
    "Fièvre chez le nourrisson",
    "Premiers secours bébé"
  ];

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simuler la réponse de l'IA
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('pleure') || lowerQuestion.includes('pleur')) {
      return `😊 Les pleurs de bébé peuvent avoir plusieurs causes :

🍼 **Faim** - Vérifiez s'il est l'heure du repas
😴 **Fatigue** - Essayez de le bercer ou créer un environnement calme  
💨 **Inconfort** - Vérifiez la couche, les vêtements trop serrés
🤗 **Besoin de contact** - Parfois bébé a juste besoin de câlins

**Techniques apaisantes :**
• Emmaillotage léger
• Bruit blanc ou berceuses
• Mouvement doux (bercement)
• Succion (tétine ou doigt propre)

⚠️ Si les pleurs persistent plus de 3h/jour pendant plusieurs jours, consultez votre pédiatre.`;
    }
    
    if (lowerQuestion.includes('diversification') || lowerQuestion.includes('aliment')) {
      return `🥄 **Diversification alimentaire**

**Âge recommandé :** Entre 4 et 6 mois révolus

**Premiers aliments :**
• Légumes : carotte, courgette, haricots verts
• Fruits : pomme, poire, banane
• Texture lisse et onctueuse

**Règles importantes :**
✅ Un nouvel aliment à la fois (3-4 jours)
✅ Commencer par de petites quantités  
✅ Respecter l'appétit de bébé
❌ Pas de sel, sucre, miel avant 1 an

**Signes de prêtesse :**
• Tient sa tête droite
• Montre de l'intérêt pour la nourriture
• Perte du réflexe de protrusion de la langue

💡 Consultez votre pédiatre avant de commencer !`;
    }
    
    if (lowerQuestion.includes('sommeil') || lowerQuestion.includes('dor')) {
      return `😴 **Conseils pour le sommeil de bébé**

**Routine de coucher :**
🛁 Bain tiède et relaxant
📖 Histoire ou berceuse douce
🤗 Câlins et bisous
🛏️ Coucher éveillé mais somnolent

**Environnement optimal :**
• Temperature : 18-20°C
• Obscurité ou veilleuse douce
• Silence ou bruit blanc
• Matelas ferme et sécurisé

**Selon l'âge :**
• 0-3 mois : 14-17h/jour
• 4-11 mois : 12-15h/jour
• 1-2 ans : 11-14h/jour

⚠️ **Position sécurisée :** Toujours sur le dos pour dormir

Des difficultés d'endormissement sont normales. Soyez patient et cohérent avec la routine !`;
    }
    
    if (lowerQuestion.includes('fièvre') || lowerQuestion.includes('température')) {
      return `🌡️ **Fièvre chez le nourrisson**

**Quand s'inquiéter :**
🚨 **Urgence si :**
• Moins de 3 mois avec fièvre > 38°C
• Plus de 3 mois avec fièvre > 39°C
• Fièvre + signes de détresse

**Premiers gestes :**
• Découvrir légèrement bébé
• Donner à boire régulièrement
• Surveiller les signes vitaux
• Prendre la température rectale

**Signes d'alarme :**
❌ Difficultés respiratoires
❌ Refus de boire
❌ Somnolence excessive
❌ Pleurs inconsolables
❌ Éruption cutanée

🏥 **CONSULTEZ IMMÉDIATEMENT** en cas de doute !

💊 Ne donnez des médicaments qu'après avis médical.`;
    }

    // Réponse générale
    return `💡 Merci pour votre question ! 

C'est une préoccupation courante chez les parents. Chaque bébé est unique et se développe à son propre rythme.

**Mes recommandations générales :**
• Faites confiance à votre instinct parental
• N'hésitez pas à consulter votre pédiatre
• Gardez un journal des habitudes de bébé
• Rejoignez notre communauté sur le forum

**Ressources utiles :**
📱 Consultez nos guides dans la section "Conseils"
👥 Partagez votre expérience sur le forum
📞 Numéros d'urgence toujours disponibles

Avez-vous une question plus spécifique ? Je suis là pour vous aider ! 😊`;
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.isBot ? styles.botMessage : styles.userMessage]}>
      {item.isBot && (
        <View style={styles.botAvatar}>
          <Ionicons name="bulb" size={16} color={Colors.primary} />
        </View>
      )}
      <View style={[styles.messageBubble, item.isBot ? styles.botBubble : styles.userBubble]}>
        <Text style={[styles.messageText, item.isBot ? styles.botText : styles.userText]}>
          {item.text}
        </Text>
        <Text style={styles.messageTime}>
          {item.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.aiAvatar}>
            <Ionicons name="bulb" size={24} color={Colors.surface} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Assistant Parental IA</Text>
            <Text style={styles.headerSubtitle}>
              {isTyping ? 'En train d\'écrire...' : 'En ligne • Réponse instantanée'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.quickQuestionsTitle}>Questions fréquentes :</Text>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => handleQuickQuestion(question)}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.botAvatar}>
            <Ionicons name="bulb" size={16} color={Colors.primary} />
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.typingText}>Assistant en train d'écrire...</Text>
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Posez votre question..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isTyping}
        >
          <Ionicons name="send" size={20} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Emergency Button */}
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={() => Alert.alert(
          '🚨 Urgence Médicale',
          'En cas d\'urgence médicale, appelez immédiatement le 15 (SAMU) ou le 112.\n\nCet assistant ne remplace pas un avis médical professionnel.',
          [
            { text: 'Compris', style: 'default' },
            { text: 'Appeler 15', style: 'destructive', onPress: () => {} }
          ]
        )}
      >
        <Ionicons name="medical" size={16} color={Colors.surface} />
        <Text style={styles.emergencyText}>Urgence Médicale</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.surface,
    opacity: 0.8,
    marginTop: 2,
  },
  quickQuestionsContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  quickQuestionButton: {
    backgroundColor: Colors.lightGray,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  quickQuestionText: {
    fontSize: 14,
    color: Colors.primary,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: Spacing.sm,
    alignItems: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  botBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.sm,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: Colors.text,
  },
  userText: {
    color: Colors.surface,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.gray,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginLeft: Spacing.sm,
  },
  typingText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  emergencyButton: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  emergencyText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});
