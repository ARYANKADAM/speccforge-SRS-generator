import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "Email already registered" }),
      { status: 400 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return new Response(
    JSON.stringify({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
      token,
    }),
    { status: 201 }
  );
}
