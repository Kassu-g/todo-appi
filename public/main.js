const lomake = document.getElementById('todoForm');
const viestiElementti = document.getElementById('message');
const searchForm = document.getElementById('searchForm');
const todosList = document.getElementById('todosList');
const searchMessage = document.getElementById('searchMessage');
const deleteUserButton = document.getElementById('deleteUser');
const deleteMessage = document.getElementById('deleteMessage');

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
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchInput = document.getElementById('searchInput').value;

    try {
        const response = await fetch(`/todos/${searchInput}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        todosList.innerHTML = '';
        searchMessage.textContent = '';
        deleteMessage.textContent = '';
        const todos = await response.json();

        todos.forEach(todo => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.classList.add('delete-task');
            a.textContent = todo;
            li.appendChild(a);
            todosList.appendChild(li);

            a.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    const deleteResponse = await fetch('/delete', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            nimi: searchInput,
                            tehtava: todo,
                        }),
                    });

                    if (!deleteResponse.ok) {
                        throw new Error(await deleteResponse.text());
                    }

                    deleteMessage.textContent = await deleteResponse.text();
                    li.remove();
                } catch (error) {
                    deleteMessage.textContent = `Virhe: ${error.message}`;
                }
            });
        });

        deleteUserButton.style.display = 'inline-block';
        deleteUserButton.onclick = async () => {
            try {
                const deleteResponse = await fetch('/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nimi: searchInput }),
                });

                if (!deleteResponse.ok) {
                    throw new Error(await deleteResponse.text());
                }

                deleteMessage.textContent = await deleteResponse.text();
                todosList.innerHTML = '';
                deleteUserButton.style.display = 'none';
                searchMessage.textContent = '';
            } catch (error) {
                deleteMessage.textContent = `Virhe: ${error.message}`;
            }
        };
    } catch (error) {
        todosList.innerHTML = '';
        deleteUserButton.style.display = 'none';
        deleteMessage.textContent = `Virhe: ${error.message}`;
    }
});
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`/todos/${searchInput}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }
        todosList.innerHTML = '';
        searchMessage.textContent = '';
        deleteMessage.textContent = '';
        const todos = await response.json();
        todos.forEach(todo => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.classList.add('delete-task');
            a.textContent = todo;
            li.appendChild(a);
            todosList.appendChild(li);
            a.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    const poisto = await fetch('/update', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            nimi: searchInput,
                            tehtava: todo,
                        }),
                    });

                    if (!poisto.ok) {
                        throw new Error(await poisto.text());
                    }

                    deleteMessage.textContent = await poisto.text();
                    li.remove();
                } catch (error) {
                    deleteMessage.textContent = `Virhe: ${error.message}`;
                }
            });
        });
        deleteUserButton.style.display = 'inline-block';
        deleteUserButton.onclick = async () => {
            try {
                const deleteResponse = await fetch('/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nimi: searchInput }),
                });

                if (!deleteResponse.ok) {
                    throw new Error(await deleteResponse.text());
                }

                deleteMessage.textContent = await deleteResponse.text();
                todosList.innerHTML = '';
                deleteUserButton.style.display = 'none';
                searchMessage.textContent = '';
            } catch (error) {
                deleteMessage.textContent = `Virhe: ${error.message}`;
            }
        };
    } catch (error) {
        todosList.innerHTML = '';
        deleteUserButton.style.display = 'none';
        deleteMessage.textContent = `Virhe: ${error.message}`;
    }
});
