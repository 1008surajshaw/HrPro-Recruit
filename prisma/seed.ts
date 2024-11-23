import {
    PrismaClient,
    Currency,
    EmployementType,
    Role,
    WorkMode,
  } from '@prisma/client';
  import { faker } from '@faker-js/faker';
  import bcrypt from 'bcryptjs';
  
  const prisma = new PrismaClient();
  
  const users = [
    { id: '11', name: 'Jack', email: 'user11@gmail.com' },
    { id: '12', name: 'Jack', email: 'user12@gmail.com' },
    { id: '13', name: 'Jack', email: 'user12@gmail.com' },
    { id: '14', name: 'Jack', email: 'user14@gmail.com' },
    { id: '15', name: 'Jack', email: 'user15@gmail.com' },
    { id: '16', name: 'Jack', email: 'user16@gmail.com' },
    { id: '17', name: 'Jack', email: 'user17@gmail.com' },
    
  ];
  
  async function seedUsers() {
    try {
      const hashedPassword = await bcrypt.hash('123456', 10);
      for (const u of users) {
        try {
          await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
              id: u.id,
              email: u.email,
              name: u.name,
              password: hashedPassword,
              role: Role.USER,
              emailVerified: new Date(),
            },
          });
        } catch (error) {
          console.log(`Error processing user ${u.email}:`, error);
        }
      }
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  }

  async function main() {
    await seedUsers();
  }