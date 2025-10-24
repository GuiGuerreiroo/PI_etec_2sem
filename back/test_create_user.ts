// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import { UserRepoMongoDB } from './app/shared/repositories/database/mongo/user_repository_mongodb';
// import { User } from './app/shared/domain/entities/user';
// import { ROLE } from './app/shared/domain/enums/role';
// import { Encrypt } from './app/shared/helpers/encrypt';

// // Carrega as variáveis de ambiente
// dotenv.config();

// async function testCreateUser() {
//     try {
//         // Conecta ao MongoDB
//         const password = process.env.password;
//         const appName = process.env.appName;
//         const dbName = process.env.dbName || "projetoetec2ul";
//         const uri = `mongodb+srv://projetoetec2ul_db_user:${password}@pi-etec-2ul.g6v29i0.mongodb.net/${dbName}?appName=${appName}`;

//         console.log('🔄 Conectando ao MongoDB...');
//         console.log('📦 Banco de dados:', dbName);
//         await mongoose.connect(uri);
//         console.log('✅ Conectado ao MongoDB com sucesso!');

//         // Cria uma instância do repositório
//         const userRepo = new UserRepoMongoDB();

//         // Hash da senha
//         const hashedPassword = await Encrypt.hashPassword('senha123');

//         // Cria um usuário de teste
//         const testUser = new User(
//             'Usuário Teste',
//             `teste_${Date.now()}@example.com`, // Email único usando timestamp
//             ROLE.PROFESSOR,
//             hashedPassword
//         );

//         console.log('\n🔄 Criando usuário de teste...');
//         console.log('Dados do usuário:', {
//             name: testUser.name,
//             email: testUser.email,
//             role: testUser.role
//         });

//         // Chama a função createUser
//         const createdUser = await userRepo.createUser(testUser);

//         console.log('\n✅ Usuário criado com sucesso!');
//         console.log('Usuário salvo:', {
//             userId: createdUser.userId,
//             name: createdUser.name,
//             email: createdUser.email,
//             role: createdUser.role
//         });

//         // Testa buscar o usuário criado
//         console.log('\n🔄 Buscando usuário criado...');
//         const fetchedUser = await userRepo.getUserById(createdUser.userId!);

//         if (fetchedUser) {
//             console.log('✅ Usuário encontrado:', {
//                 userId: fetchedUser.userId,
//                 name: fetchedUser.name,
//                 email: fetchedUser.email,
//                 role: fetchedUser.role
//             });
//         } else {
//             console.log('❌ Usuário não encontrado');
//         }

//     } catch (error) {
//         console.error('\n❌ Erro durante o teste:', error);
//     } finally {
//         // Desconecta do MongoDB
//         console.log('\n🔄 Desconectando do MongoDB...');
//         await mongoose.disconnect();
//         console.log('✅ Desconectado do MongoDB');
//     }
// }

// // Executa o teste
// testCreateUser();
