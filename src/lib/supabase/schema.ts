import { bigint, boolean, foreignKey, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { pricingPlanInterval, pricingType, subscriptionStatus } from '../../../migrations/schema';
import { sql } from 'drizzle-orm';

export const Workspaces = pgTable('workspaces', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', {
        withTimezone: true,
        mode: 'string'
    }),
    workspaceOwner: uuid('workspace_owner').notNull(),
    title: text('title').notNull(),
    data: text('data'),
    iconId: text('icon_id').notNull(),
    inTrash: text('in_trash'),
    updatedAt: timestamp('updated_at', {
        withTimezone: true,
        mode: 'string'
    }),
    logo: text('logo'),
    bannerUrl: text('banner_url'),    
});

export const Folders = pgTable('folders', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
    title: text('title').notNull(),
    iconId: text('icon_id').notNull(),
    data: text('data'),
    inTrash: text('in_trash'),
    bannerUrl: text('banner_url'),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => Workspaces.id, {
        onDelete: 'cascade',
      }),
  });

  export const Files = pgTable('files', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
    title: text('title').notNull(),
    iconId: text('icon_id').notNull(),
    data: text('data'),
    inTrash: text('in_trash'),
    bannerUrl: text('banner_url'),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => Workspaces.id, {
        onDelete: 'cascade',
      }),
    folderId: uuid('folder_id')
      .notNull()
      .references(() => Folders.id, {
        onDelete: 'cascade',
      }),
  });


  export const Users = pgTable("users", {
    id: uuid("id").primaryKey().notNull(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
    billingAddress: jsonb("billing_address"),
    paymentMethod: jsonb("payment_method"),
    email: text("email"),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
  },
  (table) => {
    return {
      usersIdFkey: foreignKey({
        columns: [table.id],
        foreignColumns: [table.id],
        name: "users_id_fkey"
      }),
    }
  });
  
  export const Customers = pgTable("customers", {
    id: uuid("id").primaryKey().notNull().references(() => Users.id),
    stripeCustomerId: text("stripe_customer_id"),
  });
  
  export const Products = pgTable("products", {
    id: text("id").primaryKey().notNull(),
    active: boolean("active"),
    name: text("name"),
    description: text("description"),
    image: text("image"),
    metadata: jsonb("metadata"),
  });
  
  export const Prices = pgTable("prices", {
    id: text("id").primaryKey().notNull(),
    productId: text("product_id").references(() => Products.id),
    active: boolean("active"),
    description: text("description"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    unitAmount: bigint("unit_amount", { mode: "number" }),
    currency: text("currency"),
    type: pricingType("type"),
    interval: pricingPlanInterval("interval"),
    intervalCount: integer("interval_count"),
    trialPeriodDays: integer("trial_period_days"),
    metadata: jsonb("metadata"),
  });
  
  export const Subscriptions = pgTable("subscriptions", {
    id: text("id").primaryKey().notNull(),
    userId: uuid("user_id").notNull().references(() => Users.id),
    status: subscriptionStatus("status"),
    metadata: jsonb("metadata"),
    priceId: text("price_id").references(() => Prices.id),
    quantity: integer("quantity"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end"),
    created: timestamp("created", { withTimezone: true, mode: 'string' }).default(sql`now()`).notNull(),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true, mode: 'string' }).default(sql`now()`).notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true, mode: 'string' }).default(sql`now()`).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }).default(sql`now()`),
    cancelAt: timestamp("cancel_at", { withTimezone: true, mode: 'string' }).default(sql`now()`),
    canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }).default(sql`now()`),
    trialStart: timestamp("trial_start", { withTimezone: true, mode: 'string' }).default(sql`now()`),
    trialEnd: timestamp("trial_end", { withTimezone: true, mode: 'string' }).default(sql`now()`),
  });