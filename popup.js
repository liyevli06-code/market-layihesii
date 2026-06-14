document.getElementById('scanBtn').addEventListener('click', startScan);

function startScan() {
  const btn = document.getElementById('scanBtn');
  const status = document.getElementById('status');
  const networksDiv = document.getElementById('networks');
  const countDiv = document.getElementById('count');
  
  btn.disabled = true;
  btn.textContent = '⏳ Skan edilir...';
  status.textContent = 'Wi-Fi şəbəkələri axtarılır...';
  networksDiv.innerHTML = '';
  countDiv.textContent = '';
  
  chrome.runtime.sendMessage({ action: 'scan' }, (response) => {
    btn.disabled = false;
    btn.textContent = '📡 Skan et';
    
    if (response.error) {
      status.innerHTML = `<span class="error">❌ Xəta: ${response.error}</span>`;
      return;
    }
    
    const networks = response.networks;
    if (!networks || networks.length === 0) {
      status.textContent = 'Heç bir Wi-Fi şəbəkəsi tapılmadı';
      return;
    }
    
    status.textContent = `✅ Skan tamamlandı`;
    countDiv.textContent = `${networks.length} şəbəkə aşkarlandı`;
    
    networks.sort((a, b) => b.signalStrength - a.signalStrength);
    
    networks.forEach(net => {
      const div = document.createElement('div');
      div.className = 'network';
      
      // Security class
      let secClass = 'wpa2';
      let secText = net.security || 'WPA2';
      if (net.security && net.security.includes('WEP')) {
        secClass = 'wep';
        secText = '⚠️ WEP';
      } else if (net.security && net.security.includes('WPA3')) {
        secClass = 'wpa3';
        secText = '✅ WPA3';
      } else if (!net.security || net.security === 'None' || net.security === 'Open') {
        secClass = 'open';
        secText = '🔓 Açıq';
      }
      
      // Signal bars
      const signalBars = Math.min(5, Math.max(1, Math.round((net.signalStrength + 90) / 10)));
      
      div.innerHTML = `
        <div class="ssid">${net.ssid}</div>
        <div class="details">
          <span style="font-family: monospace;">${net.bssid || '??:??:??:??:??:??'}</span>
          <span>Kanal: ${net.channel || '?'}</span>
        </div>
        <div class="details">
          <span class="security ${secClass}">${secText}</span>
          <div class="signal">
            ${[1,2,3,4,5].map(i => 
              `<div class="dot ${i <= signalBars ? 'active' : ''}"></div>`
            ).join('')}
            <span>${net.signalStrength || '?'} dBm</span>
          </div>
        </div>
      `;
      
      networksDiv.appendChild(div);
    });
  });
}
