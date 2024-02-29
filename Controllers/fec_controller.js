import express from 'express';
import multer from 'multer'; 
import { v4 as uuidv4 } from 'uuid'; 
import pkg from 'csv-parser';
const { parse } = pkg; // Définir le middleware multer pour gérer les uploads de fichiers
const upload = multer({
  dest: 'uploads/', // Modifier le chemin 'uploads/' selon vos besoins
  limits: { fileSize: 1000000 }, // Limiter la taille du fichier à 1 Mo
  fileFilter: (req, file, cb) => {
    // Filtrer les fichiers par extension
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error('Le fichier doit être au format CSV'));
    }
    cb(null, true);
  },
});

// Définir la fonction `processCsvFile` comme avant... (votre code existant)

// Définir la fonction du contrôleur `uploadFec`
export async function uploadFec(req, res) {
  // Utiliser le middleware multer pour gérer l'upload du fichier
  upload.single('csvFile')(req, res, async (err) => {
    if (err) {
      // Gérer les erreurs de multer
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return res.status(400).json({ message: 'Le fichier est trop volumineux (1 Mo max).' });
          case 'INVALID_FILE_TYPE':
            return res.status(400).json({ message: 'Le fichier doit être au format CSV.' });
          default:
            return res.status(500).json({ message: "'Une erreur est survenue lors de l'upload du fichier.' "});
        }
      } else {
        return res.status(500).json({ message: "'Une erreur est survenue lors de l'upload du fichier.'" });
      }
    }

    // Accéder au fichier uploadé via req.file
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).json({ message: "'Aucun fichier n'a été uploadé.'" });
    }

    // Générer un nom de fichier unique
    const uniqueFileName = `${uuidv4()}-${uploadedFile.originalname}`;

    // Renommer le fichier
    await uploadedFile.mv(`uploads/${uniqueFileName}`);

    // Traiter le fichier uploadé
    try {
      const processedData = await processCsvFile(uploadedFile.path);
      res.status(200).json({ message: 'Fichier uploadé et traité avec succès!', data: processedData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors du traitement du fichier.' });
    }
  });
}
async function processCsvFile(csvData) {
    const results = [];
    const parser = parse({ delimiter: ',' }); // Ajuster le séparateur si nécessaire
  
    parser.on('data', (row) => {
      // Traiter chaque ligne de données ici
      // Vous pouvez accéder aux valeurs individuelles en utilisant row['column_name']
      results.push(processRow(row)); // Appeler une fonction pour gérer chaque ligne
    });
  
    parser.on('end', () => {
      // Retourner les données traitées
      return results;
    });
  
    return new Promise((resolve, reject) => {
      csvData.pipe(parser)
        .on('error', (err) => reject(err))
        .on('end', () => resolve(results));
    });
  }
  function processRow(row) {
    // Implement your logic to manipulate the data in each row
    // You can access individual values using row['column_name']
    
    // Example: 
    // - Check for missing values and handle them appropriately (e.g., fill in defaults)
    // - Convert data types if necessary (e.g., string to number)
    // - Perform calculations or transformations on the data
    // - Create new objects or structures to store the processed data
  
    // Return the modified data or the original row based on your needs
    return row; // Replace with your processed data or the original row if no modifications are needed
  }
  
  