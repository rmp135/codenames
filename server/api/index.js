import { Router } from 'express'

import game from './game'

const router = Router()

router.use('/game', game)

export default router
