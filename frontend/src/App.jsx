import { useEffect, useState } from 'react';

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', realName: '', universe: '' });
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
    setForm({ id: null, name: '', realName: '', universe: '' });
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
    <div className='body h-full'>
      <div className='header'>
        <h1 className="text-9xl font-bold mb-2 text-center title" >Marvel</h1>
        <div className='text text-center'>
          <h2 className='text-4xl title2'>Welcome to Marvel </h2>
          <p className='text-2xl text-white'>Here you can list your hero</p>
        </div>
      </div>
      <div className="container space-x-40 ">
        <div className="flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 p-9 rounded-3xl  shadow-white shadow-2xl items-center justify-center border shadow-md"
            style={{ minHeight: '400px', width: '300px' }} 
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nom"
              className="border p-2 w-full text-center"
              required
            />
            <input
              name="realName"
              value={form.realName}
              onChange={handleChange}
              placeholder="Nom réel"
              className="border p-2 w-full text-center"
              required
            />
            <select
              name="universe"
              value={form.universe}
              onChange={handleChange}
              className="border p-2 w-full text-center "
            >
              <option value="">choose from the dropdown</option>
              <option value="Marvel" className='text-black'>Marvel</option>
              <option value="DC" className='text-black' >DC</option>
              <option value="Central City" className='text-black'>Central City</option>
              <option value="Earth-616" className='text-black'>Earth-616</option>
              <option value="Manga" className='text-black'>Manga</option>
              <option value="Autre" className='text-black'>Autre</option>
            </select>
            <button
              type="submit"
              className="bg-amber-400 text-white px-4 py-2 rounded"
            >
              {isEditing ? 'Save' : 'Add'}
            </button>
          </form>
        </div>


        <table className="w-full  p-9  shadow-2xl shadow-gray-600 ">
          <thead className=" bg-gray-500 text-2xl ">
            <tr >
              <th className="p-2 ">Name</th>
              <th className="p-2 ">Real name</th>
              <th className="p-2 ">Universe</th>
              <th className="p-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((char) => (
              <tr key={char.id} className="text-center text-xl shadow-md shadow-amber-100 ">
                <td className="p-5 ">{char.name}</td>
                <td className="p-5 ">{char.realName}</td>
                <td className="p-5">{char.universe}</td>
                <td className=" p-5 space-x-2">
                  <button
                    onClick={() => handleEdit(char)}
                    className="modify text-white px-2 py-1 rounded"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => handleDelete(char.id)}
                    className="delete text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
