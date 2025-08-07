import { useEffect, useState } from 'react';

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', realName: '', universe: 'Marvel' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCharacters = async () => {
    const res = await fetch('http://localhost:5000/characters');
    const data = await res.json();
    setCharacters(data);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await fetch(`http://localhost:5000/characters/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setIsEditing(false);
    } else {
      await fetch('http://localhost:5000/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ id: null, name: '', realName: '', universe: 'Marvel' });
    fetchCharacters();
  };

  const handleEdit = (char) => {
    setForm(char);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/characters/${id}`, {
      method: 'DELETE',
    });
    fetchCharacters();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Liste des personnages</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nom"
          className="border p-2 w-full"
          required
        />
        <input
          name="realName"
          value={form.realName}
          onChange={handleChange}
          placeholder="Nom réel"
          className="border p-2 w-full"
          required
        />
        <select
          name="universe"
          value={form.universe}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
          <option value="Autre">Autre</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? 'Modifier' : 'Ajouter'}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Nom Réel</th>
            <th className="p-2 border">Univers</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((char) => (
            <tr key={char.id} className="text-center">
              <td className="border p-2">{char.name}</td>
              <td className="border p-2">{char.realName}</td>
              <td className="border p-2">{char.universe}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(char)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(char.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
