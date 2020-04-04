document.addEventListener('DOMContentLoaded', async () => {
  const submitButton = document.getElementById('submit');
  const results = document.getElementById('results');
  results.hidden = true;

  submitButton.addEventListener('click', async () => {
    const toInput = document.getElementById('to').value;
    const message = document.getElementById('message').value;
    const data = {
      to: toInput,
      message
    };
    console.log(data);
    const response = await fetch(`/.netlify/functions/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const messageSent = await response.text();
    if (messageSent) {
      results.hidden = false;
      results.innerHTML = messageSent;
    }
  });
});
