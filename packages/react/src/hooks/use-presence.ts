import { useEffect, useState } from 'react';
import { OpenSocket } from '@opensocket/core-js';
import type { PresenceMember } from '@opensocket/core-js';

/**
 * usePresence hook - return presence list on a given channel
 * @param {string} channel channel to subscribe presence on
 * @param {string | string[]}events presence on a given event topic
 * @returns {Promise<object>} presence list
 */
export const usePresence = (channel: string, events?: string | string[]) => {
  const [presence, setPresence] = useState<PresenceMember>({} as PresenceMember);

  useEffect(() => {
    if (events) {
      OpenSocket?.realtime?.presence(channel, events, (presence) => {
        setPresence(presence as PresenceMember);
      });
      return;
    } else {
      OpenSocket?.realtime?.presence(channel, (presence) => {
        setPresence(presence as PresenceMember);
      });
    }
    return;
  }, [channel, events]);

  return presence;
};
