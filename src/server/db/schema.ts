// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
	relations,
	type InferInsertModel,
	type InferSelectModel,
} from "drizzle-orm";
import {
	bigint,
	decimal,
	index,
	mysqlTableCreator,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `sojourn_${name}`);

export const user = mysqlTable(
	"User",
	{
		id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
		publicId: varchar("publicId", { length: 12 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		username: varchar("username", { length: 127 }).unique().notNull(),
	},
	(t) => ({
		userPublicId: uniqueIndex("userPublicId").on(t.publicId),
	}),
);

export type User = InferSelectModel<typeof user>;
export type InsertUser = InferInsertModel<typeof user>;
export const insertUserSchema = createInsertSchema(user);
export const selectUserSchema = createSelectSchema(user);

export const userRelations = relations(user, ({ many }) => ({
	followers: many(follower, { relationName: "followers" }),
	following: many(follower, { relationName: "following" }),
	logs: many(log),
	journey: many(journey),
}));

export const key = mysqlTable(
	"user_key",
	{
		id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
		userId: bigint("userId", { mode: "number" }).notNull(),
		hashedPassword: varchar("hashed_password", {
			length: 255,
		}),
	},
	(t) => ({
		keyUserIdx: index("keyUserIdx").on(t.userId),
	}),
);

export const session = mysqlTable(
	"user_session",
	{
		id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
		userId: bigint("userId", { mode: "number" }).notNull(),
		activeExpires: bigint("active_expires", {
			mode: "number",
		}).notNull(),
		idleExpires: bigint("idle_expires", {
			mode: "number",
		}).notNull(),
	},
	(t) => ({
		sessionUserIdx: index("sessionUserIdx").on(t.userId),
	}),
);

export const follower = mysqlTable(
	"Follower",
	{
		followerId: bigint("followerId", { mode: "number" }).notNull(),
		followingId: bigint("followingId", { mode: "number" }).notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.followerId, t.followingId] }),
	}),
);

export const followerRelations = relations(follower, ({ one }) => ({
	follower: one(user, {
		fields: [follower.followerId],
		references: [user.id],
		relationName: "followers",
	}),
	following: one(user, {
		fields: [follower.followingId],
		references: [user.id],
		relationName: "following",
	}),
}));

export const location = mysqlTable(
	"Location",
	{
		id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
		publicId: varchar("publicId", { length: 12 }).notNull(),
		name: varchar("name", { length: 128 }).notNull(),
		longitude: decimal("longitude", { precision: 8 }).notNull(),
		latitude: decimal("latitude", { precision: 8 }).notNull(),
	},
	(t) => ({
		locationPublicId: uniqueIndex("locationPublicId").on(t.publicId),
	}),
);
export type Location = InferSelectModel<typeof location>;
export type InsertLocation = InferInsertModel<typeof location>;
export const insertLocationSchema = createInsertSchema(location);
export const selectLocationSchema = createSelectSchema(location);

export const locationRelations = relations(location, ({ many }) => ({
	logs: many(log),
}));

export const journey = mysqlTable(
	"Journey",
	{
		id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
		publicId: varchar("publicId", { length: 12 }).notNull(),
		title: varchar("title", { length: 127 }).notNull(),
		startLocationId: bigint("startLocationId", { mode: "number" }).notNull(),
		endLocationId: bigint("endLocationId", { mode: "number" }).notNull(),
		userId: bigint("id", { mode: "number" }).notNull(),
	},
	(t) => ({
		startLocationIdx: index("startLocationIdx").on(t.startLocationId),
		endLocationIdx: index("endLocationIdx").on(t.endLocationId),
		journeyUserIdx: index("journeyUserIdx").on(t.userId),
		journeyPublicId: uniqueIndex("journeyPublicId").on(t.publicId),
	}),
);
export type Journey = InferSelectModel<typeof journey>;
export type InsertJourney = InferInsertModel<typeof journey>;
export const insertJourneySchema = createInsertSchema(journey);
export const selectJourneySchema = createSelectSchema(journey);

export const journeyRelations = relations(journey, ({ one, many }) => ({
	user: one(user, { fields: [journey.userId], references: [user.id] }),
	startLocation: one(location, {
		fields: [journey.startLocationId],
		references: [location.id],
		relationName: "journeyStartLocation",
	}),
	endLocation: one(location, {
		fields: [journey.endLocationId],
		references: [location.id],
		relationName: "journeyEndLocation",
	}),
	logs: many(log),
}));

export const log = mysqlTable(
	"Log",
	{
		id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
		publicId: varchar("publicId", { length: 12 }).notNull(),
		title: varchar("title", { length: 255 }).notNull(),
		bodyText: text("bodyText"),
		imageUrl: varchar("imageUrl", { length: 255 }),
		createdOn: timestamp("createdOn").defaultNow(),
		userId: bigint("userId", { mode: "number" }).notNull(),
		locationId: bigint("locationId", { mode: "number" }).notNull(),
		journeyId: bigint("journeyId", { mode: "number" }),
	},
	(t) => ({
		logUserIdx: index("logUserIdx").on(t.userId),
		logLocationIdx: index("logLocationIdx").on(t.locationId),
		logJourneyIdx: index("logJourneyIdx").on(t.journeyId),
		logPublicId: uniqueIndex("logPublicId").on(t.publicId),
	}),
);
export type Log = InferSelectModel<typeof log>;
export type InsertLog = InferInsertModel<typeof log>;
export const insertLogSchema = createInsertSchema(log);
export const selectLogSchema = createSelectSchema(log);

export const logRelations = relations(log, ({ one }) => ({
	user: one(user, { fields: [log.userId], references: [user.id] }),
	location: one(location, {
		fields: [log.locationId],
		references: [location.id],
	}),
	journey: one(journey, { fields: [log.journeyId], references: [journey.id] }),
}));
