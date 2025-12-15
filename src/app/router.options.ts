export default {
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      // Wait a tick so the target element exists before scrolling
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve({ el: to.hash, behavior: "smooth" });
        });
      });
    }
    return { top: 0 };
  },
};
