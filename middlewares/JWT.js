import jwt from 'jsonwebtoken'

import { JWT_EXPIRATION, JWT_SECRET } from '../config/default.js'

export default function (req, res, next) {
    if (req.header('Authorization') === undefined)
        return res.status(401).json({ error: 'Authorization denied.' })

    const token = req.header('authorization').split(' ')[1]
    if (!token) return res.status(401).send('Access denied.')

    jwt.verify(
        token,
        // @ts-ignore
        JWT_SECRET,
        {
            maxAge: JWT_EXPIRATION,
        },
        (err, decoded) => {
            if (err) {
                const { refreshReq, id } = req.query
                console.log('error')
                if (!refreshReq)
                    return res.status(403).json({ error: 'Access denied.' })

                const token = jwt.sign(
                    { id: id },
                    // @ts-ignore
                    JWT_SECRET,
                    {
                        expiresIn: JWT_EXPIRATION,
                    }
                )
                return res.status(200).json({ token: token })
            }
            req.id = decoded
            next()
        }
    )
}