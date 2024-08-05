import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { AUTHENTICATION_TIMEOUTS, IS_MOBILE_APP, STORAGE_KEYS } from '@/constants';
import { endSession } from '@/utils';
import { ROUTE_ACCOUNT } from '@/popup/router/routeNames';
import migrateHiddenCardsVuexToComposable from '@/migrations/004-hidden-cards-vuex-to-composables';
import migrateOtherSettingsVuexToComposable from '@/migrations/005-other-settings-vuex-to-composables';
import { IOtherSettings } from '@/types';
import { useStorageRef } from './storageRef';

/** Control the route that would be visible after opening the extension. */
const homeRouteName = ref(ROUTE_ACCOUNT);

/** Defines if user is using the app. Equals `false` when the app browser tab is inactive. */
const isAppActive = ref(false);

/** Control global loader animation put above all other layers. */
const isLoaderVisible = ref(false);

/** Control layer, that allows to close full-screen camera view on mobile devices. */
const isMobileQrScannerVisible = ref(false);

/** Holds the progress of the current multipart QR code scan. If -1, QR is not multipart */
const scanProgress = ref(-1);

const loginTargetLocation = ref<RouteLocationRaw>({ name: ROUTE_ACCOUNT });
const lastTimeAppWasActive = ref<number>();

const hiddenCards = useStorageRef<string[]>(
  [],
  STORAGE_KEYS.hiddenCards,
  {
    migrations: [
      migrateHiddenCardsVuexToComposable,
    ],
  },
);
const otherSettings = useStorageRef<IOtherSettings>(
  {
    secureLoginTimeout: IS_MOBILE_APP ? AUTHENTICATION_TIMEOUTS[0] : AUTHENTICATION_TIMEOUTS[5],
  },
  STORAGE_KEYS.otherSettings,
  {
    migrations: [
      migrateOtherSettingsVuexToComposable,
    ],
  },
);

const isSeedBackedUp = computed(() => !!otherSettings.value.isSeedBackedUp);
const saveErrorLog = computed(() => !!otherSettings.value.saveErrorLog);
const isBiometricLoginEnabled = computed(() => !!otherSettings.value.isBiometricLoginEnabled);
const secureLoginTimeout = computed(() => otherSettings.value.secureLoginTimeout);

export function useUi() {
  function setHomeRouteName(routeName: string, onChangeCallback?: () => any) {
    if (homeRouteName.value !== routeName) {
      homeRouteName.value = routeName;
      if (onChangeCallback) {
        onChangeCallback();
      }
    }
  }

  function setLoaderVisible(show: boolean) {
    isLoaderVisible.value = show;
  }

  function setLoginTargetLocation(location: RouteLocationRaw) {
    loginTargetLocation.value = location;
  }

  function setMobileQrScannerVisible(open: boolean) {
    document.documentElement?.classList[(open) ? 'add' : 'remove']('scanner-active');
    isMobileQrScannerVisible.value = open;
  }

  function handleVisibilityChange() {
    isAppActive.value = !document.hidden;
  }

  function setCardHidden(cardId: string) {
    hiddenCards.value.push(cardId);
  }

  function setBackedUpSeed(val: boolean) {
    otherSettings.value.isSeedBackedUp = val;
  }

  function setSaveErrorLog(val: boolean) {
    otherSettings.value.saveErrorLog = val;
  }

  function setBiometricLoginEnabled(val: boolean) {
    otherSettings.value.isBiometricLoginEnabled = val;
  }

  function setSecureLoginTimeout(ms: number) {
    if (ms === 0) {
      endSession();
    }
    otherSettings.value.secureLoginTimeout = ms;
  }

  function initVisibilityListeners() {
    handleVisibilityChange();
    onMounted(() => {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  }

  watch(
    isAppActive,
    async (isActive, wasActive) => {
      // App went to background
      if (wasActive && !isActive) {
        lastTimeAppWasActive.value = Date.now();
      }
    },
  );

  function resetUiSettings() {
    hiddenCards.value = [];
    otherSettings.value = {
      secureLoginTimeout: IS_MOBILE_APP ? AUTHENTICATION_TIMEOUTS[0] : AUTHENTICATION_TIMEOUTS[5],
    };
  }

  return {
    homeRouteName,
    hiddenCards,
    isAppActive,
    loginTargetLocation,
    isMobileQrScannerVisible,
    scanProgress,
    isLoaderVisible,
    isSeedBackedUp,
    saveErrorLog,
    isBiometricLoginEnabled,
    secureLoginTimeout,
    lastTimeAppWasActive,
    initVisibilityListeners,
    setCardHidden,
    setBackedUpSeed,
    setSaveErrorLog,
    setHomeRouteName,
    setLoginTargetLocation,
    setMobileQrScannerVisible,
    setLoaderVisible,
    resetUiSettings,
    setBiometricLoginEnabled,
    setSecureLoginTimeout,
  };
}
