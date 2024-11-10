import { useEffect, useState } from 'react';
import { OpenSocket } from '@opensocket/core-js';
import type { Message } from '@opensocket/core-js';

/**
 * useChannel hook - return message on a given channel
 * @param {string} channelName channel to subscribe
 * @param {string | string[] | object} eventsOrOptions events or options to subscribe on a given channel
 * @returns {Promise<string | string[] | object>} message
 */
export const useChannel = (channelName: string, eventsOrOptions?: string | string[] | object) => {
  const [state, setState] = useState<Message | undefined>(undefined);

  useEffect(() => {
    if (eventsOrOptions) {
      OpenSocket?.realtime?.subscribe(channelName, eventsOrOptions, (message) => {
        setState(message as Message);
      });
    } else {
      OpenSocket?.realtime?.subscribe(channelName, (message) => {
        setState(message as Message);
      });
    }
    return () => {
      OpenSocket?.realtime?.unsubscribe(channelName);
    };
  }, [channelName, JSON.stringify(eventsOrOptions)]);

  return state;
};
