import user from "../Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION } from "../default.js";

//sign up
export async function signUp(req, res) {
  const { name, nickName, email, password, phone, role, speciality, address } =
    req.body;

  const verifUser = await user.findOne({ email: req.body.email });
  if (verifUser) {
    console.log("user already exists");
    res.status(403).send({ message: "User already exists !" });
    return; // Exit function early if user already exists
  }

  console.log("Success");
  console.log("Request Body:", req.body);

  console.log("Password received:", req.body.password);
  const mdpEncrypted = await bcrypt.hash(req.body.password, 10);
  const newUser = new user();

  newUser.name = req.body.name;
  newUser.nickName = req.body.nickName;
  newUser.email = req.body.email;
  newUser.password = mdpEncrypted;
  newUser.phone = req.body.phone;
  newUser.role = req.body.role;
  newUser.speciality = req.body.speciality;
  newUser.address = req.body.address;

  // If a file was uploaded, store its filename in the avatar field
  if (req.file) {
    newUser.avatar = req.file.filename;
  }

  await newUser.save();

  const payload = {
    _id: newUser._id,
    name: newUser.name,
    nickName: newUser.nickName,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    speciality: newUser.speciality,
    address: newUser.address,
    avatar: newUser.avatar,
  };

  const token = jwt.sign({ payload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  res.status(201).send({
    token: token,
    statusCode: res.statusCode,
    message: "Logged in with success!",
  });

  console.log(token);
}

//signin

export async function login(req, res) {
  console.log("connect");
  const userInfo = await user.findOne({ email: req.body.email });

  if (
    !userInfo ||
    userInfo.status === 0 ||
    !bcrypt.compareSync(req.body.password, userInfo.password)
  )
    return res.status(404).json({
      error: "Invalid incredentials",
    });

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
  };

  res.status(200).json({
    // @ts-ignore
    token: jwt.sign({ payload }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    }),
    userInfo,
  });
}
