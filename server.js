
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { error, log } = require('console');
const { writeHeapSnapshot } = require('v8');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data', 'characters.json');

//middleware
app.use(cors());
app.use(bodyParser.json());

//lire les caractere comme Id, nom
const readCharacters = async () => {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data).characters;
};

// ecrire un caractère
const writeCharacters = async (characters) => {
    await fs.writeFile(DATA_FILE, JSON.stringify({ characters }, null, 2));
};
//GET /characters afficher tous la liste
app.get('/characters', async (req, res) => {
    try {
        const characters = await readCharacters();
        res.json(characters);
    } catch (error) {
        res.status(500).json({ error: 'failed to fetch characters' })
    }
}
);
//GET /characters/id recherche par id
app.get('/characters/:id', async (req, res) => {
    try {
        const characters = await readCharacters();
        const specialCharacter = characters.find(char => char.id === parseInt(req.params.id));
        if (!specialCharacter) {
            return res.status(404).json({ error: 'Character not found' })
        }
        res.json(specialCharacter)
    } catch (error) {
        console.error('Error updating character:', error); // Debug log
        res.status(500).json({ error: 'Failed to update character' });
    }
}
);
//POST  créer un nouvel personnage
app.post('/characters',async(req,res)=>{
    try {
        const characters=await readCharacters();
        console.log('Liste characters lue:', characters);

        const newPersonage={
            id: characters.length ?Math.max(...characters.map(char=>char.id)) +1 :1,
            ///décomposer un tableau en une liste de valeurs individuelles
             name:req.body.name,
             realName:req.body.realName,
            universe:req.body.universe
        };
        characters.push(newPersonage);
        await writeCharacters(characters);
        res.status(201).json(newPersonage)
    } catch (error) {
        res.status(500).json({error:"Failed to create personnage"})
    }
});
//mettre à jour un personnage existant
app.put('/characters/:id',async(req,res)=>{
    try {
        const character=await readCharacters();
        const index=character.findIndex(pers=>pers.id===parseInt(req.params.id));
        if (index===-1) {
            return res.status(404).json({error:"character not found"})
        }
        console.log(req.body);
        
        character[index]={
            id: parseInt(req.params.id),
            name:req.body.name,
            realName:req.body.realName,
            universe:req.body.universe
        };
        await writeCharacters(character);
        console.log("fini");
        
        res.json(character[index]);
    } catch (error) {
        res.status(500).json({error:'Failed to update character'})
    }
});
//supprimer

app.delete('/characters/:id',async(req,res)=>{
    try {
        const character=await readCharacters();
        const index=character.findIndex(c=>c.id=== parseInt(req.params.id));
        if (index===-1) {
            return res.status(404).json({error:'character not found'}) ; 
        }
        character.splice(index,1);
        await writeCharacters(character);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error:'failed to delete character'})
    }
})

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
