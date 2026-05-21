import * as bcrypt from "bcryptjs";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
	console.log("🌱 Seeding database...");

	// ── Users (gestores) ──────────────────────────────────────────────
	const [admin] = await db
		.insert(schema.users)
		.values({
			name: "Admin Performaz",
			email: "admin@performaz.com",
			passwordHash: await bcrypt.hash("admin123", 10),
			role: "GESTOR",
		})
		.returning();
	console.log("✓ Admin user created");

	// ── Vendors ───────────────────────────────────────────────────────
	const vendorData = [
		{ name: "Carlos Silva", email: "carlos@performaz.com", matricula: "V001", phone: "(11) 91234-5678", region: "São Paulo - Centro", xp: 2450, level: 5, totalSales: 38, totalRevenue: 47200, goalsHit: 8, goalsTotal: 10 },
		{ name: "Ana Souza", email: "ana@performaz.com", matricula: "V002", phone: "(11) 92345-6789", region: "São Paulo - Sul", xp: 1800, level: 4, totalSales: 29, totalRevenue: 35100, goalsHit: 6, goalsTotal: 10 },
		{ name: "Bruno Lima", email: "bruno@performaz.com", matricula: "V003", phone: "(11) 93456-7890", region: "São Paulo - Norte", xp: 3100, level: 6, totalSales: 52, totalRevenue: 63800, goalsHit: 9, goalsTotal: 10 },
		{ name: "Fernanda Costa", email: "fernanda@performaz.com", matricula: "V004", phone: "(11) 94567-8901", region: "ABC Paulista", xp: 950, level: 2, totalSales: 14, totalRevenue: 18400, goalsHit: 3, goalsTotal: 10 },
		{ name: "Rafael Mendes", email: "rafael@performaz.com", matricula: "V005", phone: "(11) 95678-9012", region: "Guarulhos", xp: 1450, level: 3, totalSales: 21, totalRevenue: 27600, goalsHit: 5, goalsTotal: 10 },
	];

	const vendorPassword = await bcrypt.hash("vendor123", 10);
	const vendors = await db
		.insert(schema.vendors)
		.values(vendorData.map((v) => ({ ...v, passwordHash: vendorPassword })))
		.returning();
	console.log("✓ 5 vendors created");

	// ── Products ──────────────────────────────────────────────────────
	const products = await db
		.insert(schema.products)
		.values([
			{ code: "P001", name: "Notebook Dell Inspiron 15", category: "Informática", unit: "un", price: 3499.9, stock: 25 },
			{ code: "P002", name: "Monitor LG 24\" Full HD", category: "Informática", unit: "un", price: 899.9, stock: 40 },
			{ code: "P003", name: "Teclado Mecânico HyperX", category: "Periféricos", unit: "un", price: 349.9, stock: 60 },
			{ code: "P004", name: "Mouse Logitech MX Master", category: "Periféricos", unit: "un", price: 429.9, stock: 55 },
			{ code: "P005", name: "Headset Sony WH-1000XM5", category: "Áudio", unit: "un", price: 1899.9, stock: 20 },
			{ code: "P006", name: "Cadeira Gamer ThunderX3", category: "Mobiliário", unit: "un", price: 1249.9, stock: 15 },
			{ code: "P007", name: "Webcam Logitech C920", category: "Periféricos", unit: "un", price: 449.9, stock: 35 },
			{ code: "P008", name: "SSD Kingston 1TB NVMe", category: "Armazenamento", unit: "un", price: 599.9, stock: 50 },
			{ code: "P009", name: "Hub USB-C 7 em 1", category: "Acessórios", unit: "un", price: 189.9, stock: 80 },
			{ code: "P010", name: "Impressora HP LaserJet", category: "Impressão", unit: "un", price: 1099.9, stock: 12 },
		])
		.returning();
	console.log("✓ 10 products created");

	// ── Clients ───────────────────────────────────────────────────────
	const clients = await db
		.insert(schema.clients)
		.values([
			{ name: "Tech Solutions Ltda", cnpj: "12.345.678/0001-90", address: "Av. Paulista, 1000", city: "São Paulo", state: "SP", phone: "(11) 3456-7890", email: "compras@techsolutions.com", segment: "Tecnologia", status: "visitado", vendorId: vendors[0].id, totalOrders: 5, totalRevenue: 14500 },
			{ name: "Escritórios Modernos SA", cnpj: "23.456.789/0001-01", address: "Rua Augusta, 500", city: "São Paulo", state: "SP", phone: "(11) 3567-8901", email: "rh@escritoriosmodernos.com", segment: "Serviços", status: "venda_realizada", vendorId: vendors[0].id, totalOrders: 3, totalRevenue: 8700 },
			{ name: "Distribuidora Norte Ltda", cnpj: "34.567.890/0001-12", address: "Av. Cruzeiro do Sul, 200", city: "São Paulo", state: "SP", phone: "(11) 3678-9012", email: "compras@distribnorte.com", segment: "Distribuição", status: "pendente", vendorId: vendors[1].id, totalOrders: 0, totalRevenue: 0 },
			{ name: "Indústria ABC Eireli", cnpj: "45.678.901/0001-23", address: "Rua das Indústrias, 300", city: "Santo André", state: "SP", phone: "(11) 4789-0123", email: "ti@industriaabc.com", segment: "Indústria", status: "visitado", vendorId: vendors[1].id, totalOrders: 2, totalRevenue: 5200 },
			{ name: "Comércio Central ME", cnpj: "56.789.012/0001-34", address: "Rua do Comércio, 150", city: "São Paulo", state: "SP", phone: "(11) 3890-1234", email: "gerente@comerciocentral.com", segment: "Varejo", status: "venda_realizada", vendorId: vendors[2].id, totalOrders: 7, totalRevenue: 22100 },
			{ name: "Startup Inovação Ltda", cnpj: "67.890.123/0001-45", address: "Av. Brigadeiro Faria Lima, 3000", city: "São Paulo", state: "SP", phone: "(11) 3901-2345", email: "cto@startupinova.com", segment: "Tecnologia", status: "venda_realizada", vendorId: vendors[2].id, totalOrders: 4, totalRevenue: 11800 },
			{ name: "Escola Digital SA", cnpj: "78.901.234/0001-56", address: "Rua da Educação, 400", city: "Guarulhos", state: "SP", phone: "(11) 2012-3456", email: "ti@escoladigital.com", segment: "Educação", status: "pendente", vendorId: vendors[4].id, totalOrders: 1, totalRevenue: 3500 },
			{ name: "Hospital São Lucas", cnpj: "89.012.345/0001-67", address: "Av. da Saúde, 800", city: "Guarulhos", state: "SP", phone: "(11) 2123-4567", email: "suprimentos@saolucas.com", segment: "Saúde", status: "visitado", vendorId: vendors[4].id, totalOrders: 6, totalRevenue: 19300 },
			{ name: "Construtora Sólida Ltda", cnpj: "90.123.456/0001-78", address: "Rua das Obras, 600", city: "São Bernardo do Campo", state: "SP", phone: "(11) 4234-5678", email: "engenharia@solidaltda.com", segment: "Construção", status: "sem_venda", vendorId: vendors[3].id, totalOrders: 0, totalRevenue: 0 },
			{ name: "Agro Fazenda Boa Vista", cnpj: "01.234.567/0001-89", address: "Estrada Rural, km 10", city: "Mogi das Cruzes", state: "SP", phone: "(11) 4345-6789", email: "admin@fazendaboavista.com", segment: "Agronegócio", status: "pendente", vendorId: vendors[3].id, totalOrders: 0, totalRevenue: 0 },
		])
		.returning();
	console.log("✓ 10 clients created");

	// ── Orders ────────────────────────────────────────────────────────
	const orders = await db
		.insert(schema.orders)
		.values([
			{ total: 5249.7, status: "confirmado", vendorId: vendors[0].id, clientId: clients[0].id },
			{ total: 3149.6, status: "confirmado", vendorId: vendors[0].id, clientId: clients[1].id },
			{ total: 8749.5, status: "confirmado", vendorId: vendors[2].id, clientId: clients[4].id },
			{ total: 2699.7, status: "pendente", vendorId: vendors[2].id, clientId: clients[5].id },
			{ total: 1899.9, status: "confirmado", vendorId: vendors[4].id, clientId: clients[7].id },
		])
		.returning();

	await db.insert(schema.orderItems).values([
		{ orderId: orders[0].id, productId: products[0].id, quantity: 1, unitPrice: 3499.9, subtotal: 3499.9 },
		{ orderId: orders[0].id, productId: products[1].id, quantity: 1, unitPrice: 899.9, subtotal: 899.9 },
		{ orderId: orders[0].id, productId: products[2].id, quantity: 2, unitPrice: 349.9, subtotal: 699.8 },
		{ orderId: orders[0].id, productId: products[8].id, quantity: 3, unitPrice: 189.9, subtotal: 569.7 },

		{ orderId: orders[1].id, productId: products[5].id, quantity: 1, unitPrice: 1249.9, subtotal: 1249.9 },
		{ orderId: orders[1].id, productId: products[3].id, quantity: 2, unitPrice: 429.9, subtotal: 859.8 },
		{ orderId: orders[1].id, productId: products[6].id, quantity: 1, unitPrice: 449.9, subtotal: 449.9 },
		{ orderId: orders[1].id, productId: products[8].id, quantity: 3, unitPrice: 189.9, subtotal: 569.7 },

		{ orderId: orders[2].id, productId: products[0].id, quantity: 2, unitPrice: 3499.9, subtotal: 6999.8 },
		{ orderId: orders[2].id, productId: products[4].id, quantity: 1, unitPrice: 1899.9, subtotal: 1899.9 },

		{ orderId: orders[3].id, productId: products[7].id, quantity: 2, unitPrice: 599.9, subtotal: 1199.8 },
		{ orderId: orders[3].id, productId: products[2].id, quantity: 4, unitPrice: 349.9, subtotal: 1399.6 },

		{ orderId: orders[4].id, productId: products[4].id, quantity: 1, unitPrice: 1899.9, subtotal: 1899.9 },
	]);
	console.log("✓ 5 orders with items created");

	// ── Goals ─────────────────────────────────────────────────────────
	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	await db.insert(schema.goals).values(
		vendors.flatMap((v) => [
			{ vendorId: v.id, period: "mensal" as const, type: "receita" as const, target: 30000, current: v.totalRevenue > 30000 ? 30000 : v.totalRevenue, startDate: monthStart, endDate: monthEnd },
			{ vendorId: v.id, period: "mensal" as const, type: "vendas" as const, target: 20, current: v.totalSales > 20 ? 20 : v.totalSales, startDate: monthStart, endDate: monthEnd },
		]),
	);
	console.log("✓ Goals created");

	// ── Achievements ──────────────────────────────────────────────────
	const achievements = await db
		.insert(schema.achievements)
		.values([
			{ name: "Primeira Venda", description: "Realizou sua primeira venda", icon: "🏆", xpReward: 100, condition: JSON.stringify({ type: "vendas", min: 1 }) },
			{ name: "Vendedor Prata", description: "Atingiu 10 vendas no mês", icon: "🥈", xpReward: 300, condition: JSON.stringify({ type: "vendas", min: 10 }) },
			{ name: "Vendedor Ouro", description: "Atingiu 25 vendas no mês", icon: "🥇", xpReward: 600, condition: JSON.stringify({ type: "vendas", min: 25 }) },
			{ name: "Meta Cumprida", description: "Bateu uma meta mensal", icon: "🎯", xpReward: 200, condition: JSON.stringify({ type: "meta", min: 1 }) },
			{ name: "Explorador", description: "Realizou 20 check-ins", icon: "🗺️", xpReward: 250, condition: JSON.stringify({ type: "checkins", min: 20 }) },
		])
		.returning();
	console.log("✓ 5 achievements created");

	// ── Vendor Achievements ───────────────────────────────────────────
	await db.insert(schema.vendorAchievements).values([
		{ vendorId: vendors[0].id, achievementId: achievements[0].id },
		{ vendorId: vendors[0].id, achievementId: achievements[1].id },
		{ vendorId: vendors[1].id, achievementId: achievements[0].id },
		{ vendorId: vendors[2].id, achievementId: achievements[0].id },
		{ vendorId: vendors[2].id, achievementId: achievements[1].id },
		{ vendorId: vendors[2].id, achievementId: achievements[2].id },
		{ vendorId: vendors[2].id, achievementId: achievements[3].id },
	]);

	// ── XP Activities ─────────────────────────────────────────────────
	await db.insert(schema.xpActivities).values([
		{ vendorId: vendors[0].id, type: "venda", description: "Venda confirmada #001", xpEarned: 150 },
		{ vendorId: vendors[0].id, type: "checkin", description: "Check-in em Tech Solutions", xpEarned: 50 },
		{ vendorId: vendors[2].id, type: "venda", description: "Venda confirmada #003", xpEarned: 150 },
		{ vendorId: vendors[2].id, type: "meta_atingida", description: "Meta mensal de receita atingida", xpEarned: 300 },
		{ vendorId: vendors[2].id, type: "conquista", description: "Conquista desbloqueada: Vendedor Ouro", xpEarned: 600 },
	]);
	console.log("✓ Achievements & XP seeded");

	// ── Notifications ─────────────────────────────────────────────────
	const [notif] = await db
		.insert(schema.notifications)
		.values([
			{ title: "Bem-vindo ao Performaz!", message: "Sua plataforma de vendas gamificada está pronta. Boas vendas!", type: "info", targetAll: true, sentById: admin.id },
			{ title: "Nova meta disponível", message: "Metas mensais de abril foram cadastradas. Confira seus objetivos!", type: "info", targetAll: true, sentById: admin.id },
		])
		.returning();

	await db.insert(schema.notificationRecipients).values(
		vendors.flatMap((v) => [
			{ notificationId: notif.id, vendorId: v.id },
		]),
	);
	console.log("✓ Notifications created");

	console.log("\n✅ Seed complete!\n");
	console.log("  Admin → admin@performaz.com / admin123");
	console.log("  Vendors → [email] / vendor123");
}

main()
	.catch(console.error)
	.finally(() => pool.end());
