import { useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { claudeService } from '../services/claudeService';
import { usePersonaStore } from '../stores/personaStore';
import { useLocationStore } from '../stores/locationStore';
import { useHealthStore } from '../stores/healthStore';
import type { ChatMessage } from '../types/ai.types';

let msgIdCounter = 0;
function nextId() {
  return `msg_${++msgIdCounter}_${Date.now()}`;
}

export function useClaudeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const persona = usePersonaStore((s) => s.persona);
  const currentZone = useLocationStore((s) => s.currentZone);
  const miqatAssignment = useLocationStore((s) => s.miqatAssignment);
  const miqatStatus = useLocationStore((s) => s.miqatStatus);
  const ihramState = useLocationStore((s) => s.ihramState);
  const heatStatus = useHealthStore((s) => s.heatStatus);
  const currentTemp = useHealthStore((s) => s.currentTempCelsius);

  const sendMessage = useCallback(
    async (query: string) => {
      if (!persona || isLoading) return;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: 'user',
        content: query,
        timestamp: new Date(),
        source: 'claude_api',
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Stream assistant response
      const streamingId = nextId();
      setMessages((prev) => [
        ...prev,
        {
          id: streamingId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          source: 'claude_api',
          isStreaming: true,
        },
      ]);

      try {
        const netState = await NetInfo.fetch();
        const isOnline = netState.isConnected ?? false;

        const result = await claudeService.processQuery({
          query,
          persona,
          currentZone,
          miqatName: miqatAssignment,
          miqatStatus,
          currentTemp,
          heatStatus,
          ihramState,
          isOnline,
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamingId ? { ...m, content: m.content + token } : m
              )
            );
          },
        });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? {
                  ...m,
                  content: result.answer,
                  source: result.source,
                  isStreaming: false,
                }
              : m
          )
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? { ...m, content: 'Error — please try again.', isStreaming: false }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [persona, currentZone, miqatAssignment, miqatStatus, ihramState, heatStatus, currentTemp, isLoading]
  );

  return { messages, isLoading, sendMessage };
}
