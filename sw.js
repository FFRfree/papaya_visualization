const VERSION = 'v1'
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(VERSION);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(VERSION);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/',
      'index.html',
      'otherData/MBMv5_13lobe+nuclei.nii.gz',
      'otherData/MBMv5_13lobe.nii.gz',
      'otherData/MBMv5_17lobe+nuclei.nii.gz',
      'otherData/MBMv5_17lobe.nii.gz',
      'otherData/MBMv5_Template.nii.gz',
      'otherData/Template_sym_MTR_80um_CERB_small.nii.gz',
      'otherData/atlas_Marmoset_CERB_13lobe_change_gmmasked.nii.gz',
      'otherData/atlas_Marmoset_CERB_13lobe_group.shape.gii',
      'otherData/atlas_Marmoset_CERB_17lobe_change_gmmasked.nii.gz',
      'otherData/atlas_Marmoset_CERB_17lobe_group.shape.gii',
      'otherData/sub_all_5k_8k_gradient1_group.func.gii',
      'otherData/sub_all_gradient1_group.func.gii',
      'otherData/surfFS.CERB.pial_shifti.surf(1).gii',
      'gradients/shortMBMv5_Cerebello-cerebellar_gradient1.func.gii',
      'gradients/shortMBMv5_Cerebello-cerebellar_gradient2.func.gii',
      'gradients/shortMBMv5_Cerebello-cerebellar_gradient3.func.gii',
      'gradients/shortMBMv5_Intra-cerebellar_gradient1.func.gii',
      'gradients/shortMBMv5_Intra-cerebellar_gradient2.func.gii',
      'gradients/shortMBMv5_Intra-cerebellar_gradient3.func.gii',
      'gradients/short_MBMv5_Cerebello-cerebellar_gradient1.nii.gz',
      'gradients/short_MBMv5_Cerebello-cerebellar_gradient2.nii.gz',
      'gradients/short_MBMv5_Cerebello-cerebellar_gradient3.nii.gz',
      'gradients/short_MBMv5_Intra-cerebellar_gradient1.nii.gz',
      'gradients/short_MBMv5_Intra-cerebellar_gradient2.nii.gz',
      'gradients/short_MBMv5_Intra-cerebellar_gradient3.nii.gz',
      'gradients/short_MBMv5_nuclei_neocortex_gradient1.nii.gz',
      'gradients/short_MBMv5_nuclei_neocortex_gradient2.nii.gz',
      'gradients/short_MBMv5_nuclei_neocortex_gradient3.nii.gz'

    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: '/gallery/myLittleVader.jpg',
    })
  );
});
