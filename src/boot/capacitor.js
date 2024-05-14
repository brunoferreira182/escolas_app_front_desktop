import { defineCustomElements } from '@ionic/pwa-elements/loader';

export default async ({ app, router, store }) => {
  defineCustomElements(window)

}