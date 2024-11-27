import { relations } from "drizzle-orm/relations";
import { category, course, user, stream, account, session, enrollment, membership, payment, notification, classes, resource } from "./schema";

export const courseRelations = relations(course, ({one, many}) => ({
	category: one(category, {
		fields: [course.categoryId],
		references: [category.id]
	}),
	user: one(user, {
		fields: [course.instructorId],
		references: [user.id]
	}),
	enrollments: many(enrollment),
	classes: many(classes)
}));

export const categoryRelations = relations(category, ({many}) => ({
	courses: many(course),
}));

export const userRelations = relations(user, ({many}) => ({
	courses: many(course),
	streams: many(stream),
	accounts: many(account),
	sessions: many(session),
	enrollments: many(enrollment),
	memberships: many(membership),
	payments: many(payment),
	notifications: many(notification),
}));

export const streamRelations = relations(stream, ({one}) => ({
	user: one(user, {
		fields: [stream.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const enrollmentRelations = relations(enrollment, ({one}) => ({
	course: one(course, {
		fields: [enrollment.courseId],
		references: [course.courseId]
	}),
	user: one(user, {
		fields: [enrollment.userId],
		references: [user.id]
	}),
}));

export const membershipRelations = relations(membership, ({one}) => ({
	user: one(user, {
		fields: [membership.userId],
		references: [user.id]
	}),
}));

export const paymentRelations = relations(payment, ({one}) => ({
	user: one(user, {
		fields: [payment.userId],
		references: [user.id]
	}),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	user: one(user, {
		fields: [notification.userId],
		references: [user.id]
	}),
}));

export const classesRelations = relations(classes, ({one, many}) => ({
	course: one(course, {
		fields: [classes.courseId],
		references: [course.courseId]
	}),
	resources: many(resource),
}));

export const resourceRelations = relations(resource, ({one}) => ({
	class: one(classes, {
		fields: [resource.classId],
		references: [classes.classId]
	}),
}));