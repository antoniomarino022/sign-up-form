import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { getDb } from './db';
import bcrypt from 'bcrypt';
import {
    validateEmail,
    validatePassword,
    validateFirstName,
    validateLastName,
    validateTel,
    validateCompany
} from './middleware/validator';


const app = express();
const PORT = 3000;

config();

app.use(express.json());

app.use(cors())

// Middleware per loggare il corpo grezzo
app.use((req, res, next) => {
    console.log('Corpo Grezzo:', req.body);
    next();
});


(async () => {
    const database = await getDb();
    await database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        repeatPassword TEXT,
        firstName TEXT,
        lastName TEXT,
        tel TEXT,
        company TEXT
      )
    `);

})();

interface registerBody{
  email:string,
  password:string,
  repeatPassword:string,
  firstName:string,
  lastName:string,
  tel:string,
  company:string
}

app.post('/register', async (req:Request, res:Response) => {
  try {
    console.log('Dati ricevuti:', req.body);

    const { email, password, repeatPassword, firstName, lastName, tel, company }:registerBody = req.body;

    if (!validateEmail(email)) {
      console.log('email non valida');
      return res.status(400).json({ message: 'Email non valida' });
    }

    if (!validatePassword(password)) {
      console.log('password non valida');
      return res.status(400).json({ message: 'Password non valida' });
    }

    if (password !== repeatPassword) {
      console.log('password non corrispondente');
      return res.status(400).json({ message: 'Le password non corrispondono' });
    }

    if (!validateFirstName(firstName)) {
      console.log('nome non valido');
      return res.status(400).json({ message: 'Nome non valido' });
    }

    if (!validateLastName(lastName)) {
      console.log('cognome non valido');
      return res.status(400).json({ message: 'Cognome non valido' });
    }

    if (!validateTel(tel)) {
      console.log('numero valido');
      return res.status(400).json({ message: 'Numero di telefono non valido' });
    }

    if (!validateCompany(company)) {
      console.log('company non valido');
      return res.status(400).json({ message: 'Nome azienda non valido' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await getDb()
    const result = await db.run(
      'INSERT INTO users (email, password, firstName, lastName, tel, company) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, tel, company]
    );

    if (result.changes && result.changes > 0) {
      console.log('Utente registrato con successo');
      return res.status(201).json({ message: 'Registrazione avvenuta con successo' });
    } else {
      console.error("Errore durante l'inserimento nel database");
      return res.status(500).json({ message: 'Errore durante la registrazione' });
    }
  } catch (err) {
    if(err instanceof Error){
      console.error('Errore standard di js:', err);
      return res.status(500).json({ message: 'Errore standard di js' });
    }else{
      console.error('Errore sconosciuto:', err);
      return res.status(500).json({ message: 'Errore sconosciuto' });
    }
    
  }
});



// clear table
app.delete('/delete', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    
    await db.get('SELECT * FROM users ');

    
    await db.run('DROP TABLE users');
    console.log('Tabella eliminata con successo');
    return res.status(200).json({ message: 'Tabella eliminata con successo' });

  } catch (err) {
    if(err instanceof Error){
      console.error('Errore standard di js:', err);
      return res.status(500).json({ message: 'Errore standard di js' });
    }else{
      console.error('Errore sconosciuto:', err);
      return res.status(500).json({ message: 'Errore sconosciuto' });
    }
  }
 
});


app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
