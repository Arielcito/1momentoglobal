import { pgTable, varchar, timestamp, text, integer, uniqueIndex, foreignKey, serial, numeric, boolean, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const classStatus = pgEnum("ClassStatus", ['DRAFT', 'PUBLISHED', 'ARCHIVED'])
export const courseLevel = pgEnum("CourseLevel", ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
export const courseStatus = pgEnum("CourseStatus", ['DRAFT', 'PUBLISHED', 'ARCHIVED'])


export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const verificationToken = pgTable("VerificationToken", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => {
	return {
		identifierTokenKey: uniqueIndex("VerificationToken_identifier_token_key").using("btree", table.identifier.asc().nullsLast().op("text_ops"), table.token.asc().nullsLast().op("text_ops")),
		tokenKey: uniqueIndex("VerificationToken_token_key").using("btree", table.token.asc().nullsLast().op("text_ops")),
	}
});

export const course = pgTable("Course", {
	courseId: serial("course_id").primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	instructorId: text("instructor_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	categoryId: integer("category_id"),
	imageUrl: text("image_url").notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	publishedAt: timestamp("published_at", { precision: 6, withTimezone: true, mode: 'string' }),
	status: courseStatus().default('DRAFT').notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).notNull(),
	level: courseLevel().default('BEGINNER').notNull(),
}, (table) => {
	return {
		courseCategoryIdFkey: foreignKey({
			columns: [table.categoryId],
			foreignColumns: [category.id],
			name: "Course_category_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
		courseInstructorIdFkey: foreignKey({
			columns: [table.instructorId],
			foreignColumns: [user.id],
			name: "Course_instructor_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const stream = pgTable("Stream", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	thumbnailUrl: text("thumbnail_url"),
	ingressId: text(),
	serverUrl: text(),
	streamKey: text(),
	isLive: boolean().default(false).notNull(),
	isChatEnabled: boolean().default(false).notNull(),
	isChatDelayed: boolean().default(false).notNull(),
	userId: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	description: text(),
	title: text(),
}, (table) => {
	return {
		ingressIdKey: uniqueIndex("Stream_ingressId_key").using("btree", table.ingressId.asc().nullsLast().op("text_ops")),
		userIdKey: uniqueIndex("Stream_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
		streamUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Stream_userId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const user = pgTable("User", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp({ precision: 3, mode: 'string' }),
	image: text(),
	password: text(),
	passwordResetToken: text(),
	passwordResetTokenExp: timestamp({ precision: 3, mode: 'string' }),
	username: text().notNull(),
	fullName: text("full_name"),
	isAdmin: boolean("is_admin").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		emailKey: uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
		passwordResetTokenKey: uniqueIndex("User_passwordResetToken_key").using("btree", table.passwordResetToken.asc().nullsLast().op("text_ops")),
		usernameKey: uniqueIndex("User_username_key").using("btree", table.username.asc().nullsLast().op("text_ops")),
	}
});

export const account = pgTable("Account", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => {
	return {
		providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").using("btree", table.provider.asc().nullsLast().op("text_ops"), table.providerAccountId.asc().nullsLast().op("text_ops")),
		accountUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Account_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const session = pgTable("Session", {
	id: text().primaryKey().notNull(),
	sessionToken: text().notNull(),
	userId: text().notNull(),
	expires: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => {
	return {
		sessionTokenKey: uniqueIndex("Session_sessionToken_key").using("btree", table.sessionToken.asc().nullsLast().op("text_ops")),
		sessionUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Session_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const enrollment = pgTable("Enrollment", {
	enrollmentId: serial("enrollment_id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	courseId: integer("course_id").notNull(),
	enrolledAt: timestamp("enrolled_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		userIdCourseIdKey: uniqueIndex("Enrollment_user_id_course_id_key").using("btree", table.userId.asc().nullsLast().op("int4_ops"), table.courseId.asc().nullsLast().op("int4_ops")),
		enrollmentCourseIdFkey: foreignKey({
			columns: [table.courseId],
			foreignColumns: [course.courseId],
			name: "Enrollment_course_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
		enrollmentUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Enrollment_user_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const membership = pgTable("Membership", {
	membershipId: serial("membership_id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	planName: text("plan_name").notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	isActive: boolean("is_active").default(true).notNull(),
}, (table) => {
	return {
		membershipUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Membership_user_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const payment = pgTable("Payment", {
	paymentId: serial("payment_id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	paymentDate: timestamp("payment_date", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	paymentMethod: text("payment_method"),
	status: text(),
}, (table) => {
	return {
		paymentUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Payment_user_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const notification = pgTable("Notification", {
	notificationId: serial("notification_id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	message: text().notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => {
	return {
		notificationUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Notification_user_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const class = pgTable("Class", {
	classId: serial("class_id").primaryKey().notNull(),
	courseId: integer("course_id").notNull(),
	title: text().notNull(),
	description: text().notNull(),
	scheduledAt: timestamp("scheduled_at", { withTimezone: true, mode: 'string' }),
	isLive: boolean("is_live").default(false).notNull(),
	recordingUrl: text("recording_url"),
	content: text(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	duration: integer(),
	order: integer().notNull(),
	publishedAt: timestamp("published_at", { precision: 6, withTimezone: true, mode: 'string' }),
	status: classStatus().default('DRAFT').notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).notNull(),
}, (table) => {
	return {
		classCourseIdFkey: foreignKey({
			columns: [table.courseId],
			foreignColumns: [course.courseId],
			name: "Class_course_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});

export const category = pgTable("Category", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).notNull(),
}, (table) => {
	return {
		nameKey: uniqueIndex("Category_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
	}
});

export const resource = pgTable("Resource", {
	id: serial().primaryKey().notNull(),
	classId: integer("class_id").notNull(),
	title: text().notNull(),
	type: text().notNull(),
	url: text().notNull(),
	createdAt: timestamp("created_at", { precision: 6, withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).notNull(),
}, (table) => {
	return {
		resourceClassIdFkey: foreignKey({
			columns: [table.classId],
			foreignColumns: [class.classId],
			name: "Resource_class_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	}
});
