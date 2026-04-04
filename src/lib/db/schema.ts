import { pgTable, text, timestamp, uuid, date, decimal, pgEnum, serial, integer, boolean, unique, jsonb, vector, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ====================================================================
// 1. ENUMS 정의
// ====================================================================

// 반려동물 관련 ENUMS
export const speciesEnum = pgEnum('species', ['DOG', 'CAT']);
export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE']);
export const neuteredEnum = pgEnum('neutered', ['Y', 'N', 'UNKNOWN']);
export const regStatusEnum = pgEnum('reg_status', ['Y', 'N']);

// 서비스/예약 관련 ENUMS (견고성 강화)
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const carStatusEnum = pgEnum('car_status', ['active', 'maintenance', 'inactive']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed']);
export const paymentStatusEnum = pgEnum('payment_status', ['unpaid', 'paid', 'refunded']);
export const serviceTypeEnum = pgEnum('service_type', ['SHUTTLE', 'CARE', 'OTHER']); // 서비스 타입 예시

// ====================================================================
// 2. 테이블 정의
// ====================================================================

// 1. 사용자 테이블 (User Table)
export const users = pgTable('users', {
    id: uuid('user_id').primaryKey(), // Supabase auth.users.id와 연결
    snsProvider: text('sns_provider').notNull(), // KAKAO, GOOGLE
    // snsId를 NotNull로 설정하고 Unique Index를 추가하여 계정 충돌 방지
    snsId: text('sns_id').notNull().unique(),
    nickname: text('nickname'),
    // email에 Unique Index를 추가하여 중복 가입 방지 (선택 사항)
    email: text('email').unique(),
    avatarUrl: text('avatar_url'), // URL 길이를 제한하여 안정성 확보 (drizzle pg-core text doesn't explicitly curb length in DDL usually, but verified user request kept it as text with comment)
    // role을 ENUM으로 변경하여 데이터 일관성 확보
    role: userRoleEnum('role').default('user').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. 반려동물 테이블 (Pet Table)
export const pets = pgTable('pets', {
    id: uuid('pet_id').defaultRandom().primaryKey(),
    // FK 설정 시 users.id를 직접 참조
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    petName: text('pet_name').notNull(),
    species: speciesEnum('species').notNull(),
    regStatus: regStatusEnum('reg_status').notNull(),
    // regNum에 unique 제약 대신 index만 설정하는 것을 고려 (선택 사항)
    regNum: text('reg_num').unique(),
    breed: text('breed').notNull(),
    gender: genderEnum('gender').notNull(),
    neutered: neuteredEnum('neutered').notNull(),
    birthDate: date('birth_date').notNull(),
    adoptionDate: date('adoption_date'),
    weightKg: decimal('weight_kg', { precision: 4, scale: 2 }),
    furColor: text('fur_color'),
    // 건강 고민은 JSONB를 사용하여 여러 개의 값을 저장하도록 변경 권장 (현재는 text 유지)
    healthConcerns: text('health_concerns'),
    profilePhotoUrl: text('profile_photo_url'), // URL 길이를 제한하여 안정성 확보
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. 차량/서비스 테이블 (Cars Table)
export const cars = pgTable('cars', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    region: text('region').notNull(),
    // status를 ENUM으로 변경
    status: carStatusEnum('status').default('active').notNull(),
});

// 4. 예약 테이블 (Bookings Table)
export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    // FK 설정
    userId: uuid('user_id').references(() => users.id).notNull(),
    carId: uuid('car_id').references(() => cars.id).notNull(),
    // serviceType을 ENUM으로 변경
    serviceType: serviceTypeEnum('service_type').notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    pickupAddress: text('pickup_address').notNull(),
    dropoffAddress: text('dropoff_address').notNull(),
    // status를 ENUM으로 변경
    status: bookingStatusEnum('status').default('pending').notNull(),
    // paymentStatus를 ENUM으로 변경
    paymentStatus: paymentStatusEnum('payment_status').default('unpaid').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});


// ====================================================================
// 3. RELATIONS 정의
// ====================================================================

// Users (1:N 관계: User - Pet, User - Booking)
export const usersRelations = relations(users, ({ many }) => ({
    pets: many(pets),
    bookings: many(bookings),
}));

// Pets (N:1 관계: Pet - Owner)
export const petsRelations = relations(pets, ({ one }) => ({
    owner: one(users, {
        fields: [pets.userId],
        references: [users.id],
    }),
}));

// Bookings (N:1 관계: Booking - User, Booking - Car)
// Bookings (N:1 관계: Booking - User, Booking - Car)
export const bookingsRelations = relations(bookings, ({ one }) => ({
    user: one(users, {
        fields: [bookings.userId],
        references: [users.id],
    }),
    car: one(cars, {
        fields: [bookings.carId],
        references: [cars.id],
    }),
}));


// ====================================================================
// NEW: 콘테스트 관련 테이블
// ====================================================================

// 1. 콘테스트 시즌 정보
export const contests = pgTable("contests", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    isActive: boolean("is_active").default(true),
    bannerImage: text("banner_image"),
});

// 2. 출품작
export const contestEntries = pgTable("contest_entries", {
    id: serial("id").primaryKey(),
    contestId: integer("contest_id").references(() => contests.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    petId: uuid("pet_id").references(() => pets.id).notNull(),
    imageUrl: text("image_url").notNull(),
    caption: text("caption"),
    voteCount: integer("vote_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

// 3. 투표 기록
export const contestVotes = pgTable("contest_votes", {
    id: serial("id").primaryKey(),
    entryId: integer("entry_id").references(() => contestEntries.id).notNull(),
    voterId: uuid("voter_id").references(() => users.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
    unq: unique().on(t.entryId, t.voterId),
}));

// ====================================================================
// NEW: 멍BTI 관련 테이블
// ====================================================================

// 1. 멍BTI 결과 유형 정의
export const mbtiTypes = pgTable("mbti_types", {
    id: serial("id").primaryKey(),
    code: text("code").notNull(), // 예: "ESAL"
    name: text("name").notNull(), // 예: "파워 에너자이저"
    description: text("description").notNull(),
    badgeIcon: text("badge_icon").notNull(), // Pass 카드에 들어갈 아이콘 URL
    recommendServiceId: integer("recommend_service_id"), // 추천할 서비스 ID 연결
});

// 2. 펫별 검사 결과 저장
export const petMbtiResults = pgTable("pet_mbti_results", {
    id: serial("id").primaryKey(),
    petId: uuid("pet_id").references(() => pets.id).notNull(),
    mbtiTypeId: integer("mbti_type_id").references(() => mbtiTypes.id).notNull(),
    scoreData: jsonb("score_data"), // { energy: 80, social: 20 ... } 상세 점수 저장
    createdAt: timestamp("created_at").defaultNow(),
});

// ====================================================================
// NEW: SNS / Social Features
// ====================================================================

// 1. 팔로우 테이블 (User -> User/Pet)
// 기획상 "두부(강아지)랑 친구하기"지만, 기술적으로는 User(보호자) 간의 팔로우입니다.
// 보여줄 때만 "두부"를 팔로우하는 것처럼 UI 처리.
export const follows = pgTable("follows", {
    followerId: uuid("follower_id").references(() => users.id).notNull(), // 나
    followingId: uuid("following_id").references(() => users.id).notNull(), // 상대방 (강아지 보호자)
    createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
    pk: unique().on(t.followerId, t.followingId), // 중복 팔로우 방지
}));

// 2. 통합 게시물 테이블 (Posts)
// 콘테스트용 + 일상용(Daily) 모두 포함
export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    petId: uuid("pet_id").references(() => pets.id).notNull(), // 어떤 강아지의 사진인지
    imageUrl: text("image_url").notNull(),
    caption: text("caption"),
    postType: text("post_type").default('DAILY').notNull(), // 'CONTEST' | 'DAILY'
    likesCount: integer("likes_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

// 3. 댓글 테이블 (Comments) - Optional but recommended for retention
export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    postId: integer("post_id").references(() => posts.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// Relations for Social
export const postsRelations = relations(posts, ({ one, many }) => ({
    user: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    pet: one(pets, {
        fields: [posts.petId],
        references: [pets.id],
    }),
    comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
}));

// ====================================================================
// NEW: Pet Pick (Balance Game)
// ====================================================================

// 1. 투표(Poll) 테이블
export const polls = pgTable("polls", {
    id: serial("id").primaryKey(),
    creatorId: uuid("creator_id").references(() => users.id), // 만든 사람 (Admin 등)
    title: text("title").notNull(), // 질문 (예: "다음 상품은?")
    pollType: text("poll_type").default('VS_IMAGE').notNull(), // 'VS_IMAGE', 'MULTIPLE_CHOICE'
    status: text("status").default('OPEN').notNull(), // 'OPEN', 'CLOSED'
    createdAt: timestamp("created_at").defaultNow(),
});

// 2. 투표 선택지(Poll Options) 테이블
export const pollOptions = pgTable("poll_options", {
    id: serial("id").primaryKey(),
    pollId: integer("poll_id").references(() => polls.id).notNull(),
    optionText: text("option_text").notNull(), // "A. 다이슨"
    imageUrl: text("image_url"), // 이미지 (있을 경우)
    voteCount: integer("vote_count").default(0), // 단순 집계용 (실시간성은 Redis 권장하나 초기엔 DB로)
});

// 3. 투표 참여 기록(Poll Votes) - 중복 방지
export const pollVotes = pgTable("poll_votes", {
    id: serial("id").primaryKey(),
    pollId: integer("poll_id").references(() => polls.id).notNull(),
    optionId: integer("option_id").references(() => pollOptions.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
    unq: unique().on(t.pollId, t.userId), // 한 투표당 한 번만 참여 가능
}));

// 4. 투표 댓글(Poll Comments)
export const pollComments = pgTable("poll_comments", {
    id: serial("id").primaryKey(),
    pollId: integer("poll_id").references(() => polls.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// Relations for Polls
export const pollsRelations = relations(polls, ({ many }) => ({
    options: many(pollOptions),
    votes: many(pollVotes),
    comments: many(pollComments),
}));

export const pollOptionsRelations = relations(pollOptions, ({ one, many }) => ({
    poll: one(polls, {
        fields: [pollOptions.pollId],
        references: [polls.id],
    }),
    votes: many(pollVotes),
}));

export const pollVotesRelations = relations(pollVotes, ({ one }) => ({
    poll: one(polls, {
        fields: [pollVotes.pollId],
        references: [polls.id],
    }),
    option: one(pollOptions, {
        fields: [pollVotes.optionId],
        references: [pollOptions.id],
    }),
    user: one(users, {
        fields: [pollVotes.userId],
        references: [users.id],
    }),
}));

export const pollCommentsRelations = relations(pollComments, ({ one }) => ({
    poll: one(polls, {
        fields: [pollComments.pollId],
        references: [polls.id],
    }),
    user: one(users, {
        fields: [pollComments.userId],
        references: [users.id],
    }),
}));
// ====================================================================
// NEW: AI / RAG 관련 테이블
// ====================================================================

// 1. AI 지식 베이스 (Vector Store)
export const aiKnowledge = pgTable("ai_knowledge", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(), // 실제 텍스트 내용
    embedding: vector("embedding", { dimensions: 768 }), // Gemini 1.5 Flash Embedding (768)
    metadata: jsonb("metadata"), // 데이터 출처, 태그 등
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    embeddingIndex: index("embedding_index").using("hnsw", table.embedding.op("vector_cosine_ops")),
}));
