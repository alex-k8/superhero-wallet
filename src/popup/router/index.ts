import Vue from 'vue';
import VueRouter from 'vue-router';
import { Dictionary } from '../../types';
import {
  ROUTE_ACCOUNT,
  ROUTE_INDEX,
} from './routeNames';
import { routes } from './routes';
import getPopupProps from '../utils/getPopupProps';
import store from '../../store';
import initSdk from '../../lib/wallet';
import {
  APP_LINK_WEB,
  POPUP_TYPE_CONNECT,
  POPUP_TYPE_SIGN,
  POPUP_TYPE_MESSAGE_SIGN,
  POPUP_TYPE_RAW_SIGN,
  watchUntilTruthy,
  POPUP_TYPE_TX_SIGN,
} from '../utils';
import {
  RUNNING_IN_POPUP,
  POPUP_TYPE,
  IS_CORDOVA,
  IS_WEB,
} from '../../lib/environment';
import { useAccounts } from '../../composables';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: IS_WEB ? 'history' : 'hash',
  scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
});

const lastRouteKey = 'last-path';

const { isLoggedIn } = useAccounts({ store });

const unbind = router.beforeEach(async (to, from, next) => {
  await watchUntilTruthy(() => store.state.isRestored);
  next(
    (
      !RUNNING_IN_POPUP
      && to.name === ROUTE_INDEX
      && (await browser?.storage.local.get(lastRouteKey))[lastRouteKey])
    || undefined,
  );
  unbind();
});

router.beforeEach(async (to, from, next) => {
  if (!isLoggedIn.value) {
    if (to.meta?.ifNotAuthOnly || to.meta?.ifNotAuth) {
      next();
    } else {
      store.commit('setLoginTargetLocation', to);
      next({ name: ROUTE_INDEX });
    }
    return;
  }

  if (!store.getters['sdkPlugin/sdk'] && !RUNNING_IN_POPUP) initSdk();

  if (RUNNING_IN_POPUP) {
    const name = {
      [POPUP_TYPE_CONNECT]: 'connect',
      [POPUP_TYPE_SIGN]: 'popup-sign-tx',
      [POPUP_TYPE_RAW_SIGN]: 'popup-raw-sign',
      [POPUP_TYPE_MESSAGE_SIGN]: 'message-sign',
      [POPUP_TYPE_TX_SIGN]: 'transaction-sign',
    }[POPUP_TYPE];

    if (name !== to.name) {
      next({ name, params: await getPopupProps() as Dictionary });
      return;
    }
  }

  next(to.meta?.ifNotAuthOnly ? { name: ROUTE_ACCOUNT } : undefined);
});

router.afterEach(async (to) => {
  if (RUNNING_IN_POPUP) return;
  if (to.meta?.notPersist) {
    await browser?.storage.local.remove(lastRouteKey);
  } else {
    await browser?.storage.local.set({ [lastRouteKey]: to.path });
  }
});

const deviceReadyPromise = new Promise((resolve) => document.addEventListener('deviceready', resolve));

const routerReadyPromise = new Promise((resolve) => {
  const unbindAfterEach = router.afterEach(() => {
    resolve(true);
    setTimeout(unbindAfterEach);
  });
});

if (IS_CORDOVA) {
  (async () => {
    await Promise.all([deviceReadyPromise, routerReadyPromise]);
    window.IonicDeeplink.onDeepLink(({ url }: any) => {
      const prefix = ['superhero:', `${APP_LINK_WEB}/`].find((p) => url.startsWith(p));
      if (!prefix) throw new Error(`Unknown url: ${url}`);
      try {
        window.location.href = `#/${url.slice(prefix.length)}`;
      } catch (error: any) {
        if (error.name !== 'NavigationDuplicated') throw error;
      }
    });

    router.afterEach((to) => {
      if (to.path === '/') {
        document.body.classList.remove('color-bg-app');
      } else {
        document.body.classList.add('color-bg-app');
      }
    });
  })();
}

export default router;
