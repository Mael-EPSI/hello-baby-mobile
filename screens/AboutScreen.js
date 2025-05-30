import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👶 Qui sommes-nous ?</Text>

      <Text style={styles.paragraph}>
        Hello Baby est une application pensée par des jeunes parents, pour des jeunes parents.
        Notre objectif : vous accompagner dans les premiers mois de votre aventure familiale.
      </Text>

      <Text style={styles.paragraph}>
        💡 Des conseils validés par des professionnels de la petite enfance, une communauté bienveillante
        pour échanger, et des outils pratiques pour simplifier votre quotidien.
      </Text>

      <Text style={styles.paragraph}>
        Notre équipe est composée de développeurs, pédiatres, sages-femmes et mamans qui
        connaissent les vraies galères et les vraies joies de la parentalité.
      </Text>

      <Text style={styles.signature}>L'équipe Hello Baby ❤️</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    color: '#4A6CF7',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#444',
  },
  signature: {
    marginTop: 20,
    textAlign: 'right',
    fontStyle: 'italic',
    color: '#777',
  },
});
