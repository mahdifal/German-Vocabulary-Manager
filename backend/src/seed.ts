/**
 * Seed script — populates vocabulary entries for a given user.
 * Usage:  bun run seed --email=you@example.com
 *         bun run seed --user-id=<uuid>
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(import.meta.dir, '../../backend/.env') });
// Also try the local .env
config({ path: resolve(import.meta.dir, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SECRET_KEY in backend/.env');
  process.exit(1);
}

const admin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Resolve user id ──────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v];
  }),
);

async function resolveUserId(): Promise<string> {
  if (args['user-id']) return args['user-id'];

  if (args['email']) {
    const { data, error } = await admin.auth.admin.listUsers();
    if (error) throw new Error(`Failed to list users: ${error.message}`);
    const user = data.users.find((u) => u.email === args['email']);
    if (!user) throw new Error(`No user found with email "${args['email']}"`);
    return user.id;
  }

  // Fall back to the first user in the project
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(`Failed to list users: ${error.message}`);
  if (data.users.length === 0) throw new Error('No users found. Sign up first.');
  const user = data.users[0];
  console.log(`ℹ️  No --email/--user-id given. Using first user: ${user.email}`);
  return user.id;
}

// ── Seed data ────────────────────────────────────────────────────────────────

const WORDS = [
  // A1
  { german_word: 'Haus', article: 'das', persian_translation: 'خانه', example_sentence: 'Das Haus ist groß.', level: 'A1' },
  { german_word: 'Hund', article: 'der', persian_translation: 'سگ', example_sentence: 'Der Hund bellt laut.', level: 'A1' },
  { german_word: 'Katze', article: 'die', persian_translation: 'گربه', example_sentence: 'Die Katze schläft auf dem Sofa.', level: 'A1' },
  { german_word: 'Buch', article: 'das', persian_translation: 'کتاب', example_sentence: 'Ich lese ein Buch.', level: 'A1' },
  { german_word: 'Wasser', article: 'das', persian_translation: 'آب', example_sentence: 'Ich trinke Wasser.', level: 'A1' },
  { german_word: 'Kind', article: 'das', persian_translation: 'کودک', example_sentence: 'Das Kind spielt im Garten.', level: 'A1' },
  { german_word: 'Mann', article: 'der', persian_translation: 'مرد', example_sentence: 'Der Mann liest die Zeitung.', level: 'A1' },
  { german_word: 'Frau', article: 'die', persian_translation: 'زن', example_sentence: 'Die Frau kocht das Essen.', level: 'A1' },

  // A2
  { german_word: 'Bahnhof', article: 'der', persian_translation: 'ایستگاه قطار', example_sentence: 'Der Bahnhof ist in der Stadtmitte.', level: 'A2' },
  { german_word: 'Straße', article: 'die', persian_translation: 'خیابان', example_sentence: 'Die Straße ist sehr lang.', level: 'A2' },
  { german_word: 'Arbeit', article: 'die', persian_translation: 'کار', example_sentence: 'Er geht jeden Tag zur Arbeit.', level: 'A2' },
  { german_word: 'Freund', article: 'der', persian_translation: 'دوست (مذکر)', example_sentence: 'Mein Freund wohnt in Berlin.', level: 'A2' },
  { german_word: 'Schule', article: 'die', persian_translation: 'مدرسه', example_sentence: 'Die Kinder gehen in die Schule.', level: 'A2' },
  { german_word: 'Sprache', article: 'die', persian_translation: 'زبان', example_sentence: 'Deutsch ist eine schöne Sprache.', level: 'A2' },

  // B1
  { german_word: 'Erfahrung', article: 'die', persian_translation: 'تجربه', example_sentence: 'Sie hat viel Erfahrung in diesem Beruf.', level: 'B1' },
  { german_word: 'Meinung', article: 'die', persian_translation: 'نظر / عقیده', example_sentence: 'Meiner Meinung nach ist das richtig.', level: 'B1' },
  { german_word: 'Entscheidung', article: 'die', persian_translation: 'تصمیم', example_sentence: 'Das war eine schwierige Entscheidung.', level: 'B1' },
  { german_word: 'Gelegenheit', article: 'die', persian_translation: 'فرصت', example_sentence: 'Ich hatte keine Gelegenheit, ihn zu treffen.', level: 'B1' },
  { german_word: 'Verhalten', article: 'das', persian_translation: 'رفتار', example_sentence: 'Sein Verhalten war sehr seltsam.', level: 'B1' },

  // B2
  { german_word: 'Verantwortung', article: 'die', persian_translation: 'مسئولیت', example_sentence: 'Er trägt die Verantwortung für das Projekt.', level: 'B2' },
  { german_word: 'Zusammenhang', article: 'der', persian_translation: 'ارتباط / پیوند', example_sentence: 'Der Zusammenhang zwischen den Ereignissen ist klar.', level: 'B2' },
  { german_word: 'Voraussetzung', article: 'die', persian_translation: 'پیش‌نیاز / شرط', example_sentence: 'Gute Sprachkenntnisse sind Voraussetzung für den Job.', level: 'B2' },
  { german_word: 'Gesellschaft', article: 'die', persian_translation: 'جامعه', example_sentence: 'Die Gesellschaft verändert sich ständig.', level: 'B2' },

  // C1
  { german_word: 'Beeinträchtigung', article: 'die', persian_translation: 'اختلال / آسیب', example_sentence: 'Eine Beeinträchtigung des Sehvermögens kann verschiedene Ursachen haben.', level: 'C1' },
  { german_word: 'Auseinandersetzung', article: 'die', persian_translation: 'بحث / درگیری', example_sentence: 'Es kam zu einer heftigen Auseinandersetzung zwischen den Parteien.', level: 'C1' },
  { german_word: 'Erschöpfung', article: 'die', persian_translation: 'خستگی شدید / فرسودگی', example_sentence: 'Nach der langen Reise litt er unter totaler Erschöpfung.', level: 'C1' },

  // C2
  { german_word: 'Weltanschauung', article: 'die', persian_translation: 'جهان‌بینی', example_sentence: 'Seine Weltanschauung wurde durch die Philosophie Kants geprägt.', level: 'C2' },
  { german_word: 'Fingerspitzengefühl', article: 'das', persian_translation: 'ظرافت / حساسیت در برخورد', example_sentence: 'In dieser Situation braucht man viel Fingerspitzengefühl.', level: 'C2' },
  { german_word: 'Verschlimmbessern', article: 'das', persian_translation: 'بدتر کردن در تلاش برای بهتر کردن', example_sentence: 'Durch sein Eingreifen kam es zu einem klassischen Verschlimmbessern.', level: 'C2' },
] as const;

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const userId = await resolveUserId();
  console.log(`\n🌱 Seeding ${WORDS.length} words for user ${userId}...\n`);

  const rows = WORDS.map((w) => ({ ...w, user_id: userId }));

  const { data, error } = await admin
    .from('vocabularies')
    .insert(rows)
    .select('id, german_word, level');

  if (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Inserted:');
  for (const row of data ?? []) {
    console.log(`   [${row.level}] ${row.german_word}`);
  }
  console.log(`\nDone — ${data?.length ?? 0} words added.`);
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
