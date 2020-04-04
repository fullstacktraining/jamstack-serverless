document.addEventListener('DOMContentLoaded', async () => {
  const submitButton = document.getElementById('submit');
  const results = document.getElementById('results');
  results.hidden = true;

  const buildResultCard = character => {
    return `
    <div class="w-full lg:max-w-full lg:flex">
      <div class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style="background-image: url('${character.thumbnail.path}.${character.thumbnail.extension}')" title="${character.name}">
      </div>
      <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div class="mb-8">
          <p class="text-sm text-gray-600 flex items-center">
            <a href="${character.urls[0].url}">Read more</a>
          </p>
          <div class="text-gray-900 font-bold text-xl mb-2">${character.name}</div>
          <p class="text-gray-700 text-base">${character.description}</p>
        </div>
      </div>
    </div>
    `
  };

  submitButton.addEventListener('click', async () => {
    const characterInput = document.getElementById('character').value;
    console.log(characterInput);
    const response = await fetch(`https://lf4noq9mwi.execute-api.us-east-1.amazonaws.com/dev/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: characterInput })
    });
    const character = await response.json();
    const characterData = JSON.parse(character).data.results
    if (characterData.length > 0) {
      results.innerHTML = '';
      results.hidden = false;
      characterData.forEach(character => {
        results.innerHTML += buildResultCard(character);
      });
    }
  });
});
