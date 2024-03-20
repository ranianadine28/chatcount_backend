import conversation from "../Models/conversation.js";

export async function ajoutConversation(req, res) {
  const { userId, fecId } = req.params;
  const date = Date.now();
  const name = req.body.conversationName || req.body;
  console.log("rrrrrrrrrrrrrrrrr", name);
  const newconversation = new conversation({
    userId,
    fecId,
    date,
    name,
  });

  try {
    await newconversation.save();

    // Récupérer l'ID de la conversation
    const conversationId = newconversation._id;
    res
      .status(201)
      .json({ message: "Conversation créée avec succès", conversationId });
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Erreur lors de la création de la conversation",
        error,
      });
  }
}
export async function afficherConv(req, res) {
  try {
    const userId = req.params.userId; 

    const conversations = await conversation.find({ userId });

    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des conversations",
      error,
    });
  }
}

export async function recupConv(req, res) {
  const { conversationId } = req.params;

  try {
    if (conversationId === ":id") {
      return res.json([]); 
    }

    const conversationM = await conversation.findById(conversationId);
    
    if (!conversationM) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversationM.messages); // Renvoyer les messages de la conversation
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const deleteConversation = async (req, res) => {
  console.log("deeeeeeeeeeeeeeeeeeeeeeeel");
  try {
    const conversationToDelete = await conversation.findByIdAndDelete(req.params.id);
    if (!conversationToDelete) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    res.status(200).json({ message: 'Conversation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la conversation :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la conversation', error });
  }
};

export async function renameConversation(req, res) {
  const conversationId = req.params.id;
  const { name } = req.body;

  try {
    // Rechercher la conversation par ID
    const newconversation = await conversation.findById(conversationId);
    
    if (!newconversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Mettre à jour le nom de la conversation
    newconversation.name = name;
    await newconversation.save();

    // Répondre avec la conversation mise à jour
    res.status(200).json({ message: "Conversation updated successfully", conversation });
  } catch (error) {
    res.status(500).json({ message: "Error updating conversation", error });
  }
};
export async function enregistrerMessage(req, res) {
  const { conversationId } = req.params;
  const { text, sender } = req.body;

  try {
    let newconversation = await conversation.findById(conversationId);
    
    if (!newconversation) {
      throw new Error("Conversation non trouvée");
    }
    

    newconversation.messages.push({
      text,
      sender,
      timestamp: new Date()
    });
    
    await newconversation.save();
    
    console.log("Message enregistré avec succès dans la conversation:", newconversation);
    
    res.status(201).json(newconversation);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message:", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du message" });
  }
}
