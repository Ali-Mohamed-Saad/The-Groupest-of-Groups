import { sendMessage } from "../controllers/aiController"

router.post('/ai', sendMessage);