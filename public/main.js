const lomake = document.getElementById('todoForm');
const viestiElementti = document.getElementById('message');

lomake.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nimiInput = document.getElementById('userInput').value;
    const tehtavaInput = document.getElementById('todoInput').value;

    try {
        const vastaus = await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nimi: nimiInput, tehtava: tehtavaInput }),
        });

        if (!vastaus.ok) {
            throw new Error(await vastaus.text());
        }

        const viesti = await vastaus.text();
        viestiElementti.textContent = viesti;
        lomake.reset();
    } catch (virhe) {
        viestiElementti.textContent = `Virhe: ${virhe.message}`;
    }
});
