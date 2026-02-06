// Background service worker for tmusic extension
// Handles extension icon clicks and opens the visualization app
chrome.action.onClicked.addListener(async tab => {
  try {
    const currentTabId = tab.id;
    if (!currentTabId) {
      console.error('No tab ID found');
      return;
    }
    await chrome.storage.session.set({ sourceTabId: currentTabId });
    await chrome.tabs.create({
      url: 'index.html',
      openerTabId: currentTabId,
    });
  } catch (error) {
    console.error('Error opening tmusic:', error);
  }
});
