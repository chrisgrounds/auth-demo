import bcrypt from "bcrypt";
import e from "express";
import jwt from "jsonwebtoken";
import { ObjectID } from "mongodb";
import { getDbConnection } from "../db";

const testRoute = {
    path: '/api/test',
    method: 'get',
    handler: (req, res) => {
        res.status(200).send('It works!');
    },
};

const loginRoute = {
    path: '/api/login',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;

        const db = getDbConnection("react-auth-db");
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            res.sendStatus(401);
        }

        const { _id: id, isVerified, passwordHash, info } = user;

        const passwordMatches = await bcrypt.compare(password, passwordHash);

        if (passwordMatches) {
            jwt.sign({
                    id,
                    isVerified,
                    email,
                    info
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2d"
                },
                (err, token) => {
                    if (err) {
                        return res.status(500).json({ err });
                    }
                    return res.status(200).json({ token });
                }
            );
        } else {
            res.sendStatus(401);
        }
    },
};

const signUpRoute = {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;

        const db = getDbConnection("react-auth-db");
        const user = await db.collection("users").findOne({ email });

        if (user) {
            res.sendStatus(409);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const startingInfo = {
            hairColor: "",
            favouriteFood: "",
            bio: "",
        };

        const result = await db
            .collection("users")
            .insertOne({ 
                email, 
                passwordHash, 
                startingInfo, 
                isVerified: false 
            });

        jwt.sign({
                id: result.insertedId,
                email,
                info: startingInfo,
                isVerified: false
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: "2d"
            },
            (err, token) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                return res.status(200).json({ token });
            }
        );
    },
};

const updateUserInfoRoute = {
    path: "/api/users/:userId",
    method: "put",
    handler: async (req, res) => {
        const { authorization } = req.headers;
        const { userId } = req.params;

        const updates = (({ favouriteFood, hairColor, bio }) => ({
            favouriteFood, hairColor, bio
        }))(req.body);

        if (!authorization) {
            return res.status(401).json({ message: "No authorization" });
        }

        // Bearer <jwt.jwt.jwt>
        const token = authorization.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(401).json({ message: "Unable to verify token" });

            const { id } = decoded;

            if (id !== userId) {
                return res.status(403).json({ message: "Not allowed to update that user "});
            }

            const db = getDbConnection("react-auth-db");
            const result = await db.collection("users").findOneAndUpdate(
                { _id: ObjectID(id) },
                { $set: { info: updates } },
                { returnOriginal: false }
            );

            const { email, isVerified, info } = result.value;

            jwt.sign({ id, email, isVerified, info }, process.env.JWT_SECRET, { expiresIn: "2d" }, (err, token) => {
                if (err) return res.status(200).json(err);

                return res.status(200).json({ token, decoded });
            });
        });
    }
}

export const routes = [
    testRoute,
    signUpRoute,
    loginRoute,
    updateUserInfoRoute
];
