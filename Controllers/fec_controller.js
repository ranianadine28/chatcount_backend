import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { parseStream } from "fast-csv";
import pkg from "csv-parser";
const { parse } = pkg;
import fs from 'fs';
import FecModel from '../Models/fec.js'
//
export async function uploadFec(req, res) {
  console.log("Request received at /fec/upload-csv");

  try {
    console.log("req.file:", req.file);

    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res
        .status(403)
        .json({ message: "Aucun fichier n'a été uploadé." });
    }

    const existingFec = await FecModel.findOne({ name: uploadedFile.originalname });

    if (existingFec) {
      return res
          .status(409)
          .json({ message: "Un fichier avec le même nom existe déjà.", fecId: existingFec._id });
  }
  

    const processedData = await processCsvFile(req, res);

    const fecData = {
      name: uploadedFile.originalname,
      data: processedData,
    };

    const fec = new FecModel(fecData);

    await fec.save();

    return res.status(200).json({
      message: "Fichier uploadé et traité avec succès!",
      data: processedData,
      fecId: fec._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Une erreur est survenue lors du traitement du fichier.",
      error,
    });
  }
}
export async function replaceFile (req, res) {
  try {
    const existingFecId = req.params.existingFecId;
    const uploadedFile = req.file;

    // Vérifier si le FEC avec l'ID fourni existe
    const existingFec = await FecModel.findById(existingFecId);
    if (!existingFec) {
      return res.status(404).json({ message: "Le FEC à remplacer n'existe pas." });
    }

    // Mettre à jour le fichier du FEC avec le nouveau fichier
    existingFec.name = uploadedFile.originalname;
    existingFec.data = await processCsvFile(req, res); // Assurez-vous d'avoir la fonction processCsvFile définie

    await existingFec.save();

    return res.status(200).json({ message: "Fichier FEC remplacé avec succès!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur est survenue lors du remplacement du fichier FEC.", error });
  }
};


async function processCsvFile(req, res) {
  const file = req.file;
  const csvData = [];

  try {
    const csvStream = fs.createReadStream(file.path);
    const csvParser = parseStream(csvStream, { headers: true });

    for await (const record of csvParser) {
      csvData.push(record);
    }

    // Process the CSV data (csvData)
  } catch (error) {
    console.error(error);
    // Handle errors appropriately
  }
}

// Fonction pour traiter chaque ligne du fichier CSV
function processRow(row) {
  // Implémenter votre logique pour manipuler les données de chaque ligne
  // Vous pouvez accéder aux valeurs individuelles en utilisant row['
  return row;
}
export async function getFec(req, res) {
  try {
    const fecs = await FecModel.find(); // Récupère tous les documents FEC de la base de données

    // Filtrer les résultats par nom si un nom est fourni dans la requête
    if (req.query.name) {
      fecs = fecs.filter((fec) => fec.name === req.query.name);
    }

    res.status(200).json({
      message: "Liste des FEC récupérée avec succès",
      data: fecs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des FEC",
      error,
    });
  }
}
