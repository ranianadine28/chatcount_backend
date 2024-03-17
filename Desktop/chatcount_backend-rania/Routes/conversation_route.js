import express from "express";
import {
  afficherConv,
  ajoutConversation,
  enregistrerMessage,
  recupConv,
  deleteConversation,
  renameConversation,
} from "../Controllers/conversation_controller.js";

const router = express.Router();

router.route("/conversations/:userId/:fecId").post(ajoutConversation);
router.route("/conversations/:userId").get(afficherConv);
router.route("/conversationsMessage/:conversationId").get(recupConv);
router.route("/deleteconversation/:id").delete(deleteConversation);
router.route("/enregistrer-message/:conversationId").post(enregistrerMessage);
router.route("/renameConversation/:id").patch(renameConversation);
export default router;
