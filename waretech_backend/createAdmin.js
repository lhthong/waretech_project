const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const existingAdmin = await prisma.users.findFirst({
      where: { permission: "admin" },
    });

    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.username);
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.users.create({
      data: {
        username: "lhthong@gmail.com",
        password: hashedPassword,
        fullname: "Lê Huy Thông",
        phone: "0795346789",
        gender: "male",
        address: null,
        avatar: null,
        permission: "admin",
      },
    });

    console.log("Admin created successfully:", admin.username);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
