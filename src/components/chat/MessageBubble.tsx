import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { DisclaimerBadge } from './DisclaimerBadge';
import type { ChatMessage } from '../../types/ai.types';

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.assistantWrapper]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
        </Text>
        {message.isStreaming && (
          <ActivityIndicator size="small" color={Colors.brandGreen} style={styles.loading} />
        )}
      </View>
      {!isUser && !message.isStreaming && (
        <DisclaimerBadge source={message.source} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.sm, maxWidth: '85%' },
  userWrapper: { alignSelf: 'flex-end' },
  assistantWrapper: { alignSelf: 'flex-start' },
  bubble: {
    borderRadius: 16,
    padding: Spacing.md,
  },
  userBubble: {
    backgroundColor: Colors.brandGreen,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0D8C8',
  },
  text: { fontSize: 16, lineHeight: 24 },
  userText: { color: Colors.white },
  assistantText: { color: Colors.textPrimary },
  loading: { marginTop: 4 },
});
