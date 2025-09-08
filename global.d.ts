// global.d.ts
import { SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    supabaseInstance?: SupabaseClient;
    OneSignal?: {
      init: (options: {
        appId: string;
        safari_web_id?: string;
        notifyButton?: { enable: boolean };
        allowLocalhostAsSecureOrigin?: boolean;
      }) => void;
      getUserId: () => Promise<string | null>;
      push: (callback: () => void) => void;
    };
  }
}

// Allow custom web component used by Vturb player
declare namespace JSX {
  interface IntrinsicElements {
    'vturb-smartplayer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      id?: string;
      style?: React.CSSProperties;
    };
  }
}

export {};
