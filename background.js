chrome.wifi.onWifiChanged.addListener((networks) => {
  console.log('Wi-Fi şəbəkələri yeniləndi:', networks);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    chrome.wifi.scan((networks) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
        return;
      }
      
      // Wi-Fi şəbəkələrini formatla
      const formatted = networks.map(net => ({
        ssid: net.ssid || '[Gizli]',
        bssid: net.bssid,
        security: net.security,
        signalStrength: net.signalStrength,
        channel: net.channel,
        frequency: net.frequency
      }));
      
      sendResponse({ networks: formatted });
    });
    return true; // Async response üçün
  }
});
