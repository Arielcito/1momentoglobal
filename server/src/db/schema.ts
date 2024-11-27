import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  boolean,
  integer,
  serial,
  decimal
} from "drizzle-orm/pg-core";

// Tabla User
export const users = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified"),
  image: text("image"),
  password: text("password"),
  passwordResetToken: text("passwordResetToken").unique(),
  passwordResetTokenExp: timestamp("passwordResetTokenExp"),
  username: text("username").notNull().unique(),
  full_name: text("full_name"),
  is_admin: boolean("is_admin").default(false),
  created_at: timestamp("created_at").defaultNow()
});

// Tabla Category
export const categories = pgTable("Category", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Tabla Course
export const courses = pgTable("Course", {
  course_id: serial("course_id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  instructor_id: uuid("instructor_id").references(() => users.id),
  category_id: integer("category_id").references(() => categories.id),
  image_url: text("image_url"),
  price: decimal("price"),
  level: text("level"),
  status: text("status").default('DRAFT'),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  published_at: timestamp("published_at")
});

// Tabla Class
export const classes = pgTable("Class", {
  class_id: serial("class_id").primaryKey(),
  course_id: integer("course_id").references(() => courses.course_id),
  title: text("title").notNull(),
  description: text("description"),
  scheduled_at: timestamp("scheduled_at"),
  is_live: boolean("is_live").default(false),
  recording_url: text("recording_url"),
  content: text("content"),
  duration: integer("duration"),
  order: integer("order"),
  status: text("status").default('DRAFT'),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  published_at: timestamp("published_at")
});

// Tabla Stream
export const streams = pgTable("Stream", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  thumbnail_url: text("thumbnail_url"),
  description: text("description"),
  title: text("title"),
  userId: uuid("userId").references(() => users.id),
  isLive: boolean("isLive").default(false),
  isChatEnabled: boolean("isChatEnabled").default(false),
  isChatDelayed: boolean("isChatDelayed").default(false)
}); 