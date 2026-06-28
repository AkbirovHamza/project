document.getElementById('tgForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const btn = document.querySelector('#tgForm .btn');
  const status = document.getElementById('tgStatus');
  
  // ТВОИ ДАННЫЕ (уже вставлены)
  const BOT_TOKEN = '8716681980:AAGItB01NDrp17bKF8g4pAFsorStzgdFZG8';
  const CHAT_ID = '6347284771';
  
  const name = document.getElementById('tgName').value.trim();
  const phone = document.getElementById('tgPhone').value.trim();
  const date = document.getElementById('tgDate').value;
  const time = document.getElementById('tgTime').value;
  const comment = document.getElementById('tgComment').value.trim() || '—';
  
  if (!name || !phone || !date || !time) {
    status.className = 'error';
    status.textContent = '⚠️ Заполните все обязательные поля!';
    return;
  }
  
  const message = `🆕 НОВАЯ ЗАЯВКА В КАФЕ\n\n` +
                  `👤 Имя: ${name}\n` +
                  `📞 Телефон: ${phone}\n` +
                  `📅 Дата: ${date}\n` +
                  `⏰ Время: ${time}\n` +
                  `📝 Пожелания: ${comment}\n\n` +
                  `📍 Отправлено с сайта "Уют"`;
  
  btn.disabled = true;
  btn.innerHTML = '⏳ Отправка...';
  status.className = '';
  status.textContent = '';
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    
    if (data.ok) {
      status.className = 'success';
      status.textContent = '✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время. ☕';
      document.getElementById('tgForm').reset();
    } else {
      console.error('Telegram error:', data);
      status.className = 'error';
      status.textContent = '❌ Ошибка отправки. Попробуйте позже или позвоните нам.';
    }
  } catch (error) {
    console.error('Network error:', error);
    status.className = 'error';
    status.textContent = '❌ Нет соединения с интернетом. Проверьте связь.';
  }
  
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
});